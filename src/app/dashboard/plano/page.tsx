import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowLeft, CreditCard } from 'lucide-react'
import BotaoUpgrade from '@/components/ui/BotaoUpgrade'

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 59.90,
    recursos: ['10 camadas de dados', 'CAR + INCRA + SIGEF', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'Consulta via WhatsApp'],
  },
  {
    id: 'full',
    nome: 'Full',
    preco: 99.90,
    recursos: ['Tudo do Básico', '+15 camadas extras', 'Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Farm Scan PDF mensal'],
    destaque: true,
  },
  {
    id: 'empresarial',
    nome: 'Empresarial',
    preco: 397.00,
    recursos: ['Tudo do Full', '2 acessos inclusos', 'Gestão de equipe', 'Suporte prioritário'],
  },
]

export default async function Plano() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('plano, status_assinatura, asaas_subscription_id, nome, telefone')
    .eq('id', user.id)
    .single()

  const planoAtual = usuario?.plano ?? 'basico'
  const status = usuario?.status_assinatura ?? 'trial'

  const statusLabel: Record<string, { label: string; cor: string; fundo: string }> = {
    ativa: { label: 'Ativa', cor: '#2d6a4f', fundo: '#f0f9f4' },
    trial: { label: 'Trial', cor: '#b7882c', fundo: '#fef9ec' },
    cancelada: { label: 'Cancelada', cor: '#c0392b', fundo: '#fdf2f2' },
    inadimplente: { label: 'Inadimplente', cor: '#c0392b', fundo: '#fdf2f2' },
  }
  const st = statusLabel[status] ?? statusLabel.trial

  return (
    <div style={{ padding: '2rem', maxWidth: 860 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/configuracoes"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <ArrowLeft size={15} />
          Voltar
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Meu plano</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Gerencie sua assinatura</p>
      </div>

      {/* STATUS ATUAL */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, backgroundColor: '#f0f5f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} color="#2d6a4f" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.2rem' }}>Plano atual</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1a1a1a' }}>
              {PLANOS.find(p => p.id === planoAtual)?.nome ?? 'Básico'} — R$ {PLANOS.find(p => p.id === planoAtual)?.preco.toFixed(2).replace('.', ',')}/mês
            </p>
          </div>
        </div>
        <span style={{ backgroundColor: st.fundo, color: st.cor, fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.875rem', borderRadius: 20 }}>
          {st.label}
        </span>
      </div>

      {/* COMPARAÇÃO DE PLANOS */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1.25rem' }}>Alterar plano</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {PLANOS.map(p => {
          const isAtual = p.id === planoAtual
          const isUpgrade = PLANOS.findIndex(x => x.id === p.id) > PLANOS.findIndex(x => x.id === planoAtual)

          return (
            <div key={p.id} style={{ backgroundColor: 'white', border: `2px solid ${isAtual ? '#2d6a4f' : '#d4ddc8'}`, borderRadius: 8, padding: '1.5rem', position: 'relative' }}>
              {isAtual && (
                <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2d6a4f', color: 'white', padding: '0.15rem 0.875rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>
                  PLANO ATUAL
                </div>
              )}
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>{p.nome}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, margin: '0.75rem 0 1rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e4d2b' }}>R$ {p.preco.toFixed(2).replace('.', ',')}</span>
                <span style={{ color: '#4a5568', fontSize: '0.8rem' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {p.recursos.map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8rem', color: '#4a5568' }}>
                    <Check size={13} color="#2d6a4f" />{r}
                  </li>
                ))}
              </ul>
              {isAtual ? (
                <div style={{ textAlign: 'center', padding: '0.6rem', backgroundColor: '#f0f9f4', borderRadius: 6, fontSize: '0.82rem', color: '#2d6a4f', fontWeight: 600 }}>
                  Plano atual
                </div>
              ) : (
                <BotaoUpgrade
                  planoId={p.id}
                  nome={usuario?.nome ?? ''}
                  telefone={usuario?.telefone ?? ''}
                  email={user.email}
                  isUpgrade={isUpgrade}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* CANCELAR */}
      {status === 'ativa' && (
        <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 8, padding: '1.25rem 1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '0.4rem' }}>Cancelar assinatura</h3>
          <p style={{ fontSize: '0.82rem', color: '#4a5568', marginBottom: '1rem', lineHeight: 1.5 }}>
            Ao cancelar, você continuará tendo acesso até o fim do período pago. Não há reembolso de períodos parciais.
          </p>
          <button style={{ fontSize: '0.82rem', color: '#c0392b', fontWeight: 600, background: 'none', border: '1px solid #f5c6c6', borderRadius: 5, padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Solicitar cancelamento
          </button>
        </div>
      )}
    </div>
  )
}
