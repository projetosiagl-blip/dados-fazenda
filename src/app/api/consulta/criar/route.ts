import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  criarOuBuscarCliente,
  criarCobrancaPix,
  criarCobrancaCartao,
  PRECOS_AVULSO,
  DadosCartao,
} from '@/lib/pagamento/asaas'
import { z } from 'zod'

const schema = z.object({
  tipo: z.enum(['consulta', 'relatorio']),
  nome: z.string().optional().default(''),
  telefone: z.string().min(10),
  email: z.string().email().optional(),
  car: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
  metodo: z.enum(['pix', 'cartao']),
  cartao: z.object({
    holderName: z.string(),
    number: z.string(),
    expiryMonth: z.string(),
    expiryYear: z.string(),
    ccv: z.string(),
    holderInfo: z.object({
      name: z.string(),
      email: z.string().optional(),
      cpfCnpj: z.string(),
      postalCode: z.string(),
      addressNumber: z.string(),
      phone: z.string(),
    }),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const dados = schema.parse(body)

    const lat = dados.latitude ? parseFloat(String(dados.latitude)) : null
    const lon = dados.longitude ? parseFloat(String(dados.longitude)) : null

    if (!dados.car && (!lat || !lon)) {
      return NextResponse.json({ error: 'Informe o código CAR ou as coordenadas.' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const valor = PRECOS_AVULSO[dados.tipo]
    const descricao = dados.tipo === 'relatorio'
      ? `Relatório Completo — Check Fazenda — ${dados.car ?? `${lat},${lon}`}`
      : `Consulta Rural — Check Fazenda — ${dados.car ?? `${lat},${lon}`}`

    // Cria registro pendente no banco
    const { data: consulta, error: erroInsert } = await supabase
      .from('consultas_avulsas')
      .insert({
        tipo: dados.tipo,
        nome: dados.nome || null,
        telefone: dados.telefone.replace(/\D/g, ''),
        email: dados.email || null,
        car_codigo: dados.car?.toUpperCase() || null,
        latitude: lat,
        longitude: lon,
        status_pagamento: 'pendente',
      })
      .select('id')
      .single()

    if (erroInsert || !consulta) {
      throw new Error('Erro ao criar consulta no banco')
    }

    // Cria cliente no Asaas
    const cliente = await criarOuBuscarCliente(
      dados.nome || `Usuário ${dados.telefone}`,
      dados.telefone,
      dados.email,
    )

    const externalRef = `consulta:${consulta.id}`

    // PIX
    if (dados.metodo === 'pix') {
      const pix = await criarCobrancaPix(cliente.id, valor, descricao, externalRef)

      await supabase
        .from('consultas_avulsas')
        .update({ asaas_payment_id: pix.payment_id })
        .eq('id', consulta.id)

      return NextResponse.json({
        consulta_id: consulta.id,
        payment_id: pix.payment_id,
        qr_code_image: pix.qr_code_image,
        qr_code_text: pix.qr_code_text,
      })
    }

    // Cartão
    if (dados.metodo === 'cartao' && dados.cartao) {
      const cobranca = await criarCobrancaCartao(
        cliente.id,
        valor,
        descricao,
        externalRef,
        dados.cartao as DadosCartao,
      )

      await supabase
        .from('consultas_avulsas')
        .update({ asaas_payment_id: cobranca.payment_id })
        .eq('id', consulta.id)

      const pago = ['CONFIRMED', 'RECEIVED'].includes(cobranca.status)

      if (pago) {
        // Dispara entrega em background (não aguarda)
        fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/consulta/entregar/${consulta.id}`, {
          method: 'POST',
          headers: { 'x-internal-secret': process.env.CRON_SECRET ?? '' },
        }).catch(() => {})
      }

      return NextResponse.json({
        consulta_id: consulta.id,
        pago,
        status: cobranca.status,
      })
    }

    return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 })

  } catch (err) {
    console.error('[consulta/criar]', err)
    const msg = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
