import Link from 'next/link'
import { MapPin, LayoutDashboard, Map, History, Bell, Settings, LogOut } from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/dashboard/propriedades', label: 'Propriedades', icon: Map },
  { href: '/dashboard/historico', label: 'Histórico', icon: History },
  { href: '/dashboard/alertas', label: 'Alertas', icon: Bell },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f7f2' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 240, backgroundColor: '#1e4d2b', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh' }}>
        <div style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid #2d6a4f' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={17} color="white" />
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Dados Fazenda</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.75rem', borderRadius: 6, textDecoration: 'none', color: '#a8d5b5', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.15s' }}
              className="nav-item">
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #2d6a4f' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#2d6a4f', borderRadius: 6, marginBottom: '0.75rem' }}>
            <p style={{ color: '#c8e6d4', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Plano ativo</p>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>Plano Full</p>
          </div>
          <Link href="/auth/login"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', borderRadius: 6, textDecoration: 'none', color: '#6b9e7e', fontSize: '0.8rem' }}>
            <LogOut size={15} />
            Sair
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        {children}
      </main>

      <style>{`
        .nav-item:hover { background-color: #2d6a4f !important; color: white !important; }
      `}</style>
    </div>
  )
}
