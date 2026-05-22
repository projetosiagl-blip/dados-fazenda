import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { gerarFarmScanPDF } from '@/lib/pdf/farmScan'
import { enviarArquivo } from '@/lib/whatsapp/client'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const { data: propriedades } = await supabase
    .from('propriedades')
    .select('*, usuarios(telefone, plano, status_assinatura)')
    .eq('monitorada', true)
    .eq('ativa', true)

  if (!propriedades?.length) {
    return NextResponse.json({ ok: true, gerados: 0 })
  }

  let gerados = 0

  for (const prop of propriedades) {
    const usuario = prop.usuarios as { telefone: string; plano: string; status_assinatura: string }
    if (!usuario || usuario.status_assinatura !== 'ativa') continue
    if (usuario.plano === 'basico') continue // Farm Scan é Full+

    const { data: alertasMes } = await supabase
      .from('alertas')
      .select('descricao')
      .eq('propriedade_id', prop.id)
      .gte('criado_em', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

    const snapshot = prop.ultimo_snapshot as { embargos?: unknown[]; queimadas_24h?: number } | null

    const pdf = await gerarFarmScanPDF({
      propriedade: prop.nome,
      municipio: prop.municipio ?? '',
      estado: prop.estado ?? '',
      area_ha: prop.area_ha ?? 0,
      car: prop.car_codigo ?? '',
      mes: mesAtual,
      embargos: snapshot?.embargos?.length ?? 0,
      queimadas: snapshot?.queimadas_24h ?? 0,
      alertas: alertasMes?.map(a => a.descricao) ?? [],
      status_car: 'Ativo',
    })

    // Salva no Supabase Storage
    const nomeArquivo = `farm-scan-${prop.id}-${new Date().getMonth() + 1}-${new Date().getFullYear()}.pdf`
    const { data: upload } = await supabase.storage
      .from('relatorios')
      .upload(nomeArquivo, pdf, { contentType: 'application/pdf', upsert: true })

    if (upload) {
      const { data: urlData } = supabase.storage.from('relatorios').getPublicUrl(nomeArquivo)

      try {
        await enviarArquivo(
          usuario.telefone,
          urlData.publicUrl,
          `Farm-Scan-${prop.nome}-${mesAtual}.pdf`
        )
      } catch { /* WhatsApp não configurado ainda */ }
    }

    gerados++
  }

  return NextResponse.json({ ok: true, gerados, executado_em: new Date().toISOString() })
}
