import Link from 'next/link'
import { MapPin, LayoutDashboard, Map, History, Bell, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import SidebarMobile from '@/components/ui/SidebarMobile'
import { ToastProvider } from '@/components/ui/Toast'

const NAV = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/dashboard/propriedades', label: 'Propriedades', icon: Map },
  { href: '/dashboard/historico', label: 'Histórico', icon: History },
  { href: '/dashboard/alertas', label: 'Alertas', icon: Bell },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

const PLANO_LABELS: Record<string, string> = {
  basico: 'Plano Básico',
  full: 'Plano Full',
  empresarial: 'Plano Empresarial',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let plano = 'basico'
  let nomeUsuario = ''

  if (user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('plano, nome')
      .eq('id', user.id)
      .single()
    plano = usuario?.plano ?? 'basico'
    nomeUsuario = usuario?.nome?.split(' ')[0] ?? ''
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FBF9F5' }}>

      {/* SIDEBAR DESKTOP */}
      <aside className="sidebar-desktop" style={{ width: 240, backgroundColor: '#1D3325', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50 }}>

        {/* LOGO */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #284432' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, backgroundColor: '#B07D4F', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={17} color="white" />
            </div>
            <span style={{ color: '#F4ECE1', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.01em' }}>Check Fazenda</span>
          </Link>
        </div>

        {/* USUÁRIO */}
        {nomeUsuario && (
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #284432' }}>
            <p style={{ color: '#8EAB9A', fontSize: '0.7rem', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bem-vindo</p>
            <p style={{ color: '#F4ECE1', fontSize: '0.875rem', fontWeight: 600 }}>{nomeUsuario}</p>
          </div>
        )}

        {/* NAVEGAÇÃO */}
        <nav style={{ flex: 1, padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.625rem 0.875rem', borderRadius: 5, textDecoration: 'none', color: '#A4C0B0', fontSize: '0.875rem', fontWeight: 500 }}
              className="nav-item">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* PLANO + SAIR */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #284432' }}>
          <div style={{ padding: '0.75rem 0.875rem', backgroundColor: '#284432', borderRadius: 5, marginBottom: '0.75rem' }}>
            <p style={{ color: '#8EAB9A', fontSize: '0.67rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Plano ativo</p>
            <p style={{ color: '#F4ECE1', fontWeight: 700, fontSize: '0.85rem' }}>{PLANO_LABELS[plano] ?? 'Plano Básico'}</p>
          </div>
          <form action="/auth/logout" method="post">
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', borderRadius: 5, color: '#8EAB9A', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
              <LogOut size={14} />
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      <SidebarMobile plano={plano} nomeUsuario={nomeUsuario} />

      {/* CONTEÚDO */}
      <main className="dashboard-main" style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </main>

      <style>{`
        .nav-item:hover { background-color: #284432 !important; color: #F4ECE1 !important; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .dashboard-main { margin-left: 0 !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  )
}
