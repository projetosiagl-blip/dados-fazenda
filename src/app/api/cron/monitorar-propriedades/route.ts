import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buscarEmbargos } from '@/lib/apis/ibama'
import { enviarMensagem } from '@/lib/whatsapp/client'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Busca todas as propriedades monitoradas com usuário ativo
  const { data: propriedades } = await supabase
    .from('propriedades')
    .select('*, usuarios(telefone, plano, status_assinatura)')
    .eq('monitorada', true)
    .eq('ativa', true)

  if (!propriedades?.length) {
    return NextResponse.json({ ok: true, verificadas: 0 })
  }

  let alertasGerados = 0

  for (const prop of propriedades) {
    const usuario = prop.usuarios as { telefone: string; plano: string; status_assinatura: string }
    if (!usuario || usuario.status_assinatura !== 'ativa') continue
    if (!prop.latitude || !prop.longitude) continue

    // Busca embargos atuais
    const embargosAtuais = await buscarEmbargos(prop.latitude, prop.longitude)

    // Compara com snapshot anterior
    const snapshotAnterior = prop.ultimo_snapshot as { embargos?: { seq_tad: string }[] } | null
    const idsAnteriores = new Set((snapshotAnterior?.embargos ?? []).map((e) => e.seq_tad))
    const novosEmbargos = embargosAtuais.filter(e => !idsAnteriores.has(e.seq_tad))

    if (novosEmbargos.length > 0) {
      // Cria alerta
      await supabase.from('alertas').insert({
        propriedade_id: prop.id,
        usuario_id: prop.usuario_id,
        tipo: 'embargo_ibama',
        descricao: `${novosEmbargos.length} novo(s) embargo(s) IBAMA detectado(s) próximo à propriedade`,
        dados: { embargos: novosEmbargos },
        enviado: false,
      })

      // Envia WhatsApp
      try {
        await enviarMensagem(
          usuario.telefone,
          `🚨 *Alerta — ${prop.nome}*\n\n` +
          `Detectamos *${novosEmbargos.length} novo(s) embargo(s) IBAMA* próximo à sua propriedade em *${prop.municipio} - ${prop.estado}*.\n\n` +
          `Acesse o painel para mais detalhes:\n${process.env.NEXT_PUBLIC_APP_URL}/dashboard/alertas`
        )
        await supabase.from('alertas').update({ enviado: true }).eq('propriedade_id', prop.id).eq('enviado', false)
      } catch { /* WhatsApp não configurado ainda */ }

      alertasGerados++
    }

    // Verifica queimadas próximas (raio 20km)
    const { data: queimadas } = await supabase
      .from('queimadas')
      .select('id')
      .gte('data_hora', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    // Atualiza snapshot
    await supabase.from('propriedades').update({
      ultimo_snapshot: { embargos: embargosAtuais, queimadas_24h: queimadas?.length ?? 0, atualizado_em: new Date().toISOString() }
    }).eq('id', prop.id)
  }

  return NextResponse.json({
    ok: true,
    verificadas: propriedades.length,
    alertas_gerados: alertasGerados,
    executado_em: new Date().toISOString()
  })
}
