'use client'
import { useState } from 'react'
import { Zap, ExternalLink, Loader } from 'lucide-react'

interface Props {
  planoId: string
  nome: string
  telefone: string
  email?: string
  isUpgrade: boolean
}

export default function BotaoUpgrade({ planoId, nome, telefone, email, isUpgrade }: Props) {
  const [carregando, setCarregando] = useState(false)
  const [linkPagamento, setLinkPagamento] = useState<string | null>(null)
  const [erro, setErro] = useState('')

  async function handleUpgrade() {
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch('/api/planos/assinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: planoId, nome, telefone, email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erro ao processar')
      if (json.link_pagamento) {
        setLinkPagamento(json.link_pagamento)
      } else {
        window.location.reload()
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao criar assinatura')
    } finally {
      setCarregando(false)
    }
  }

  if (linkPagamento) {
    return (
      <a href={linkPagamento} target="_blank" rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
        <ExternalLink size={14} />
        Pagar agora
      </a>
    )
  }

  return (
    <div>
      {erro && <p style={{ fontSize: '0.75rem', color: '#c0392b', marginBottom: '0.5rem' }}>{erro}</p>}
      <button onClick={handleUpgrade} disabled={carregando}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', backgroundColor: isUpgrade ? '#2d6a4f' : '#f5f7f2', color: isUpgrade ? 'white' : '#4a5568', padding: '0.65rem', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', border: isUpgrade ? 'none' : '1px solid #d4ddc8', cursor: carregando ? 'not-allowed' : 'pointer', opacity: carregando ? 0.7 : 1 }}>
        {carregando ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : isUpgrade ? <Zap size={14} /> : null}
        {carregando ? 'Processando...' : isUpgrade ? 'Fazer upgrade' : 'Mudar para este plano'}
      </button>
    </div>
  )
}
