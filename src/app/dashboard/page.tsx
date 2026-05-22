import { MapPin, Search, Bell, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: propriedades } = await supabase
    .from('propriedades')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('ativa', true)

  const { data: consultas } = await supabase
    .from('consultas')
    .select('*')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false })
    .limit(5)

  const { data: alertas } = await supabase
    .from('alertas')
    .select('*, propriedades(nome)')
    .eq('usuario_id', user.id)
    .eq('enviado', false)
    .order('criado_em', { ascending: false })
    .limit(3)

  const nome = usuario?.nome?.split(' ')[0] ?? 'usuário'
  const plano = usuario?.plano ?? 'basico'
  const totalProps = propriedades?.length ?? 0
  const totalConsultas = consultas?.length ?? 0
  const totalAlertas = alertas?.length ?? 0

  const STATS = [
    { label: 'Propriedades monitoradas', valor: String(totalProps), icon: MapPin },
    { label: 'Consultas este mês', valor: String(totalConsultas), icon: Search },
    { label: 'Alertas ativos', valor: String(totalAlertas), icon: Bell },
    { label: 'Relatórios gerados', valor: '0', icon: FileText },
  ]

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>
          Olá, {nome}
        </h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Aqui está o resumo das suas propriedades</p>
      </div>

      {totalAlertas > 0 && alertas && alertas[0] && (
        <div style={{ backgroundColor: '#fef9ec', border: '1px solid #f0c040', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="#b7882c" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>{alertas[0].descricao}</p>
            <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>
              {(alertas[0].propriedades as { nome: string } | null)?.nome ?? 'Propriedade'} · {new Date(alertas[0].criado_em).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <Link href="/dashboard/alertas" style={{ fontSize: '0.8rem', color: '#b7882c', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Ver →</Link>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STATS.map(({ label, valor, icon: Icon }) => (
          <div key={label} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>{label}</span>
              <div style={{ width: 32, height: 32, backgroundColor: '#f0f5f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#2d6a4f" />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{valor}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Consultas recentes</h2>
            <Link href="/dashboard/historico" style={{ fontSize: '0.8rem', color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>Ver todas →</Link>
          </div>
          {consultas && consultas.length > 0 ? consultas.map((c, i) => (
            <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < consultas.length - 1 ? '1px solid #f0f4ec' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: '#f0f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={18} color="#2d6a4f" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>
                  {c.car_codigo ?? `${c.latitude?.toFixed(4)}, ${c.longitude?.toFixed(4)}`}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#4a5568' }}>{c.resultado?.car?.municipio ?? 'Consulta realizada'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a5568', fontSize: '0.75rem' }}>
                <Clock size={12} />
                {new Date(c.criado_em).toLocaleDateString('pt-BR')}
              </div>
            </div>
          )) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#4a5568' }}>
              <MapPin size={32} color="#d4ddc8" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.875rem' }}>Nenhuma consulta ainda.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Envie uma localização pelo WhatsApp para começar.</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: '#1e4d2b', borderRadius: 8, padding: '1.5rem' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Nova consulta</h3>
            <p style={{ color: '#a8d5b5', fontSize: '0.8rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Envie sua localização ou código CAR via WhatsApp
            </p>
            <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#25D366', color: 'white', padding: '0.7rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Consultar via WhatsApp
            </a>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Seu plano</h3>
              <span style={{ backgroundColor: '#f0f9f4', color: '#2d6a4f', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20, textTransform: 'uppercase' }}>{plano}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Consultas ilimitadas', 'Dados CAR + INCRA', 'Embargos IBAMA'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={13} color="#2d6a4f" />
                  <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d4ddc8' }}>
              <Link href="/dashboard/configuracoes" style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>
                Gerenciar plano →
              </Link>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <TrendingUp size={16} color="#2d6a4f" />
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Uso este mês</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Consultas</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{totalConsultas}</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#f0f4ec', borderRadius: 3 }}>
              <div style={{ height: 6, backgroundColor: '#2d6a4f', borderRadius: 3, width: `${Math.min(totalConsultas * 5, 100)}%` }} />
            </div>
            <p style={{ fontSize: '0.72rem', color: '#4a5568', marginTop: '0.3rem' }}>Ilimitado no plano {plano}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
