'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCarregando(true)
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 1000)
  }

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
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Entrar na plataforma</h1>
            <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Acesse seus dados e propriedades</p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
                  E-mail ou telefone
                </label>
                <input
                  type="text"
                  required
                  placeholder="seu@email.com"
                  style={{ width: '100%', padding: '0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', color: '#1a1a1a', backgroundColor: '#fafcfa' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', color: '#1a1a1a', backgroundColor: '#fafcfa' }}
                  />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}>
                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={carregando}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregando ? 'not-allowed' : 'pointer' }}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #d4ddc8', textAlign: 'center' }}>
              <p style={{ color: '#4a5568', fontSize: '0.85rem' }}>
                Não tem conta?{' '}
                <Link href="/auth/cadastro" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>
                  Criar conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
