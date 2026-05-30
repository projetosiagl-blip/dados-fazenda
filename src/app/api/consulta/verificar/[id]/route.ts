import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { buscarStatusPagamento } from '@/lib/pagamento/asaas'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: consulta } = await supabase
    .from('consultas_avulsas')
    .select('id, status_pagamento, asaas_payment_id')
    .eq('id', id)
    .single()

  if (!consulta) {
    return NextResponse.json({ error: 'Consulta não encontrada' }, { status: 404 })
  }

  // Já entregue
  if (consulta.status_pagamento === 'entregue') {
    return NextResponse.json({ pago: true })
  }

  // Falhou
  if (consulta.status_pagamento === 'falhou') {
    return NextResponse.json({ pago: false, falhou: true })
  }

  // Verifica no Asaas
  if (consulta.asaas_payment_id) {
    try {
      const status = await buscarStatusPagamento(consulta.asaas_payment_id)
      const pago = ['CONFIRMED', 'RECEIVED'].includes(status)

      if (pago && consulta.status_pagamento === 'pendente') {
        // Atualiza para pago e dispara entrega
        await supabase
          .from('consultas_avulsas')
          .update({ status_pagamento: 'pago' })
          .eq('id', id)

        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/consulta/entregar/${id}`, {
          method: 'POST',
          headers: { 'x-internal-secret': process.env.CRON_SECRET ?? '' },
        }).catch(() => {})
      }

      return NextResponse.json({ pago })
    } catch {
      return NextResponse.json({ pago: false })
    }
  }

  return NextResponse.json({ pago: false })
}
