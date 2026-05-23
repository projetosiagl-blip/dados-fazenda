import { NextRequest, NextResponse } from 'next/server'
import { parseMensagem } from '@/lib/whatsapp/parser'
import { enviarMensagem } from '@/lib/whatsapp/client'
import { processarConsulta } from '@/lib/consulta'
import { createServiceClient } from '@/lib/supabase/server'

const MSG_BOAS_VINDAS = (nome: string, url: string) =>
  `👋 Olá${nome ? `, ${nome}` : ''}! Bem-vindo ao *Dados Fazenda*.\n\n` +
  `🌾 Consulte qualquer fazenda do Brasil em segundos!\n\n` +
  `*Como usar:*\n` +
  `📍 Envie sua *localização* pelo WhatsApp\n` +
  `🔗 Cole um link do *Google Maps* ou Waze\n` +
  `🔑 Digite o *código CAR* (ex: GO-1234567-XXXXX)\n` +
  `📐 Cole as *coordenadas* (ex: -17.85, -50.92)\n\n` +
  `Para assinar: ${url}/planos`

const MSG_AJUDA = (url: string) =>
  `📋 *Menu de ajuda — Dados Fazenda*\n\n` +
  `*O que posso consultar:*\n` +
  `• CAR (Cadastro Ambiental Rural)\n` +
  `• INCRA / SIGEF / CCIR\n` +
  `• Embargos IBAMA\n` +
  `• Terras Indígenas e UCs\n` +
  `• Desmatamento (PRODES)\n` +
  `• Queimadas próximas _(Plano Full)_\n\n` +
  `*Como consultar:*\n` +
  `📍 Envie sua localização pelo WhatsApp\n` +
  `🔗 Cole um link do Google Maps\n` +
  `🔑 Digite o código CAR\n\n` +
  `*Painel web:* ${url}/dashboard\n` +
  `*Planos:* ${url}/planos`

const MSG_PLANOS = (url: string) =>
  `💳 *Planos Dados Fazenda*\n\n` +
  `🌱 *Básico — R$ 59,90/mês*\n` +
  `10 camadas: CAR, INCRA, embargos e mais\n\n` +
  `🌿 *Full — R$ 99,90/mês*\n` +
  `+25 camadas + monitoramento + alertas + PDF mensal\n\n` +
  `🏢 *Empresarial — R$ 397,00/mês*\n` +
  `Full + 2 acessos + gestão de equipe\n\n` +
  `👉 Assine em: ${url}/planos`

const MSG_SEM_ASSINATURA = (url: string) =>
  `⚠️ *Assinatura necessária*\n\n` +
  `Para consultar propriedades rurais você precisa de um plano ativo.\n\n` +
  `Planos a partir de *R$ 59,90/mês*\n` +
  `👉 ${url}/planos`

const MSG_INSTRUCOES =
  `Para consultar uma propriedade, envie:\n\n` +
  `📍 Sua *localização* pelo WhatsApp\n` +
  `🔗 Link do *Google Maps* ou Waze\n` +
  `🔑 O *código CAR* da propriedade\n` +
  `📐 As *coordenadas* (lat, lon)`

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    const fromMe = payload?.data?.key?.fromMe
    if (fromMe) return NextResponse.json({ ok: true })

    const mensagem = parseMensagem(payload)
    if (!mensagem) return NextResponse.json({ ok: true })

    const supabase = createServiceClient()
    const url = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dadosfazenda.com.br'

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('telefone', mensagem.telefone)
      .single()

    if (!usuario) {
      await enviarMensagem(mensagem.telefone, MSG_BOAS_VINDAS(mensagem.nome ?? '', url))
      await supabase.from('usuarios').insert({
        telefone: mensagem.telefone,
        nome: mensagem.nome ?? 'Usuário',
        plano: null,
        status_assinatura: null,
      })
      return NextResponse.json({ ok: true })
    }

    // Comandos especiais de texto
    if (mensagem.tipo === 'texto') {
      const txt = mensagem.texto ?? ''

      if (txt === '__ajuda__') {
        await enviarMensagem(mensagem.telefone, MSG_AJUDA(url))
        return NextResponse.json({ ok: true })
      }

      if (txt === '__planos__') {
        await enviarMensagem(mensagem.telefone, MSG_PLANOS(url))
        return NextResponse.json({ ok: true })
      }

      if (!usuario.status_assinatura || usuario.status_assinatura === 'cancelada') {
        await enviarMensagem(mensagem.telefone, MSG_SEM_ASSINATURA(url))
        return NextResponse.json({ ok: true })
      }

      await enviarMensagem(mensagem.telefone, MSG_INSTRUCOES)
      return NextResponse.json({ ok: true })
    }

    // Verifica assinatura para consulta
    if (!usuario.status_assinatura || usuario.status_assinatura === 'cancelada') {
      await enviarMensagem(mensagem.telefone, MSG_SEM_ASSINATURA(url))
      return NextResponse.json({ ok: true })
    }

    await enviarMensagem(mensagem.telefone, `⏳ Consultando dados da propriedade, aguarde alguns segundos...`)

    const resultado = await processarConsulta(mensagem, usuario.plano)
    await enviarMensagem(mensagem.telefone, resultado.texto)

    await supabase.from('consultas').insert({
      usuario_id: usuario.id,
      latitude: mensagem.latitude,
      longitude: mensagem.longitude,
      car_codigo: mensagem.car_codigo,
      resultado: resultado.dados,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook/whatsapp]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
