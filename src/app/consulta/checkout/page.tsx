'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, Copy, Check, AlertCircle, CreditCard, Loader } from 'lucide-react'
import { PRECOS_AVULSO } from '@/lib/pagamento/asaas'

function formatarCartao(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)
}
function formatarValidade(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').slice(0, 5)
}
function formatarCPF(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4').slice(0, 14)
}
function formatarCEP(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{5})(\d{0,3})/, '$1-$2').slice(0, 9)
}

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()

  const tipo = (params.get('tipo') ?? 'consulta') as 'consulta' | 'relatorio'
  const nome = params.get('nome') ?? ''
  const telefone = params.get('telefone') ?? ''
  const email = params.get('email') ?? ''
  const car = params.get('car') ?? ''
  const lat = params.get('lat') ?? ''
  const lon = params.get('lon') ?? ''

  const valor = PRECOS_AVULSO[tipo]
  const [aba, setAba] = useState<'pix' | 'cartao'>('pix')

  // ── Estado PIX ──────────────────────────────────────────────────────────────
  const [pix, setPix] = useState<{ qr_image: string; qr_text: string; payment_id: string } | null>(null)
  const [pixCopiado, setPixCopiado] = useState(false)
  const [carregandoPix, setCarregandoPix] = useState(false)
  const [aguardandoPix, setAguardandoPix] = useState(false)
  const [consultaId, setConsultaId] = useState<string | null>(null)

  // ── Estado Cartão ────────────────────────────────────────────────────────────
  const [cartao, setCartao] = useState({
    numero: '', validade: '', cvv: '', nome_titular: '',
    cpf: '', cep: '', numero_end: '', telefone_end: '',
  })
  const [carregandoCartao, setCarregandoCartao] = useState(false)

  // ── Erro geral ───────────────────────────────────────────────────────────────
  const [erro, setErro] = useState('')

  // ── Gerar PIX ao abrir a aba ─────────────────────────────────────────────────
  const gerarPix = useCallback(async () => {
    if (pix) return
    setCarregandoPix(true)
    setErro('')
    try {
      const res = await fetch('/api/consulta/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, nome, telefone, email, car: car || undefined, latitude: lat || undefined, longitude: lon || undefined, metodo: 'pix' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erro ao gerar PIX')
      setPix({ qr_image: json.qr_code_image, qr_text: json.qr_code_text, payment_id: json.payment_id })
      setConsultaId(json.consulta_id)
      setAguardandoPix(true)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar PIX')
    } finally {
      setCarregandoPix(false)
    }
  }, [pix, tipo, nome, telefone, email, car, lat, lon])

  useEffect(() => {
    if (aba === 'pix') gerarPix()
  }, [aba, gerarPix])

  // ── Polling pagamento PIX ────────────────────────────────────────────────────
  useEffect(() => {
    if (!aguardandoPix || !consultaId) return
    let tentativas = 0
    const MAX = 75

    const intervalo = setInterval(async () => {
      tentativas++
      if (tentativas > MAX) {
        clearInterval(intervalo)
        setAguardandoPix(false)
        setErro('Tempo de pagamento expirado. Gere um novo PIX.')
        setPix(null)
        return
      }
      try {
        const res = await fetch(`/api/consulta/verificar/${consultaId}`)
        const json = await res.json()
        if (json.pago) {
          clearInterval(intervalo)
          router.push(`/relatorio/${consultaId}`)
        }
      } catch { /* ignora erros de rede no polling */ }
    }, 4000)

    return () => clearInterval(intervalo)
  }, [aguardandoPix, consultaId, router])

  // ── Pagar com cartão ─────────────────────────────────────────────────────────
  async function handleCartao(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregandoCartao(true)
    try {
      const [mes, ano] = cartao.validade.split('/')
      const res = await fetch('/api/consulta/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo, nome, telefone, email,
          car: car || undefined, latitude: lat || undefined, longitude: lon || undefined,
          metodo: 'cartao',
          cartao: {
            holderName: cartao.nome_titular,
            number: cartao.numero.replace(/\s/g, ''),
            expiryMonth: mes,
            expiryYear: ano,
            ccv: cartao.cvv,
            holderInfo: {
              name: cartao.nome_titular,
              email: email || undefined,
              cpfCnpj: cartao.cpf.replace(/\D/g, ''),
              postalCode: cartao.cep.replace(/\D/g, ''),
              addressNumber: cartao.numero_end,
              phone: cartao.telefone_end.replace(/\D/g, ''),
            },
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erro no pagamento')
      router.push(`/relatorio/${json.consulta_id}`)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro no pagamento. Verifique os dados do cartão.')
    } finally {
      setCarregandoCartao(false)
    }
  }

  function setC(campo: string, valor: string) {
    setCartao(c => ({ ...c, [campo]: valor }))
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

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Resumo */}
        <div style={{ backgroundColor: '#1e4d2b', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#a8d5b5', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              {tipo === 'relatorio' ? 'Relatório Completo' : 'Consulta'} — {car || `${lat}, ${lon}`}
            </p>
            {nome && <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{nome}</p>}
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
            R$ {valor.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Abas */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #d4ddc8' }}>
            {[{ id: 'pix', label: 'PIX' }, { id: 'cartao', label: 'Cartão de Crédito' }].map(tab => (
              <button key={tab.id} onClick={() => setAba(tab.id as 'pix' | 'cartao')} type="button"
                style={{ flex: 1, padding: '0.875rem', fontWeight: 600, fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer', borderBottom: aba === tab.id ? '2px solid #2d6a4f' : '2px solid transparent', color: aba === tab.id ? '#2d6a4f' : '#4a5568', marginBottom: -1 }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.75rem' }}>
            {erro && (
              <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={15} color="#c0392b" />
                <span style={{ fontSize: '0.85rem', color: '#c0392b' }}>{erro}</span>
              </div>
            )}

            {/* ─── ABA PIX ─── */}
            {aba === 'pix' && (
              <div style={{ textAlign: 'center' }}>
                {carregandoPix && (
                  <div style={{ padding: '2rem' }}>
                    <Loader size={32} color="#2d6a4f" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>Gerando QR Code...</p>
                  </div>
                )}

                {pix && !carregandoPix && (
                  <>
                    {aguardandoPix && (
                      <div style={{ backgroundColor: '#fef9ec', border: '1px solid #f0c040', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#b7882c', fontWeight: 600 }}>
                        Aguardando confirmação do pagamento...
                      </div>
                    )}
                    <img src={`data:image/png;base64,${pix.qr_image}`} alt="QR Code PIX"
                      style={{ width: 200, height: 200, margin: '0 auto 1.25rem', display: 'block', border: '4px solid #f0f4ec', borderRadius: 8 }} />
                    <p style={{ fontSize: '0.82rem', color: '#4a5568', marginBottom: '0.875rem' }}>
                      Escaneie o QR Code ou copie o código abaixo
                    </p>
                    <div style={{ backgroundColor: '#f8faf6', border: '1px solid #d4ddc8', borderRadius: 6, padding: '0.75rem', fontSize: '0.72rem', color: '#4a5568', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '0.875rem', textAlign: 'left' }}>
                      {pix.qr_text.slice(0, 80)}...
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(pix.qr_text); setPixCopiado(true); setTimeout(() => setPixCopiado(false), 3000) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto', padding: '0.65rem 1.5rem', backgroundColor: pixCopiado ? '#f0f9f4' : '#2d6a4f', color: pixCopiado ? '#2d6a4f' : 'white', border: pixCopiado ? '1px solid #b8dfc8' : 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                      {pixCopiado ? <Check size={16} /> : <Copy size={16} />}
                      {pixCopiado ? 'Copiado!' : 'Copiar código PIX'}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: '#6a7a6a', marginTop: '1.25rem' }}>
                      Após o pagamento você será redirecionado automaticamente
                    </p>
                  </>
                )}
              </div>
            )}

            {/* ─── ABA CARTÃO ─── */}
            {aba === 'cartao' && (
              <form onSubmit={handleCartao} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                    Número do cartão <span style={{ color: '#c0392b' }}>*</span>
                  </label>
                  <input type="text" required inputMode="numeric" value={cartao.numero}
                    onChange={e => setC('numero', formatarCartao(e.target.value))}
                    placeholder="0000 0000 0000 0000" maxLength={19}
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', letterSpacing: '0.1em', backgroundColor: '#fafcfa' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                      Validade <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input type="text" required value={cartao.validade}
                      onChange={e => setC('validade', formatarValidade(e.target.value))}
                      placeholder="MM/AA" maxLength={5}
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                      CVV <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input type="text" required value={cartao.cvv}
                      onChange={e => setC('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123" maxLength={4} inputMode="numeric"
                      style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                    Nome no cartão <span style={{ color: '#c0392b' }}>*</span>
                  </label>
                  <input type="text" required value={cartao.nome_titular}
                    onChange={e => setC('nome_titular', e.target.value.toUpperCase())}
                    placeholder="JOÃO DA SILVA"
                    style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.9rem', backgroundColor: '#fafcfa', textTransform: 'uppercase' }} />
                </div>

                <div style={{ borderTop: '1px solid #f0f4ec', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4a5568', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Dados do titular
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                          CPF <span style={{ color: '#c0392b' }}>*</span>
                        </label>
                        <input type="text" required value={cartao.cpf}
                          onChange={e => setC('cpf', formatarCPF(e.target.value))}
                          placeholder="000.000.000-00" maxLength={14} inputMode="numeric"
                          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                          CEP <span style={{ color: '#c0392b' }}>*</span>
                        </label>
                        <input type="text" required value={cartao.cep}
                          onChange={e => setC('cep', formatarCEP(e.target.value))}
                          placeholder="00000-000" maxLength={9} inputMode="numeric"
                          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                          Número <span style={{ color: '#c0392b' }}>*</span>
                        </label>
                        <input type="text" required value={cartao.numero_end}
                          onChange={e => setC('numero_end', e.target.value)}
                          placeholder="123"
                          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.35rem' }}>
                          Telefone <span style={{ color: '#c0392b' }}>*</span>
                        </label>
                        <input type="tel" required value={cartao.telefone_end}
                          onChange={e => setC('telefone_end', e.target.value)}
                          placeholder="(62) 99999-9999"
                          style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={carregandoCartao}
                  style={{ width: '100%', padding: '0.875rem', backgroundColor: carregandoCartao ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: carregandoCartao ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {carregandoCartao
                    ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processando...</>
                    : <><CreditCard size={16} /> Pagar R$ {valor.toFixed(2).replace('.', ',')}</>}
                </button>
              </form>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#6a7a6a' }}>
          Pagamento processado com segurança pela Asaas
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
