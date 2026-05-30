'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Check, ArrowLeft, AlertCircle } from 'lucide-react'

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 59.90,
    descricao: 'Para produtores que precisam de consultas pontuais',
    recursos: ['10 camadas de dados', 'CAR + INCRA + SIGEF', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'Consulta via WhatsApp', 'Histórico de consultas'],
    destaque: false,
  },
  {
    id: 'full',
    nome: 'Full',
    preco: 99.90,
    descricao: 'Para quem precisa monitorar propriedades continuamente',
    recursos: ['Tudo do Básico', '+15 camadas extras', 'Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Queimadas e desmatamento', 'Farm Scan PDF mensal', 'Aptidão agrícola e solo', 'Pivôs e outorgas hídricas'],
    destaque: true,
  },
  {
    id: 'empresarial',
    nome: 'Empresarial',
    preco: 397.00,
    descricao: 'Para escritórios e empresas com múltiplas propriedades',
    recursos: ['Tudo do Full', '2 acessos inclusos', 'Gestão de equipe', 'Usuário extra R$ 149/mês', 'Suporte prioritário', 'Relatórios consolidados'],
    destaque: false,
  },
]

export default function Planos() {
  const [planoSelecionado, setPlanoSelecionado] = useState('full')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function assinar() {
    setErro('')
    setCarregando(true)
    window.location.href = `/auth/cadastro?plano=${planoSelecionado}`
  }

  const plano = PLANOS.find(p => p.id === planoSelecionado)!

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="white" />
            </div>
            <span style={{ color: 'white', fontWeight: 700 }}>Check Fazenda</span>
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a8d5b5', textDecoration: 'none', fontSize: '0.875rem' }}>
            <ArrowLeft size={15} />
            Voltar
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>Escolha seu plano</h1>
          <p style={{ color: '#4a5568', fontSize: '1rem' }}>Sem contrato. Cancele quando quiser.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {PLANOS.map(p => (
            <div key={p.id} onClick={() => setPlanoSelecionado(p.id)}
              style={{ backgroundColor: 'white', border: `2px solid ${planoSelecionado === p.id ? '#2d6a4f' : '#d4ddc8'}`, borderRadius: 8, padding: '1.75rem', cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' }}>
              {p.destaque && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2d6a4f', color: 'white', padding: '0.2rem 1rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                  MAIS POPULAR
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a' }}>{p.nome}</h3>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${planoSelecionado === p.id ? '#2d6a4f' : '#d4ddc8'}`, backgroundColor: planoSelecionado === p.id ? '#2d6a4f' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {planoSelecionado === p.id && <Check size={11} color="white" />}
                </div>
              </div>
              <p style={{ color: '#4a5568', fontSize: '0.8rem', marginBottom: '1rem' }}>{p.descricao}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.9rem', fontWeight: 700, color: '#1e4d2b' }}>R$ {p.preco.toFixed(2).replace('.', ',')}</span>
                <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {p.recursos.map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: '#4a5568' }}>
                    <Check size={13} color="#2d6a4f" />{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem', maxWidth: 480, margin: '0 auto' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            Plano selecionado: <span style={{ color: '#2d6a4f' }}>{plano.nome}</span>
          </h3>
          <div style={{ backgroundColor: '#f8faf6', borderRadius: 6, padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4a5568' }}>Plano {plano.nome}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>R$ {plano.preco.toFixed(2).replace('.', ',')}/mês</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #e2e8d5' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a1a1a' }}>Total mensal</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e4d2b' }}>R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {erro && (
            <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} color="#c0392b" />
              <span style={{ fontSize: '0.82rem', color: '#c0392b' }}>{erro}</span>
            </div>
          )}

          <button onClick={assinar} disabled={carregando}
            style={{ width: '100%', padding: '0.875rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregando ? 'not-allowed' : 'pointer', marginBottom: '0.75rem' }}>
            {carregando ? 'Aguarde...' : `Assinar plano ${plano.nome}`}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4a5568' }}>
            Pagamento via PIX ou cartão · Cancele a qualquer momento
          </p>
        </div>
      </div>
    </div>
  )
}
