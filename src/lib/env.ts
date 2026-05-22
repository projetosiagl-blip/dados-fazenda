const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

const OPTIONAL_ENV = [
  'EVOLUTION_API_URL',
  'EVOLUTION_API_KEY',
  'EVOLUTION_INSTANCE',
  'INFOSIMPLES_TOKEN',
  'NETRIN_API_KEY',
  'ASAAS_API_KEY',
  'ASAAS_WEBHOOK_TOKEN',
  'CRON_SECRET',
] as const

export function validarEnv() {
  const faltando = REQUIRED_ENV.filter(key => !process.env[key])

  if (faltando.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias não configuradas:\n${faltando.map(k => `  - ${k}`).join('\n')}\n\nCopie .env.example para .env.local e preencha os valores.`
    )
  }

  const opcionaisFaltando = OPTIONAL_ENV.filter(key => !process.env[key])
  if (opcionaisFaltando.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`[Dados Fazenda] Variáveis opcionais não configuradas: ${opcionaisFaltando.join(', ')}`)
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  evolutionUrl: process.env.EVOLUTION_API_URL ?? '',
  evolutionKey: process.env.EVOLUTION_API_KEY ?? '',
  evolutionInstance: process.env.EVOLUTION_INSTANCE ?? 'dados-fazenda',
  infosimplesToken: process.env.INFOSIMPLES_TOKEN ?? '',
  netrinKey: process.env.NETRIN_API_KEY ?? '',
  asaasKey: process.env.ASAAS_API_KEY ?? '',
  asaasEnv: process.env.ASAAS_ENV ?? 'sandbox',
  asaasWebhookToken: process.env.ASAAS_WEBHOOK_TOKEN ?? '',
  cronSecret: process.env.CRON_SECRET ?? '',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
}
