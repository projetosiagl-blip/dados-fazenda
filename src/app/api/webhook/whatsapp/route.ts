import { NextRequest, NextResponse } from 'next/server'
import { parseMensagem } from '@/lib/whatsapp/parser'
import { enviarMensagem } from '@/lib/whatsapp/client'
import { processarConsulta } from '@/lib/consulta'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Ignora mensagens enviadas pelo próprio bot
    const fromMe = payload?.data?.key?.fromMe
    if (fromMe) return NextResponse.json({ ok: true })

    const mensagem = parseMensagem(payload)
    if (!mensagem) return NextResponse.json({ ok: true })

    const supabase = createServiceClient()

    // Busca ou cria usuário
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('telefone', mensagem.telefone)
      .single()

    if (!usuario) {
      // Usuário novo — manda mensagem de boas vindas
      await enviarMensagem(
        mensagem.telefone,
        `👋 Olá${mensagem.nome ? `, ${mensagem.nome}` : ''}! Bem-vindo ao *Dados Fazenda*.\n\n` +
        `Para consultar uma propriedade rural, envie:\n` +
        `📍 *Sua localização* pelo WhatsApp, ou\n` +
        `🔑 O *código CAR* da propriedade (ex: GO-1234567-XXXXX)\n\n` +
        `Para assinar um plano acesse: ${process.env.NEXT_PUBLIC_APP_URL}/planos`
      )

      await supabase.from('usuarios').insert({
        telefone: mensagem.telefone,
        nome: mensagem.nome ?? 'Usuário',
        plano: null,
        status_assinatura: null,
      })

      return NextResponse.json({ ok: true })
    }

    // Verifica assinatura ativa
    if (!usuario.status_assinatura || usuario.status_assinatura === 'cancelada') {
      await enviarMensagem(
        mensagem.telefone,
        `⚠️ Você não possui uma assinatura ativa.\n\n` +
        `Assine agora em: ${process.env.NEXT_PUBLIC_APP_URL}/planos\n\n` +
        `Planos a partir de R$ 59,90/mês.`
      )
      return NextResponse.json({ ok: true })
    }

    if (mensagem.tipo === 'texto') {
      await enviarMensagem(
        mensagem.telefone,
        `Para consultar uma propriedade, envie:\n` +
        `📍 Sua *localização* pelo WhatsApp, ou\n` +
        `🔑 O *código CAR* da propriedade`
      )
      return NextResponse.json({ ok: true })
    }

    // Processa consulta
    await enviarMensagem(mensagem.telefone, `⏳ Consultando dados da propriedade, aguarde...`)

    const resultado = await processarConsulta(mensagem, usuario.plano)

    await enviarMensagem(mensagem.telefone, resultado.texto)

    // Salva consulta no histórico
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
