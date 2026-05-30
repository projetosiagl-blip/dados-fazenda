'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function NovaSenha() {
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }
    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setCarregando(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: senha })

    if (error) {
      setErro('Erro ao atualizar senha. O link pode ter expirado.')
      setCarregando(false)
      return
    }

    setConcluido(true)
    setCarregando(false)
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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.4rem' }}>Nova senha</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>Digite e confirme sua nova senha</p>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
            {concluido ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle size={26} color="#2d6a4f" />
                </div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a1a' }}>Senha atualizada!</h2>
                <Link href="/auth/login"
                  style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.7rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                  Entrar agora
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {erro && (
                  <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={15} color="#c0392b" />
                    <span style={{ fontSize: '0.85rem', color: '#c0392b' }}>{erro}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
                    Nova senha <span style={{ color: '#c0392b' }}>*</span>
                  </label>
                  <input type="password" required minLength={6} value={senha} onChange={e => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{ width: '100%', padding: '0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafcfa' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
                    Confirmar senha <span style={{ color: '#c0392b' }}>*</span>
                  </label>
                  <input type="password" required value={confirmar} onChange={e => setConfirmar(e.target.value)}
                    placeholder="Repita a senha"
                    style={{ width: '100%', padding: '0.7rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', outline: 'none', backgroundColor: '#fafcfa' }} />
                </div>

                <button type="submit" disabled={carregando}
                  style={{ width: '100%', padding: '0.8rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregando ? 'not-allowed' : 'pointer' }}>
                  {carregando ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
