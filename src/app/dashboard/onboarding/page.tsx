import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin, MessageCircle, Bell, ChevronRight, Check } from 'lucide-react'

const PASSOS = [
  {
    num: 1,
    icon: MessageCircle,
    titulo: 'Salve o número do bot',
    descricao: 'Salve o número abaixo na sua agenda como "Dados Fazenda" para começar a consultar pelo WhatsApp.',
    acao: 'Salvar contato',
    link: 'https://wa.me/5562942631425',
  },
  {
    num: 2,
    icon: MapPin,
    titulo: 'Faça sua primeira consulta',
    descricao: 'Envie sua localização pelo WhatsApp ou o código CAR da propriedade que deseja consultar.',
    acao: 'Abrir WhatsApp',
    link: 'https://wa.me/5562942631425?text=oi',
  },
  {
    num: 3,
    icon: Bell,
    titulo: 'Cadastre propriedades para monitorar',
    descricao: 'Adicione suas fazendas ao painel para receber alertas automáticos de embargos e queimadas.',
    acao: 'Adicionar propriedade',
    link: '/dashboard/propriedades/nova',
  },
]

export default async function Onboarding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nome, plano')
    .eq('id', user.id)
    .single()

  const nome = usuario?.nome?.split(' ')[0] ?? 'usuário'
  const plano = usuario?.plano ?? 'basico'

  return (
    <div style={{ padding: '2rem', maxWidth: 700 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ width: 64, height: 64, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <Check size={32} color="#2d6a4f" />
        </div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>
          Conta criada, {nome}!
        </h1>
        <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>
          Você está no plano <strong style={{ color: '#2d6a4f', textTransform: 'capitalize' }}>{plano}</strong>. Siga os passos abaixo para começar.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {PASSOS.map(passo => {
          const Icon = passo.icon
          return (
            <div key={passo.num} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, backgroundColor: '#f0f5f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color="#2d6a4f" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.4rem' }}>
                  <span style={{ backgroundColor: '#2d6a4f', color: 'white', fontSize: '0.7rem', fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{passo.num}</span>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>{passo.titulo}</h3>
                </div>
                <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{passo.descricao}</p>
                <a href={passo.link} target={passo.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none', border: '1px solid #b8dfc8', borderRadius: 5, padding: '0.4rem 0.875rem', backgroundColor: '#f0f9f4' }}>
                  {passo.acao}
                  <ChevronRight size={13} />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link href="/dashboard"
          style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Ir para o painel →
        </Link>
      </div>
    </div>
  )
}
