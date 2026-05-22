import { CheckCircle, AlertTriangle, Clock, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Historico() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: consultas } = await supabase
    .from('consultas')
    .select('*, propriedades(nome, municipio, estado)')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false })
    .limit(50)

  const lista = consultas ?? []

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Histórico de consultas</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>{lista.length} consulta(s) realizadas</p>
      </div>

      {lista.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#f0f5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <Search size={26} color="#2d6a4f" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Nenhuma consulta ainda</h3>
          <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>
            Envie uma localização pelo WhatsApp para realizar sua primeira consulta.
          </p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8faf6', borderBottom: '1px solid #d4ddc8' }}>
                {['Propriedade / Localização', 'CAR', 'Área', 'Embargos', 'Data'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lista.map((c, i) => {
                const resultado = c.resultado as Record<string, unknown> | null
                const car = resultado?.car as Record<string, unknown> | null
                const embargos = resultado?.embargos as unknown[] | null
                const prop = c.propriedades as { nome: string; municipio: string; estado: string } | null
                const temAlerta = (embargos?.length ?? 0) > 0

                return (
                  <tr key={c.id} style={{ borderBottom: i < lista.length - 1 ? '1px solid #f0f4ec' : 'none' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {temAlerta
                          ? <AlertTriangle size={15} color="#b7882c" />
                          : <CheckCircle size={15} color="#2d6a4f" />}
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>
                            {prop?.nome ?? (c.car_codigo ? `CAR: ${c.car_codigo}` : `${c.latitude?.toFixed(4)}, ${c.longitude?.toFixed(4)}`)}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>
                            {prop?.municipio ?? car?.municipio as string ?? '—'} {prop?.estado ? `- ${prop.estado}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#4a5568', fontFamily: 'monospace' }}>
                        {c.car_codigo ?? (car?.codigo as string) ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                        {car?.area_ha ? `${Number(car.area_ha).toLocaleString('pt-BR')} ha` : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {(embargos?.length ?? 0) > 0
                        ? <span style={{ backgroundColor: '#fef9ec', color: '#b7882c', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20 }}>{embargos!.length} ativo(s)</span>
                        : <span style={{ backgroundColor: '#f0f9f4', color: '#2d6a4f', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20 }}>Nenhum</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a5568', fontSize: '0.8rem' }}>
                        <Clock size={12} />
                        {new Date(c.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
