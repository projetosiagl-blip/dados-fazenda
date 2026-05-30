'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, FileText, Check, AlertCircle, ArrowRight } from 'lucide-react'
import { PRECOS_AVULSO } from '@/lib/pagamento/asaas'

const PLANOS = [
  {
    id: 'consulta',
    nome: 'Consulta',
    preco: PRECOS_AVULSO.consulta,
    descricao: 'Resultado rápido no WhatsApp',
    recursos: [
      'CAR + INCRA + SIGEF',
      'Embargos IBAMA',
      'Terras Indígenas e UCs',
      'Entrega no WhatsApp em segundos',
    ],
  },
  {
    id: 'relatorio',
    nome: 'Relatório Completo',
    preco: PRECOS_AVULSO.relatorio,
    descricao: 'Farm Scan PDF + WhatsApp',
    recursos: [
      'Tudo da Consulta',
      'Farm Scan PDF completo',
      'Queimadas e desmatamento',
      'Disponível para download por 7 dias',
    ],
    destaque: true,
  },
]

export default function Consulta() {
  const router = useRouter()
  const [plano, setPlano] = useState<'consulta' | 'relatorio'>('relatorio')
  const [tipoLocalizacao, setTipoLocalizacao] = useState<'car' | 'coords'>('car')
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', car: '', latitude: '', longitude: '' })
  const [erro, setErro] = useState('')

  function set(campo: string, valor: string) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const temLocalizacao = tipoLocalizacao === 'car'
      ? form.car.trim().length > 5
      : form.latitude.trim() && form.longitude.trim()

    if (!temLocalizacao) {
      setErro(tipoLocalizacao === 'car' ? 'Informe o código CAR.' : 'Informe latitude e longitude.')
      return
    }
    if (!form.telefone.replace(/\D/g, '').match(/^\d{10,11}$/)) {
      setErro('WhatsApp inválido. Informe com DDD (ex: 62 99999-9999).')
      return
    }

    const params = new URLSearchParams({
      tipo: plano,
      nome: form.nome,
      telefone: form.telefone.replace(/\D/g, ''),
      email: form.email,
      ...(tipoLocalizacao === 'car'
        ? { car: form.car.toUpperCase() }
        : { lat: form.latitude, lon: form.longitude }),
    })

    router.push(`/consulta/checkout?${params.toString()}`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>Dados Fazenda</span>
        </Link>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.4rem' }}>
            Consulta de Imóvel Rural
          </h1>
          <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>
            Sem assinatura. Pague uma vez e receba os dados na hora.
          </p>
        </div>

        {/* Seleção de plano */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {PLANOS.map(p => (
            <div key={p.id} onClick={() => setPlano(p.id as 'consulta' | 'relatorio')}
              style={{ backgroundColor: 'white', border: `2px solid ${plano === p.id ? '#2d6a4f' : '#d4ddc8'}`, borderRadius: 10, padding: '1.5rem', cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' }}>
              {p.destaque && (
                <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#b7882c', color: 'white', padding: '0.15rem 0.875rem', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  MAIS COMPLETO
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${plano === p.id ? '#2d6a4f' : '#d4ddc8'}`, backgroundColor: plano === p.id ? '#2d6a4f' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {plano === p.id && <Check size={10} color="white" strokeWidth={3} />}
                </div>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>{p.nome}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e4d2b' }}>
                  R$ {p.preco.toFixed(2).replace('.', ',')}
                </span>
                <span style={{ color: '#4a5568', fontSize: '0.8rem' }}>por consulta</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#6a7a6a', marginBottom: '0.875rem' }}>{p.descricao}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {p.recursos.map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.78rem', color: '#4a5568' }}>
                    <Check size={12} color="#2d6a4f" strokeWidth={3} />{r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Formulário */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 10, padding: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '1.5rem' }}>
            Dados da consulta
          </h2>

          {erro && (
            <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={15} color="#c0392b" />
              <span style={{ fontSize: '0.85rem', color: '#c0392b' }}>{erro}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Localização */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                Como quer identificar a propriedade? <span style={{ color: '#c0392b' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem' }}>
                {[{ id: 'car', label: 'Código CAR' }, { id: 'coords', label: 'Coordenadas' }].map(op => (
                  <button key={op.id} type="button" onClick={() => setTipoLocalizacao(op.id as 'car' | 'coords')}
                    style={{ padding: '0.45rem 1rem', borderRadius: 6, border: `1.5px solid ${tipoLocalizacao === op.id ? '#2d6a4f' : '#d4ddc8'}`, backgroundColor: tipoLocalizacao === op.id ? '#f0f9f4' : 'white', color: tipoLocalizacao === op.id ? '#2d6a4f' : '#4a5568', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
                    {op.label}
                  </button>
                ))}
              </div>

              {tipoLocalizacao === 'car' ? (
                <input type="text" value={form.car} onChange={e => set('car', e.target.value.toUpperCase())}
                  placeholder="GO-5219803-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', fontFamily: 'monospace' }} />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#4a5568', marginBottom: '0.3rem' }}>Latitude</label>
                    <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)}
                      placeholder="-17.8500"
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#4a5568', marginBottom: '0.3rem' }}>Longitude</label>
                    <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)}
                      placeholder="-50.9200"
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Nome</label>
                <input type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                  placeholder="João Silva"
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
                  WhatsApp <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <input type="tel" required value={form.telefone} onChange={e => set('telefone', e.target.value)}
                  placeholder="(62) 99999-9999"
                  style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>E-mail</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="seu@email.com"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
              <p style={{ fontSize: '0.72rem', color: '#6a7a6a', marginTop: '0.25rem' }}>Opcional — para receber link do PDF por e-mail</p>
            </div>

            <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={15} color="#2d6a4f" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.82rem', color: '#2d6a4f' }}>
                Plano selecionado: <strong>{PLANOS.find(p => p.id === plano)?.nome}</strong> — R$ {PRECOS_AVULSO[plano].toFixed(2).replace('.', ',')}
              </p>
            </div>

            <button type="submit"
              style={{ width: '100%', padding: '0.875rem', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Continuar para pagamento
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#6a7a6a' }}>
          Tem assinatura?{' '}
          <Link href="/auth/login" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>
            Entre na sua conta
          </Link>
          {' '}para consultas ilimitadas.
        </p>
      </div>
    </div>
  )
}
