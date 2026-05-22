import { AlertTriangle, Bell, CheckCircle, Flame, ShieldAlert, TreePine } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ICONES: Record<string, React.ElementType> = {
  embargo_ibama: ShieldAlert,
  queimada: Flame,
  desmatamento: TreePine,
  mudanca_car: CheckCircle,
  area_protegida: Bell,
}

const CORES: Record<string, { cor: string; fundo: string; borda: string }> = {
  embargo_ibama: { cor: '#c0392b', fundo: '#fdf2f2', borda: '#f5c6c6' },
  queimada: { cor: '#e67e22', fundo: '#fef5ec', borda: '#f5d5b8' },
  desmatamento: { cor: '#8e44ad', fundo: '#f9f0ff', borda: '#d7b8f5' },
  mudanca_car: { cor: '#2d6a4f', fundo: '#f0f9f4', borda: '#b8dfc8' },
  area_protegida: { cor: '#2980b9', fundo: '#f0f7ff', borda: '#b8d4f0' },
}

export default async function Alertas() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: alertas } = await supabase
    .from('alertas')
    .select('*, propriedades(nome, municipio, estado)')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false })
    .limit(30)

  const lista = alertas ?? []
  const naoLidos = lista.filter(a => !a.enviado).length

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Alertas</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>
            {naoLidos > 0 ? `${naoLidos} alerta(s) não enviado(s)` : 'Todos os alertas processados'}
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Bell size={16} color="#2d6a4f" />
        <p style={{ fontSize: '0.85rem', color: '#2d6a4f' }}>
          Os alertas são enviados automaticamente para seu WhatsApp assim que detectados pelo sistema de monitoramento.
        </p>
      </div>

      {lista.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#f0f9f4', border: '2px solid #b8dfc8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <CheckCircle size={28} color="#2d6a4f" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>Nenhum alerta</h3>
          <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>
            Suas propriedades estão sendo monitoradas e estão sem ocorrências.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {lista.map(alerta => {
            const tipo = alerta.tipo as string
            const estilo = CORES[tipo] ?? CORES.area_protegida
            const Icon = ICONES[tipo] ?? Bell
            const prop = alerta.propriedades as { nome: string; municipio: string; estado: string } | null

            return (
              <div key={alerta.id} style={{ backgroundColor: 'white', border: `1px solid ${estilo.borda}`, borderRadius: 8, padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: 40, height: 40, backgroundColor: estilo.fundo, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={estilo.cor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>{alerta.descricao}</h3>
                      <span style={{ fontSize: '0.72rem', color: '#4a5568', flexShrink: 0, marginLeft: '1rem' }}>
                        {new Date(alerta.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#4a5568', backgroundColor: '#f5f7f2', padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                        {prop?.nome ?? '—'} {prop?.municipio ? `· ${prop.municipio}` : ''} {prop?.estado ? `- ${prop.estado}` : ''}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: alerta.enviado ? '#2d6a4f' : '#b7882c', fontWeight: 600, backgroundColor: alerta.enviado ? '#f0f9f4' : '#fef9ec', padding: '0.15rem 0.6rem', borderRadius: 20 }}>
                        {alerta.enviado ? 'Enviado' : 'Pendente'}
                      </span>
                    </div>
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
