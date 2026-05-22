import { MapPin, Plus, Bell, CheckCircle, AlertTriangle, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Propriedades() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: propriedades } = await supabase
    .from('propriedades')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('ativa', true)
    .order('criado_em', { ascending: false })

  const lista = propriedades ?? []

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Propriedades</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>{lista.length} imóvel(is) cadastrado(s)</p>
        </div>
        <a href="/dashboard/propriedades/nova"
          style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} />
          Adicionar propriedade
        </a>
      </div>

      {lista.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#f0f5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <MapPin size={26} color="#2d6a4f" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Nenhuma propriedade cadastrada</h3>
          <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Adicione sua primeira fazenda para começar a monitorar
          </p>
          <a href="/dashboard/propriedades/nova"
            style={{ display: 'inline-block', backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
            Adicionar propriedade
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {lista.map((p) => {
            const snapshot = p.ultimo_snapshot as { embargos?: unknown[] } | null
            const embargos = snapshot?.embargos?.length ?? 0

            return (
              <div key={p.id} style={{ backgroundColor: 'white', border: `1px solid ${embargos > 0 ? '#f0c040' : '#d4ddc8'}`, borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, backgroundColor: '#f0f5f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={20} color="#2d6a4f" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>{p.nome}</h3>
                      <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>{p.municipio ?? '—'} {p.estado ? `- ${p.estado}` : ''}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {embargos > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#fef9ec', border: '1px solid #f0c040', borderRadius: 20, padding: '0.2rem 0.75rem' }}>
                        <AlertTriangle size={12} color="#b7882c" />
                        <span style={{ fontSize: '0.75rem', color: '#b7882c', fontWeight: 600 }}>{embargos} embargo</span>
                      </div>
                    )}
                    <div style={{ color: '#4a5568', padding: '0.25rem' }}>
                      <MoreVertical size={18} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                  {[
                    { label: 'Área', valor: p.area_ha ? `${Number(p.area_ha).toLocaleString('pt-BR')} ha` : '—' },
                    { label: 'CAR', valor: p.car_codigo ?? '—' },
                    { label: 'Última consulta', valor: p.criado_em ? new Date(p.criado_em).toLocaleDateString('pt-BR') : '—' },
                    { label: 'Monitoramento', valor: p.monitorada ? 'Ativo' : 'Inativo' },
                  ].map(item => (
                    <div key={item.label} style={{ backgroundColor: '#f8faf6', borderRadius: 6, padding: '0.6rem 0.75rem' }}>
                      <p style={{ fontSize: '0.72rem', color: '#4a5568', marginBottom: '0.2rem' }}>{item.label}</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.valor}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.monitorada
                      ? <><Bell size={14} color="#2d6a4f" /><span style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 500 }}>Monitoramento ativo</span></>
                      : <><Bell size={14} color="#4a5568" /><span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Sem monitoramento</span></>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/dashboard/propriedades/${p.id}`}
                      style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, border: '1px solid #d4ddc8', borderRadius: 5, padding: '0.4rem 0.875rem', textDecoration: 'none', backgroundColor: 'white' }}>
                      Ver detalhes
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
