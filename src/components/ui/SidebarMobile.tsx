'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, LayoutDashboard, Map, History, Bell, Settings, LogOut, Menu, X } from 'lucide-react'

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

interface Props {
  plano: string
  nomeUsuario: string
}

export default function SidebarMobile({ plano, nomeUsuario }: Props) {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      {/* HEADER MOBILE */}
      <header style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: 56, backgroundColor: '#1e4d2b', zIndex: 100, alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', borderBottom: '1px solid #2d6a4f' }} className="mobile-header">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={15} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Dados Fazenda</span>
        </Link>
        <button onClick={() => setAberto(!aberto)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
          {aberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* OVERLAY */}
      {aberto && (
        <div onClick={() => setAberto(false)} className="mobile-overlay"
          style={{ display: 'none', position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 101 }} />
      )}

      {/* DRAWER MOBILE */}
      <div className="mobile-drawer"
        style={{ display: 'none', position: 'fixed', top: 56, left: 0, bottom: 0, width: 260, backgroundColor: '#1e4d2b', zIndex: 102, flexDirection: 'column', transform: aberto ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease' }}>

        {nomeUsuario && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #2d6a4f' }}>
            <p style={{ color: '#6b9e7e', fontSize: '0.7rem', marginBottom: '0.15rem' }}>Bem-vindo</p>
            <p style={{ color: '#c8e6d4', fontSize: '0.875rem', fontWeight: 600 }}>{nomeUsuario}</p>
          </div>
        )}

        <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setAberto(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.7rem 0.875rem', borderRadius: 6, textDecoration: 'none', color: '#a8d5b5', fontSize: '0.875rem', fontWeight: 500 }}
              className="nav-item">
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #2d6a4f' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#2d6a4f', borderRadius: 6, marginBottom: '0.75rem' }}>
            <p style={{ color: '#a8d5b5', fontSize: '0.7rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plano ativo</p>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{PLANO_LABELS[plano] ?? 'Plano Básico'}</p>
          </div>
          <form action="/auth/logout" method="post">
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.75rem', borderRadius: 6, color: '#6b9e7e', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}>
              <LogOut size={15} />
              Sair da conta
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .nav-item:hover { background-color: #2d6a4f !important; color: white !important; }
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
          .mobile-overlay { display: block !important; }
          .mobile-drawer { display: flex !important; }
        }
      `}</style>
    </>
  )
}
