import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { criarOuBuscarCliente, criarAssinatura } from '@/lib/pagamento/asaas'
import { Plano } from '@/types'
import { z } from 'zod'

const schema = z.object({
  telefone: z.string().min(10),
  nome: z.string().min(2),
  plano: z.enum(['basico', 'full', 'empresarial']),
  email: z.string().email().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { telefone, nome, plano, email } = schema.parse(body)

    const supabase = createServiceClient()

    // Cria cliente no Asaas
    const cliente = await criarOuBuscarCliente(nome, telefone, email)

    // Cria assinatura
    const assinatura = await criarAssinatura(cliente.id, plano as Plano)

    // Salva ou atualiza usuário
    await supabase.from('usuarios').upsert({
      telefone: telefone.replace(/\D/g, ''),
      nome,
      email,
      plano,
      status_assinatura: 'ativa',
      asaas_customer_id: cliente.id,
      asaas_subscription_id: assinatura.id,
    }, { onConflict: 'telefone' })

    return NextResponse.json({
      ok: true,
      link_pagamento: assinatura.invoiceUrl ?? null,
    })
  } catch (err) {
    console.error('[planos/assinar]', err)
    return NextResponse.json({ error: 'Erro ao criar assinatura' }, { status: 500 })
  }
}
