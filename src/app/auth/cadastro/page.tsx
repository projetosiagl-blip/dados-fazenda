'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLANOS = {
  basico: {
    nome: 'Básico',
    preco: 'R$ 59,90/mês',
    valor: 59.90,
    desc: 'Para consultas pontuais de imóveis rurais',
    recursos: ['10 camadas de dados', 'CAR + INCRA + SIGEF + CCIR', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'PRODES e Assentamentos', 'Consultas ilimitadas via WhatsApp', 'Painel web completo'],
  },
  full: {
    nome: 'Full',
    preco: 'R$ 99,90/mês',
    valor: 99.90,
    desc: 'Monitoramento completo com alertas automáticos',
    recursos: ['Tudo do Básico', '+12 camadas exclusivas', 'Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Farm Scan — relatório PDF mensal', 'Queimadas e precipitação', 'Aptidão agrícola e solo', 'Pivôs, outorgas e mineração'],
    destaque: true,
  },
  empresarial: {
    nome: 'Empresarial',
    preco: 'R$ 397,00/mês',
    valor: 397.00,
    desc: 'Para escritórios e times com múltiplas propriedades',
    recursos: ['Tudo do Full', '2 acessos inclusos', 'Gestão de equipe', 'Usuário extra R$ 149/mês', 'Dashboard centralizado', 'Suporte prioritário'],
  },
}

type PlanoKey = keyof typeof PLANOS

function CadastroForm() {
  const params = useSearchParams()
  const planoParam = params.get('plano') as PlanoKey | null
  const planoInicial = planoParam && PLANOS[planoParam] ? planoParam : null

  const [etapa, setEtapa] = useState<'plano' | 'dados' | 'sucesso'>(planoInicial ? 'dados' : 'plano')
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoKey>(planoInicial ?? 'full')
  const [carregando, setCarregando] = useState(false)
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
    setEtapa('sucesso')
    setCarregando(false)
  }

  // ETAPA SUCESSO
  if (etapa === 'sucesso') {
    return (
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <div style={{ width: 56, height: 56, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Check size={28} color="#2d6a4f" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a1a' }}>Conta criada com sucesso!</h2>
        <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Confirme seu e-mail para ativar a conta e acesse o painel.
        </p>
        <Link href="/auth/login" style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
          Ir para o login
        </Link>
      </div>
    )
  }

  // ETAPA SELEÇÃO DE PLANO
  if (etapa === 'plano') {
    return (
      <div>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '1.25rem' }}>Escolha seu plano</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {(Object.keys(PLANOS) as PlanoKey[]).map(key => {
            const p = PLANOS[key]
            const selecionado = planoSelecionado === key
            return (
              <div key={key} onClick={() => setPlanoSelecionado(key)}
                style={{ border: `2px solid ${selecionado ? '#2d6a4f' : '#d4ddc8'}`, borderRadius: 8, padding: '1rem 1.25rem', cursor: 'pointer', backgroundColor: selecionado ? '#f0f9f4' : 'white', transition: 'all 0.15s', position: 'relative' }}>
                {'destaque' in p && p.destaque && (
                  <div style={{ position: 'absolute', top: -10, right: 16, backgroundColor: '#b7882c', color: 'white', padding: '0.1rem 0.75rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700 }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selecionado ? '#2d6a4f' : '#d4ddc8'}`, backgroundColor: selecionado ? '#2d6a4f' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selecionado && <Check size={10} color="white" strokeWidth={3} />}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>{p.nome}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e4d2b' }}>{p.preco}</span>
                </div>
                <p style={{ color: '#4a5568', fontSize: '0.8rem', marginLeft: 28 }}>{p.desc}</p>
                {selecionado && (
                  <ul style={{ listStyle: 'none', padding: '0.75rem 0 0 28px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {p.recursos.slice(0, 5).map(r => (
                      <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#4a5568' }}>
                        <Check size={11} color="#2d6a4f" strokeWidth={3} />{r}
                      </li>
                    ))}
                    {p.recursos.length > 5 && <li style={{ fontSize: '0.78rem', color: '#2d6a4f', marginLeft: 17 }}>+{p.recursos.length - 5} mais</li>}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
        <button onClick={() => setEtapa('dados')}
          style={{ width: '100%', padding: '0.875rem', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
          Continuar com o plano {PLANOS[planoSelecionado].nome}
        </button>
      </div>
    )
  }

  // ETAPA DADOS
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#2d6a4f', fontWeight: 600 }}>Plano: {PLANOS[planoSelecionado].nome}</span>
        <button type="button" onClick={() => setEtapa('plano')} style={{ fontSize: '0.78rem', color: '#2d6a4f', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowLeft size={12} />Alterar
        </button>
      </div>

      {erro && (
        <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.65rem 0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={14} color="#c0392b" />
          <span style={{ fontSize: '0.82rem', color: '#c0392b' }}>{erro}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Nome <span style={{ color: '#c0392b' }}>*</span></label>
          <input type="text" required value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="João"
            style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Sobrenome <span style={{ color: '#c0392b' }}>*</span></label>
          <input type="text" required value={form.sobrenome} onChange={e => set('sobrenome', e.target.value)} placeholder="Silva"
            style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', outline: 'none' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>WhatsApp <span style={{ color: '#c0392b' }}>*</span></label>
        <input type="tel" required value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(62) 99999-9999"
          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', outline: 'none' }} />
        <p style={{ color: '#4a5568', fontSize: '0.72rem', marginTop: '0.25rem' }}>As consultas serão entregues neste número</p>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>E-mail <span style={{ color: '#c0392b' }}>*</span></label>
        <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com"
          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', outline: 'none' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>Senha <span style={{ color: '#c0392b' }}>*</span></label>
        <input type="password" required minLength={6} value={form.senha} onChange={e => set('senha', e.target.value)} placeholder="Mínimo 6 caracteres"
          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', outline: 'none' }} />
      </div>

      <button type="submit" disabled={carregando}
        style={{ width: '100%', padding: '0.875rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregando ? 'not-allowed' : 'pointer', marginTop: '0.25rem' }}>
        {carregando ? 'Criando conta...' : `Criar conta — ${PLANOS[planoSelecionado].preco}`}
      </button>

      <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '0.78rem' }}>
        Ao criar conta você concorda com os <Link href="/termos" style={{ color: '#2d6a4f', textDecoration: 'none' }}>Termos de uso</Link>
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
        <div style={{ width: '100%', maxWidth: 500 }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.4rem' }}>Criar conta</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>Comece a consultar imóveis rurais</p>
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
