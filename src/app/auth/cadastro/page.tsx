'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Check } from 'lucide-react'
import { Suspense } from 'react'

const PLANOS = {
  basico: { nome: 'Básico', preco: 'R$ 59,90/mês' },
  full: { nome: 'Full', preco: 'R$ 99,90/mês' },
  empresarial: { nome: 'Empresarial', preco: 'R$ 397,00/mês' },
}

function CadastroForm() {
  const params = useSearchParams()
  const planoParam = params.get('plano') as keyof typeof PLANOS | null
  const planoSelecionado = planoParam && PLANOS[planoParam] ? planoParam : 'basico'
  const [carregando, setCarregando] = useState(false)
  const [etapa, setEtapa] = useState(1)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCarregando(true)
    setTimeout(() => {
      setEtapa(2)
      setCarregando(false)
    }, 1000)
  }

  if (etapa === 2) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ width: 56, height: 56, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Check size={28} color="#2d6a4f" />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a1a' }}>Conta criada com sucesso!</h2>
        <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Enviamos um link de acesso para seu WhatsApp. Acesse o painel para começar.
        </p>
        <Link href="/dashboard" style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700 }}>
          Acessar painel
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#2d6a4f', fontWeight: 600 }}>Plano selecionado: {PLANOS[planoSelecionado].nome}</span>
        <span style={{ fontSize: '0.85rem', color: '#1e4d2b', fontWeight: 700 }}>{PLANOS[planoSelecionado].preco}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Nome</label>
          <input type="text" required placeholder="João" style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Sobrenome</label>
          <input type="text" required placeholder="Silva" style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>WhatsApp</label>
        <input type="tel" required placeholder="(62) 99999-9999" style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
        <p style={{ color: '#4a5568', fontSize: '0.75rem', marginTop: '0.3rem' }}>Você receberá as consultas neste número</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>E-mail</label>
        <input type="email" placeholder="seu@email.com (opcional)" style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
      </div>

      <button type="submit" disabled={carregando}
        style={{ width: '100%', padding: '0.875rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregando ? 'not-allowed' : 'pointer' }}>
        {carregando ? 'Criando conta...' : `Criar conta — ${PLANOS[planoSelecionado].preco}`}
      </button>

      <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '0.8rem' }}>
        Ao criar conta você concorda com os{' '}
        <a href="#" style={{ color: '#2d6a4f', textDecoration: 'none' }}>Termos de uso</a>
      </p>
    </form>
  )
}

export default function Cadastro() {
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

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Criar conta</h1>
            <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Comece a consultar seus imóveis rurais</p>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
            <Suspense fallback={<div>Carregando...</div>}>
              <CadastroForm />
            </Suspense>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#4a5568', fontSize: '0.85rem' }}>
            Já tem conta?{' '}
            <Link href="/auth/login" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
