import axios from 'axios'
import { Plano } from '@/types'

const PRECOS: Record<Plano, number> = {
  basico: 59.90,
  full: 99.90,
  empresarial: 397.00,
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
  const cpfCnpj = telefone.replace(/\D/g, '')

  const { data: lista } = await asaas.get('/customers', {
    params: { mobilePhone: cpfCnpj },
  })

  if (lista.data?.length > 0) return lista.data[0]

  const { data } = await asaas.post('/customers', {
    name: nome || `Usuário ${telefone}`,
    mobilePhone: cpfCnpj,
    email: email ?? undefined,
    notificationDisabled: false,
  })

  return data
}

export async function criarAssinatura(clienteId: string, plano: Plano) {
  const { data } = await asaas.post('/subscriptions', {
    customer: clienteId,
    billingType: 'UNDEFINED',
    value: PRECOS[plano],
    cycle: 'MONTHLY',
    description: `Plano ${plano.charAt(0).toUpperCase() + plano.slice(1)} — Dados Fazenda`,
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
