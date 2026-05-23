import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Phone, Mail, CreditCard, Shield, LogOut } from 'lucide-react'

export default async function Configuracoes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single()

  const planoLabels: Record<string, string> = {
    basico: 'Básico — R$ 59,90/mês',
    full: 'Full — R$ 99,90/mês',
    empresarial: 'Empresarial — R$ 397,00/mês',
  }

  const statusLabels: Record<string, { label: string; cor: string; fundo: string }> = {
    ativa: { label: 'Ativa', cor: '#2d6a4f', fundo: '#f0f9f4' },
    trial: { label: 'Trial', cor: '#b7882c', fundo: '#fef9ec' },
    cancelada: { label: 'Cancelada', cor: '#c0392b', fundo: '#fdf2f2' },
    inadimplente: { label: 'Inadimplente', cor: '#c0392b', fundo: '#fdf2f2' },
  }

  const status = statusLabels[usuario?.status_assinatura ?? 'trial'] ?? statusLabels.trial

  return (
    <div style={{ padding: '2rem', maxWidth: 720 }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Configurações</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Gerencie sua conta e assinatura</p>
      </div>

      {/* PERFIL */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, marginBottom: '1.25rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <User size={17} color="#2d6a4f" />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Dados pessoais</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>Nome completo</label>
              <div style={{ padding: '0.65rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', color: '#1a1a1a', backgroundColor: '#f8faf6' }}>
                {usuario?.nome ?? '—'}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>WhatsApp</label>
              <div style={{ padding: '0.65rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', color: '#1a1a1a', backgroundColor: '#f8faf6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={13} color="#2d6a4f" />
                {usuario?.telefone ?? '—'}
              </div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' }}>E-mail</label>
            <div style={{ padding: '0.65rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', color: '#1a1a1a', backgroundColor: '#f8faf6', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={13} color="#2d6a4f" />
              {user.email ?? '—'}
            </div>
          </div>
          <button style={{ alignSelf: 'flex-start', fontSize: '0.82rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: '1px solid #d4ddc8', borderRadius: 5, padding: '0.45rem 1rem', cursor: 'pointer' }}>
            Editar dados
          </button>
        </div>
      </div>

      {/* ASSINATURA */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, marginBottom: '1.25rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CreditCard size={17} color="#2d6a4f" />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Assinatura</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.25rem' }}>Plano atual</p>
              <p style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                {planoLabels[usuario?.plano ?? 'basico'] ?? 'Sem plano'}
              </p>
            </div>
            <span style={{ backgroundColor: status.fundo, color: status.cor, fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 20 }}>
              {status.label}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/dashboard/plano" style={{ fontSize: '0.82rem', color: 'white', fontWeight: 600, backgroundColor: '#2d6a4f', border: 'none', borderRadius: 5, padding: '0.5rem 1.1rem', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
              Gerenciar plano
            </a>
            <button style={{ fontSize: '0.82rem', color: '#4a5568', fontWeight: 500, background: 'none', border: '1px solid #d4ddc8', borderRadius: 5, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>
              Ver histórico de pagamentos
            </button>
          </div>

          {usuario?.status_assinatura === 'ativa' && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f0f4ec' }}>
              <button style={{ fontSize: '0.8rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Cancelar assinatura
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEGURANÇA */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, marginBottom: '1.25rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={17} color="#2d6a4f" />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Segurança</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <button style={{ fontSize: '0.82rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: '1px solid #d4ddc8', borderRadius: 5, padding: '0.5rem 1.1rem', cursor: 'pointer' }}>
            Alterar senha
          </button>
        </div>
      </div>

      {/* SAIR */}
      <form action="/auth/logout" method="post">
        <button type="submit"
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#c0392b', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 0' }}>
          <LogOut size={15} />
          Sair da conta
        </button>
      </form>
    </div>
  )
}
