import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { enviarMensagem } from '@/lib/whatsapp/client'

export async function POST(req: NextRequest) {
  const token = req.headers.get('asaas-access-token')
  if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { event, payment, subscription } = body
  const supabase = createServiceClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dadosfazenda.com.br'

  // ── Consulta avulsa (externalReference = "consulta:<uuid>") ──────────────────
  const externalRef = payment?.externalReference as string | undefined
  if (externalRef?.startsWith('consulta:')) {
    const consultaId = externalRef.replace('consulta:', '')
    const pago = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'].includes(event)

    if (pago) {
      await supabase
        .from('consultas_avulsas')
        .update({ status_pagamento: 'pago' })
        .eq('id', consultaId)
        .eq('status_pagamento', 'pendente')

      // Dispara entrega
      fetch(`${appUrl}/api/consulta/entregar/${consultaId}`, {
        method: 'POST',
        headers: { 'x-internal-secret': process.env.CRON_SECRET ?? '' },
      }).catch(() => {})
    }

    if (event === 'PAYMENT_DELETED') {
      await supabase
        .from('consultas_avulsas')
        .update({ status_pagamento: 'falhou' })
        .eq('id', consultaId)
    }

    return NextResponse.json({ ok: true })
  }

  // ── Assinatura mensal ────────────────────────────────────────────────────────
  const assinatura_id = subscription?.id ?? payment?.subscription
  if (!assinatura_id) return NextResponse.json({ ok: true })

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('asaas_subscription_id', assinatura_id)
    .single()

  if (!usuario) return NextResponse.json({ ok: true })

  switch (event) {
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED': {
      await supabase
        .from('usuarios')
        .update({ status_assinatura: 'ativa' })
        .eq('id', usuario.id)

      await enviarMensagem(
        usuario.telefone,
        `✅ *Pagamento confirmado!*\n\n` +
        `Seu plano *${usuario.plano}* está ativo.\n` +
        `Envie uma localização ou código CAR para consultar sua propriedade.`,
      )
      break
    }

    case 'PAYMENT_OVERDUE': {
      await supabase
        .from('usuarios')
        .update({ status_assinatura: 'inadimplente' })
        .eq('id', usuario.id)

      await enviarMensagem(
        usuario.telefone,
        `⚠️ *Pagamento em atraso*\n\n` +
        `Regularize sua assinatura para continuar consultando:\n` +
        `${appUrl}/planos`,
      )
      break
    }

    case 'SUBSCRIPTION_DELETED':
    case 'PAYMENT_DELETED': {
      await supabase
        .from('usuarios')
        .update({ status_assinatura: 'cancelada' })
        .eq('id', usuario.id)

      await enviarMensagem(
        usuario.telefone,
        `❌ *Assinatura cancelada.*\n\nPara reativar: ${appUrl}/planos`,
      )
      break
    }
  }

  return NextResponse.json({ ok: true })
}
