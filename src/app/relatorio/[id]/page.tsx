import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, Download, FileText, CheckCircle, Clock, AlertTriangle, RotateCcw } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function Relatorio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const { data: consulta } = await supabase
    .from('consultas_avulsas')
    .select('*')
    .eq('id', id)
    .single()

  if (!consulta) notFound()

  const resultado = consulta.resultado as Record<string, unknown> | null
  const car = resultado?.car as Record<string, unknown> | null
  const embargos = resultado?.embargos as unknown[] | null
  const expirado = consulta.expira_em ? new Date(consulta.expira_em) < new Date() : false

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

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Status aguardando */}
        {consulta.status_pagamento === 'pendente' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 10 }}>
            <Clock size={40} color="#b7882c" style={{ margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Aguardando pagamento</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Assim que o pagamento for confirmado, seu relatório será gerado e enviado no WhatsApp.
            </p>
            <Link href={`/consulta/checkout?tipo=${consulta.tipo}&telefone=${consulta.telefone}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2d6a4f', fontWeight: 600, textDecoration: 'none', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#f0f9f4' }}>
              <RotateCcw size={14} />
              Voltar ao pagamento
            </Link>
          </div>
        )}

        {/* Processando */}
        {(consulta.status_pagamento === 'pago' || consulta.status_pagamento === 'processando') && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 10 }}>
            <div style={{ width: 56, height: 56, border: '3px solid #2d6a4f', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1.25rem', animation: 'spin 1s linear infinite' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Gerando seu relatório</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>
              Consultando CAR, INCRA, IBAMA e demais bases. Aguarde alguns instantes.
            </p>
          </div>
        )}

        {/* Falhou */}
        {consulta.status_pagamento === 'falhou' && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid #f5c6c6', borderRadius: 10 }}>
            <AlertTriangle size={40} color="#c0392b" style={{ margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Erro ao gerar relatório</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Houve um problema ao processar sua consulta. Entre em contato via WhatsApp.
            </p>
            <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', backgroundColor: '#25D366', color: 'white', padding: '0.65rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Falar no WhatsApp
            </a>
          </div>
        )}

        {/* Entregue — expirado */}
        {consulta.status_pagamento === 'entregue' && expirado && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 10 }}>
            <Clock size={40} color="#b7882c" style={{ margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Link expirado</h1>
            <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              O acesso a este relatório expirou após 7 dias. Realize uma nova consulta.
            </p>
            <Link href="/consulta"
              style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Nova consulta
            </Link>
          </div>
        )}

        {/* Entregue — disponível */}
        {consulta.status_pagamento === 'entregue' && !expirado && resultado && (
          <>
            <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <CheckCircle size={22} color="#2d6a4f" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e4d2b', marginBottom: '0.15rem' }}>Consulta concluída</p>
                <p style={{ fontSize: '0.78rem', color: '#4a5568' }}>
                  Disponível até {new Date(consulta.expira_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {consulta.pdf_url && (
                <a href={consulta.pdf_url} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#2d6a4f', color: 'white', padding: '0.55rem 1.1rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>
                  <Download size={15} />
                  Baixar PDF
                </a>
              )}
            </div>

            {/* CAR */}
            {car && (
              <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, marginBottom: '1rem' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f4ec', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} color="#2d6a4f" />
                  <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>CAR / SICAR</h2>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { label: 'Código', valor: car.codigo as string },
                    { label: 'Status', valor: car.status as string },
                    { label: 'Área', valor: car.area_ha ? `${Number(car.area_ha).toLocaleString('pt-BR')} ha` : '—' },
                    { label: 'Município', valor: `${car.municipio ?? '—'} - ${car.estado ?? ''}` },
                    ...(car.proprietario ? [{ label: 'Proprietário', valor: car.proprietario as string }] : []),
                  ].map(item => (
                    <div key={item.label} style={{ backgroundColor: '#f8faf6', borderRadius: 6, padding: '0.6rem 0.875rem' }}>
                      <p style={{ fontSize: '0.72rem', color: '#4a5568', marginBottom: '0.2rem' }}>{item.label}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a1a' }}>{item.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embargos */}
            <div style={{ backgroundColor: 'white', border: `1px solid ${(embargos?.length ?? 0) > 0 ? '#f5c6c6' : '#d4ddc8'}`, borderRadius: 8, marginBottom: '1rem' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f4ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {(embargos?.length ?? 0) > 0
                    ? <AlertTriangle size={16} color="#c0392b" />
                    : <CheckCircle size={16} color="#2d6a4f" />}
                  <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Embargos IBAMA</h2>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: (embargos?.length ?? 0) > 0 ? '#c0392b' : '#2d6a4f', backgroundColor: (embargos?.length ?? 0) > 0 ? '#fdf2f2' : '#f0f9f4', padding: '0.2rem 0.6rem', borderRadius: 20 }}>
                  {(embargos?.length ?? 0) > 0 ? `${embargos!.length} ativo(s)` : 'Nenhum'}
                </span>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                {(embargos?.length ?? 0) === 0 ? (
                  <p style={{ fontSize: '0.875rem', color: '#2d6a4f' }}>Nenhum embargo encontrado nesta área.</p>
                ) : (embargos as Record<string, unknown>[]).map((e, i) => (
                  <div key={i} style={{ backgroundColor: '#fdf2f2', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: i < embargos!.length - 1 ? '0.5rem' : 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c0392b', marginBottom: '0.2rem' }}>
                      {e.data_embargo as string} — {e.municipio as string ?? 'Local'}
                    </p>
                    {e.nome_embargado ? <p style={{ fontSize: '0.78rem', color: '#4a5568' }}>Embargado: {String(e.nome_embargado)}</p> : null}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/consulta"
                style={{ fontSize: '0.875rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>
                Fazer outra consulta →
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
