'use client'
import Link from 'next/link'
import { MapPin, RefreshCw } from 'lucide-react'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>Dados Fazenda</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: '5rem', fontWeight: 700, color: '#d4ddc8', lineHeight: 1, marginBottom: '1rem' }}>500</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>Algo deu errado</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando na correção.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={reset}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 6, border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
              <RefreshCw size={16} />
              Tentar novamente
            </button>
            <Link href="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: 'white', color: '#4a5568', padding: '0.75rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', border: '1px solid #d4ddc8' }}>
              Ir para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
