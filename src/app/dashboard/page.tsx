import { MapPin, Search, Bell, FileText, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: usuario } = await supabase.from('usuarios').select('*').eq('id', user.id).single()
  const { data: propriedades } = await supabase.from('propriedades').select('*').eq('usuario_id', user.id).eq('ativa', true)
  const { data: consultas } = await supabase.from('consultas').select('*').eq('usuario_id', user.id).order('criado_em', { ascending: false }).limit(6)
  const { data: alertas } = await supabase.from('alertas').select('*, propriedades(nome)').eq('usuario_id', user.id).eq('enviado', false).order('criado_em', { ascending: false }).limit(5)

  const nome = usuario?.nome?.split(' ')[0] ?? 'usuário'
  const plano = usuario?.plano ?? 'basico'
  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const PLANO_LABELS: Record<string, string> = { basico: 'Básico', full: 'Full', empresarial: 'Empresarial' }

  return (
    <div style={{ padding: '2rem', maxWidth: 1200 }}>

      {/* CABEÇALHO */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e8eee4' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.2rem', letterSpacing: '-0.3px' }}>
          {saudacao}, {nome}
        </h1>
        <p style={{ color: '#6a7a6a', fontSize: '0.85rem' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ALERTA ATIVO */}
      {alertas && alertas.length > 0 && (
        <div style={{ backgroundColor: '#fef9ec', border: '1px solid #e8c84a', borderLeft: '3px solid #b7882c', borderRadius: 6, padding: '0.875rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <AlertTriangle size={16} color="#b7882c" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>{alertas[0].descricao}</span>
            <span style={{ color: '#6a7a6a', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              · {(alertas[0].propriedades as { nome: string } | null)?.nome}
            </span>
          </div>
          <Link href="/dashboard/alertas" style={{ fontSize: '0.78rem', color: '#b7882c', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
            Ver detalhes <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Propriedades monitoradas', valor: String(propriedades?.length ?? 0), icon: MapPin, link: '/dashboard/propriedades' },
          { label: 'Consultas realizadas', valor: String(consultas?.length ?? 0), icon: Search, link: '/dashboard/historico' },
          { label: 'Alertas pendentes', valor: String(alertas?.length ?? 0), icon: Bell, link: '/dashboard/alertas' },
          { label: 'Relatórios PDF', valor: '0', icon: FileText, link: '/dashboard/historico' },
        ].map(({ label, valor, icon: Icon, link }) => (
          <Link key={label} href={link} style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 8, padding: '1.25rem 1.5rem', textDecoration: 'none', display: 'block', transition: 'border-color 0.15s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#6a7a6a', fontWeight: 500, lineHeight: 1.4 }}>{label}</p>
              <div style={{ width: 30, height: 30, backgroundColor: '#f0f5f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color="#2d6a4f" />
              </div>
            </div>
            <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>{valor}</p>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>

        {/* CONSULTAS RECENTES */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 8 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f0f4ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Consultas recentes</h2>
            <Link href="/dashboard/historico" style={{ fontSize: '0.78rem', color: '#2d6a4f', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          {!consultas?.length ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, backgroundColor: '#f0f5f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Search size={20} color="#9aab8e" />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6a7a6a', fontWeight: 500, marginBottom: '0.35rem' }}>Nenhuma consulta ainda</p>
              <p style={{ fontSize: '0.8rem', color: '#9aab8e' }}>Envie uma localização pelo WhatsApp para começar</p>
            </div>
          ) : consultas.map((c, i) => {
            const resultado = c.resultado as Record<string, unknown> | null
            const car = resultado?.car as Record<string, unknown> | null
            const embargos = resultado?.embargos as unknown[] | null
            const temAlerta = (embargos?.length ?? 0) > 0
            return (
              <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < consultas.length - 1 ? '1px solid #f5f7f2' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: temAlerta ? '#b7882c' : '#2d6a4f', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.car_codigo ?? (car?.codigo as string) ?? `${c.latitude?.toFixed(4)}, ${c.longitude?.toFixed(4)}`}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6a7a6a' }}>
                    {car?.municipio as string ?? 'Consulta realizada'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9aab8e', fontSize: '0.75rem', flexShrink: 0 }}>
                  <Clock size={11} />
                  {new Date(c.criado_em).toLocaleDateString('pt-BR')}
                </div>
              </div>
            )
          })}
        </div>

        {/* PAINEL LATERAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* CONSULTAR VIA WHATSAPP */}
          <div style={{ backgroundColor: '#1e4d2b', borderRadius: 8, padding: '1.5rem' }}>
            <p style={{ color: '#a8d5b5', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Nova consulta</p>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>Consulte pelo WhatsApp</h3>
            <p style={{ color: '#6b9e7e', fontSize: '0.78rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Envie sua localização ou código CAR e receba os dados em segundos.
            </p>
            <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#25D366', color: 'white', padding: '0.65rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
              Abrir WhatsApp
            </a>
          </div>

          {/* PLANO ATUAL */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#6a7a6a', fontWeight: 500 }}>Plano ativo</p>
              <span style={{ backgroundColor: '#f0f9f4', color: '#2d6a4f', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {PLANO_LABELS[plano] ?? 'Básico'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {['Consultas ilimitadas', 'CAR + INCRA + SIGEF', 'Embargos IBAMA'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle size={13} color="#2d6a4f" />
                  <span style={{ fontSize: '0.78rem', color: '#6a7a6a' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/plano" style={{ display: 'block', textAlign: 'center', fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none', padding: '0.5rem', border: '1px solid #c8dfc8', borderRadius: 5, backgroundColor: '#f8faf6' }}>
              Gerenciar plano
            </Link>
          </div>

          {/* ADICIONAR PROPRIEDADE */}
          <Link href="/dashboard/propriedades/nova"
            style={{ backgroundColor: 'white', border: '1px dashed #b8dfc8', borderRadius: 8, padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 36, height: 36, backgroundColor: '#f0f9f4', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={17} color="#2d6a4f" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>Adicionar propriedade</p>
              <p style={{ fontSize: '0.75rem', color: '#6a7a6a' }}>Cadastrar para monitoramento</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
