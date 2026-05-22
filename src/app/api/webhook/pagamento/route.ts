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
        `Envie uma localização ou código CAR para consultar sua propriedade.`
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
        `${process.env.NEXT_PUBLIC_APP_URL}/planos`
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
        `❌ *Assinatura cancelada.*\n\n` +
        `Para reativar: ${process.env.NEXT_PUBLIC_APP_URL}/planos`
      )
      break
    }
  }

  return NextResponse.json({ ok: true })
}
