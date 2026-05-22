'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ nome: '', sobrenome: '', telefone: '', email: '', senha: '' })

  function set(campo: string, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()

    // Cria conta no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: {
          nome: `${form.nome} ${form.sobrenome}`.trim(),
          telefone: form.telefone.replace(/\D/g, ''),
          plano: planoSelecionado,
        }
      }
    })

    if (error) {
      setErro(error.message.includes('already') ? 'Este e-mail já está cadastrado.' : 'Erro ao criar conta. Tente novamente.')
      setCarregando(false)
      return
    }

    // Cria registro na tabela usuarios
    if (data.user) {
      await supabase.from('usuarios').upsert({
        id: data.user.id,
        telefone: form.telefone.replace(/\D/g, ''),
        nome: `${form.nome} ${form.sobrenome}`.trim(),
        email: form.email,
        plano: planoSelecionado,
        status_assinatura: 'trial',
      })
    }

    setEtapa(2)
    setCarregando(false)
  }

  if (etapa === 2) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <div style={{ width: 56, height: 56, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Check size={28} color="#2d6a4f" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a1a' }}>Conta criada!</h2>
        <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Confirme seu e-mail para ativar a conta e depois acesse o painel.
        </p>
        <Link href="/auth/login" style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Ir para o login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', color: '#2d6a4f', fontWeight: 600 }}>Plano: {PLANOS[planoSelecionado].nome}</span>
        <span style={{ fontSize: '0.85rem', color: '#1e4d2b', fontWeight: 700 }}>{PLANOS[planoSelecionado].preco}</span>
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.65rem 0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} color="#c0392b" />
          <span style={{ fontSize: '0.82rem', color: '#c0392b' }}>{erro}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Nome</label>
          <input type="text" required value={form.nome} onChange={e => set('nome', e.target.value)}
            placeholder="João"
            style={{ width: '100%', padding: '0.65rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Sobrenome</label>
          <input type="text" required value={form.sobrenome} onChange={e => set('sobrenome', e.target.value)}
            placeholder="Silva"
            style={{ width: '100%', padding: '0.65rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>WhatsApp</label>
        <input type="tel" required value={form.telefone} onChange={e => set('telefone', e.target.value)}
          placeholder="(62) 99999-9999"
          style={{ width: '100%', padding: '0.65rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
        <p style={{ color: '#4a5568', fontSize: '0.72rem', marginTop: '0.25rem' }}>Você receberá as consultas neste número</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>E-mail</label>
        <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="seu@email.com"
          style={{ width: '100%', padding: '0.65rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Senha</label>
        <input type="password" required minLength={6} value={form.senha} onChange={e => set('senha', e.target.value)}
          placeholder="Mínimo 6 caracteres"
          style={{ width: '100%', padding: '0.65rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
      </div>

      <button type="submit" disabled={carregando}
        style={{ width: '100%', padding: '0.8rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: carregando ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}>
        {carregando ? 'Criando conta...' : `Criar conta — ${PLANOS[planoSelecionado].preco}`}
      </button>

      <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '0.78rem' }}>
        Ao criar conta você concorda com os <a href="#" style={{ color: '#2d6a4f', textDecoration: 'none' }}>Termos de uso</a>
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
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Criar conta</h1>
            <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Comece a consultar imóveis rurais</p>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem', color: '#4a5568' }}>Carregando...</div>}>
              <CadastroForm />
            </Suspense>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#4a5568', fontSize: '0.85rem' }}>
            Já tem conta? <Link href="/auth/login" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
