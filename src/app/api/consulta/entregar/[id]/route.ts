import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { processarConsulta } from '@/lib/consulta'
import { gerarFarmScanPDF } from '@/lib/pdf/farmScan'
import { enviarMensagem, enviarArquivo } from '@/lib/whatsapp/client'
import { MensagemWhatsApp } from '@/types'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = req.headers.get('x-internal-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const supabase = createServiceClient()

  const { data: consulta } = await supabase
    .from('consultas_avulsas')
    .select('*')
    .eq('id', id)
    .single()

  if (!consulta) {
    return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 })
  }

  if (consulta.status_pagamento === 'entregue') {
    return NextResponse.json({ ok: true, msg: 'já entregue' })
  }

  await supabase
    .from('consultas_avulsas')
    .update({ status_pagamento: 'processando' })
    .eq('id', id)

  try {
    const mensagem: MensagemWhatsApp = {
      tipo: consulta.car_codigo ? 'car' : 'localizacao',
      telefone: consulta.telefone,
      nome: consulta.nome ?? undefined,
      car_codigo: consulta.car_codigo ?? undefined,
      latitude: consulta.latitude ?? undefined,
      longitude: consulta.longitude ?? undefined,
    }

    const resultado = await processarConsulta(mensagem, 'full')

    let pdfUrl: string | null = null

    // Gera PDF apenas para relatório
    if (consulta.tipo === 'relatorio') {
      const car = resultado.dados.car
      try {
        const pdf = await gerarFarmScanPDF({
          propriedade: consulta.car_codigo ?? `${consulta.latitude},${consulta.longitude}`,
          municipio: car?.municipio ?? consulta.municipio ?? '',
          estado: car?.estado ?? consulta.estado ?? '',
          area_ha: car?.area_ha ?? 0,
          car: consulta.car_codigo ?? '',
          mes: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          embargos: resultado.dados.embargos.length,
          queimadas: 0,
          alertas: [],
          status_car: car?.status ?? 'Desconhecido',
        })

        const nomeArquivo = `relatorio-avulso-${id}.pdf`
        const { data: upload } = await supabase.storage
          .from('relatorios')
          .upload(nomeArquivo, pdf, { contentType: 'application/pdf', upsert: true })

        if (upload) {
          const { data: urlData } = supabase.storage.from('relatorios').getPublicUrl(nomeArquivo)
          pdfUrl = urlData.publicUrl
        }
      } catch (e) {
        console.error('[entregar] Erro ao gerar PDF:', e)
      }
    }

    // Salva resultado no banco
    await supabase
      .from('consultas_avulsas')
      .update({
        resultado: resultado.dados,
        pdf_url: pdfUrl,
        status_pagamento: 'entregue',
      })
      .eq('id', id)

    // Envia WhatsApp
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dadosfazenda.com.br'
    try {
      await enviarMensagem(consulta.telefone, resultado.texto)

      if (pdfUrl) {
        await enviarMensagem(
          consulta.telefone,
          `📄 *Seu Relatório Completo está pronto!*\n\nAcesse e baixe o PDF em:\n${appUrl}/relatorio/${id}\n\n_Link válido por 7 dias._`,
        )
        await enviarArquivo(consulta.telefone, pdfUrl, `Relatorio-DadosFazenda-${id}.pdf`)
      } else {
        await enviarMensagem(
          consulta.telefone,
          `\n📋 Veja o resumo completo em:\n${appUrl}/relatorio/${id}`,
        )
      }
    } catch (e) {
      console.error('[entregar] Erro ao enviar WhatsApp:', e)
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[consulta/entregar]', err)
    await supabase
      .from('consultas_avulsas')
      .update({ status_pagamento: 'falhou' })
      .eq('id', id)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
