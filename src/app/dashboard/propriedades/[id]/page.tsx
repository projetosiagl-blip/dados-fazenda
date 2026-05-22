import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Bell, BellOff, AlertTriangle, CheckCircle, FileText, Clock } from 'lucide-react'

export default async function DetalhePropriedade({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: prop } = await supabase
    .from('propriedades')
    .select('*')
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (!prop) notFound()

  const { data: consultas } = await supabase
    .from('consultas')
    .select('*')
    .eq('propriedade_id', id)
    .order('criado_em', { ascending: false })
    .limit(10)

  const { data: alertas } = await supabase
    .from('alertas')
    .select('*')
    .eq('propriedade_id', id)
    .order('criado_em', { ascending: false })
    .limit(10)

  const snapshot = prop.ultimo_snapshot as { embargos?: unknown[]; queimadas_24h?: number; atualizado_em?: string } | null
  const embargos = snapshot?.embargos?.length ?? 0
  const queimadas = snapshot?.queimadas_24h ?? 0

  return (
    <div style={{ padding: '2rem', maxWidth: 900 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/propriedades"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <ArrowLeft size={15} />
          Voltar para propriedades
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 44, height: 44, backgroundColor: '#f0f5f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={22} color="#2d6a4f" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.2rem' }}>{prop.nome}</h1>
              <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>{prop.municipio ?? '—'} {prop.estado ? `- ${prop.estado}` : ''}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {prop.monitorada
              ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 20, padding: '0.35rem 0.875rem' }}>
                  <Bell size={13} color="#2d6a4f" />
                  <span style={{ fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600 }}>Monitoramento ativo</span>
                </div>
              : <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#f5f7f2', border: '1px solid #d4ddc8', borderRadius: 20, padding: '0.35rem 0.875rem' }}>
                  <BellOff size={13} color="#4a5568" />
                  <span style={{ fontSize: '0.78rem', color: '#4a5568' }}>Sem monitoramento</span>
                </div>
            }
          </div>
        </div>
      </div>

      {/* INDICADORES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Área total', valor: prop.area_ha ? `${Number(prop.area_ha).toLocaleString('pt-BR')} ha` : '—', cor: '#1e4d2b' },
          { label: 'Embargos IBAMA', valor: String(embargos), cor: embargos > 0 ? '#c0392b' : '#1e4d2b' },
          { label: 'Queimadas (24h)', valor: String(queimadas), cor: queimadas > 0 ? '#e67e22' : '#1e4d2b' },
          { label: 'Consultas', valor: String(consultas?.length ?? 0), cor: '#1e4d2b' },
        ].map(item => (
          <div key={item.label} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#4a5568', marginBottom: '0.5rem' }}>{item.label}</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: item.cor, lineHeight: 1 }}>{item.valor}</p>
          </div>
        ))}
      </div>

      {/* DADOS DO IMÓVEL */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, marginBottom: '1.25rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8' }}>
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Dados do imóvel</h2>
        </div>
        <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Código CAR', valor: prop.car_codigo ?? '—' },
            { label: 'Área cadastrada', valor: prop.area_ha ? `${Number(prop.area_ha).toLocaleString('pt-BR')} ha` : '—' },
            { label: 'Município', valor: prop.municipio ?? '—' },
            { label: 'Estado', valor: prop.estado ?? '—' },
            { label: 'Latitude', valor: prop.latitude ? String(prop.latitude) : '—' },
            { label: 'Longitude', valor: prop.longitude ? String(prop.longitude) : '—' },
            { label: 'Cadastrado em', valor: new Date(prop.criado_em).toLocaleDateString('pt-BR') },
            { label: 'Última atualização', valor: snapshot?.atualizado_em ? new Date(snapshot.atualizado_em).toLocaleDateString('pt-BR') : '—' },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: '#f8faf6', borderRadius: 6, padding: '0.6rem 0.875rem' }}>
              <p style={{ fontSize: '0.72rem', color: '#4a5568', marginBottom: '0.2rem' }}>{item.label}</p>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.valor}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* ALERTAS */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Alertas</h2>
            <span style={{ fontSize: '0.75rem', color: '#4a5568' }}>{alertas?.length ?? 0} registro(s)</span>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {!alertas?.length ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <CheckCircle size={24} color="#2d6a4f" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>Nenhum alerta registrado</p>
              </div>
            ) : alertas.map(a => (
              <div key={a.id} style={{ padding: '0.75rem', borderRadius: 6, marginBottom: '0.25rem', backgroundColor: '#fef9ec', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <AlertTriangle size={14} color="#b7882c" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 500 }}>{a.descricao}</p>
                  <p style={{ fontSize: '0.72rem', color: '#4a5568', marginTop: '0.2rem' }}>{new Date(a.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSULTAS */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Histórico</h2>
            <span style={{ fontSize: '0.75rem', color: '#4a5568' }}>{consultas?.length ?? 0} consulta(s)</span>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {!consultas?.length ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <FileText size={24} color="#d4ddc8" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>Nenhuma consulta ainda</p>
              </div>
            ) : consultas.map(c => (
              <div key={c.id} style={{ padding: '0.75rem', borderRadius: 6, marginBottom: '0.25rem', backgroundColor: '#f8faf6', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={13} color="#4a5568" />
                <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>
                  Consulta em {new Date(c.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
