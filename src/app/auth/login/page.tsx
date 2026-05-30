'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function Login() {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [carregandoGoogle, setCarregandoGoogle] = useState(false)
  const [erro, setErro] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })

    if (error) {
      setErro('E-mail ou senha incorretos. Verifique seus dados.')
      setCarregando(false)
      return
    }

    window.location.href = '/dashboard'
  }

  async function handleGoogle() {
    setCarregandoGoogle(true)
    setErro('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setErro('Erro ao entrar com Google. Tente novamente.')
      setCarregandoGoogle(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>Check Fazenda</span>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Entrar na plataforma</h1>
            <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Acesse seus dados e propriedades</p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
            {erro && (
              <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={15} color="#c0392b" />
                <span style={{ fontSize: '0.85rem', color: '#c0392b' }}>{erro}</span>
              </div>
            )}

            {/* Botão Google */}
            <button onClick={handleGoogle} disabled={carregandoGoogle}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', color: '#1a1a1a', border: '1px solid #d4ddc8', borderRadius: 6, fontWeight: 600, fontSize: '0.9rem', cursor: carregandoGoogle ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: '1.25rem', opacity: carregandoGoogle ? 0.7 : 1 }}>
              <IconGoogle />
              {carregandoGoogle ? 'Redirecionando...' : 'Entrar com Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#d4ddc8' }} />
              <span style={{ fontSize: '0.78rem', color: '#6a7a6a' }}>ou</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#d4ddc8' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>E-mail</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={{ width: '100%', padding: '0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', color: '#1a1a1a', backgroundColor: '#fafcfa' }} />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>Senha</label>
                  <Link href="/auth/recuperar-senha" style={{ fontSize: '0.8rem', color: '#2d6a4f', textDecoration: 'none' }}>Esqueceu?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={mostrarSenha ? 'text' : 'password'} required value={senha} onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', color: '#1a1a1a', backgroundColor: '#fafcfa' }} />
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
                <Link href="/auth/cadastro" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>Criar conta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
