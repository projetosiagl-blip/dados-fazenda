import axios from 'axios'
import { Plano } from '@/types'

const PRECOS: Record<Plano, number> = {
  basico: 59.90,
  full: 99.90,
  empresarial: 397.00,
}

export const PRECOS_AVULSO = {
  consulta: 19.90,
  relatorio: 49.90,
}

const asaas = axios.create({
  baseURL: process.env.ASAAS_ENV === 'production'
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3',
  headers: {
    access_token: process.env.ASAAS_API_KEY,
    'Content-Type': 'application/json',
  },
})

export async function criarOuBuscarCliente(nome: string, telefone: string, email?: string) {
  const fone = telefone.replace(/\D/g, '')

  const { data: lista } = await asaas.get('/customers', {
    params: { mobilePhone: fone },
  })

  if (lista.data?.length > 0) return lista.data[0]

  const { data } = await asaas.post('/customers', {
    name: nome || `Usuário ${telefone}`,
    mobilePhone: fone,
    email: email ?? undefined,
    notificationDisabled: false,
  })

  return data
}

// ── Assinatura mensal (cartão) ───────────────────────────────────────────────

export async function criarAssinatura(clienteId: string, plano: Plano) {
  const { data } = await asaas.post('/subscriptions', {
    customer: clienteId,
    billingType: 'CREDIT_CARD',
    value: PRECOS[plano],
    cycle: 'MONTHLY',
    description: `Plano ${plano.charAt(0).toUpperCase() + plano.slice(1)} — Check Fazenda`,
    nextDueDate: new Date().toISOString().split('T')[0],
  })
  return data
}

export async function cancelarAssinatura(assinaturaId: string) {
  await asaas.delete(`/subscriptions/${assinaturaId}`)
}

export async function buscarAssinatura(assinaturaId: string) {
  const { data } = await asaas.get(`/subscriptions/${assinaturaId}`)
  return data
}

// ── Cobrança única (PIX ou cartão) ──────────────────────────────────────────

export interface DadosCartao {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
  holderInfo: {
    name: string
    email?: string
    cpfCnpj: string
    postalCode: string
    addressNumber: string
    phone: string
  }
}

export async function criarCobrancaPix(
  clienteId: string,
  valor: number,
  descricao: string,
  externalReference: string,
) {
  const vencimento = new Date()
  vencimento.setDate(vencimento.getDate() + 1)

  const { data: pagamento } = await asaas.post('/payments', {
    customer: clienteId,
    billingType: 'PIX',
    value: valor,
    dueDate: vencimento.toISOString().split('T')[0],
    description: descricao,
    externalReference,
  })

  const { data: pix } = await asaas.get(`/payments/${pagamento.id}/pixQrCode`)

  return {
    payment_id: pagamento.id,
    qr_code_image: pix.encodedImage,
    qr_code_text: pix.payload,
    expiracao: pix.expirationDate,
  }
}

export async function criarCobrancaCartao(
  clienteId: string,
  valor: number,
  descricao: string,
  externalReference: string,
  cartao: DadosCartao,
) {
  const vencimento = new Date().toISOString().split('T')[0]

  const { data } = await asaas.post('/payments', {
    customer: clienteId,
    billingType: 'CREDIT_CARD',
    value: valor,
    dueDate: vencimento,
    description: descricao,
    externalReference,
    creditCard: {
      holderName: cartao.holderName,
      number: cartao.number.replace(/\s/g, ''),
      expiryMonth: cartao.expiryMonth,
      expiryYear: cartao.expiryYear,
      ccv: cartao.ccv,
    },
    creditCardHolderInfo: cartao.holderInfo,
  })

  return {
    payment_id: data.id,
    status: data.status,
  }
}

export async function buscarStatusPagamento(paymentId: string) {
  const { data } = await asaas.get(`/payments/${paymentId}`)
  return data.status as string
}
