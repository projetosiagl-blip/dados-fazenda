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

      {/* BANNER DE BOAS-VINDAS */}
      <div style={{
        background: 'linear-gradient(135deg, #1D3325 0%, #2E4536 60%, #B07D4F 100%)',
        borderRadius: 10,
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.6rem', fontWeight: 700, color: '#F4ECE1', marginBottom: '0.3rem', letterSpacing: '0.01em' }}>
            {saudacao}, {nome}
          </h1>
          <p style={{ color: '#A4C0B0', fontSize: '0.875rem' }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* SILHUETA FAZENDEIRO — SVG LINE ART */}
        <svg width="160" height="120" viewBox="0 0 160 120" fill="none"
          style={{ opacity: 0.12, position: 'absolute', right: '2rem', bottom: 0, color: '#F4ECE1' }}>
          {/* Chapéu */}
          <ellipse cx="80" cy="34" rx="32" ry="6" stroke="#F4ECE1" strokeWidth="2" fill="none"/>
          <path d="M55 34 Q58 20 80 18 Q102 20 105 34" stroke="#F4ECE1" strokeWidth="2" fill="none"/>
          <line x1="48" y1="34" x2="112" y2="34" stroke="#F4ECE1" strokeWidth="2"/>
          {/* Cabeça */}
          <ellipse cx="80" cy="46" rx="10" ry="11" stroke="#F4ECE1" strokeWidth="2" fill="none"/>
          {/* Corpo / camisa */}
          <path d="M62 57 Q70 55 80 56 Q90 55 98 57 L102 90 L58 90 Z" stroke="#F4ECE1" strokeWidth="2" fill="none"/>
          {/* Braço esquerdo apoiado */}
          <path d="M62 62 Q48 70 44 85" stroke="#F4ECE1" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Braço direito levantado olhando o horizonte */}
          <path d="M98 62 Q108 55 116 50" stroke="#F4ECE1" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Mão viseira */}
          <path d="M112 48 Q118 46 122 49" stroke="#F4ECE1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Pernas */}
          <path d="M68 90 L64 118" stroke="#F4ECE1" strokeWidth="2" strokeLinecap="round"/>
          <path d="M92 90 L96 118" stroke="#F4ECE1" strokeWidth="2" strokeLinecap="round"/>
          {/* Bota esquerda */}
          <path d="M60 118 L68 118 L68 114" stroke="#F4ECE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Bota direita */}
          <path d="M92 114 L92 118 L100 118" stroke="#F4ECE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Horizonte */}
          <line x1="20" y1="112" x2="140" y2="112" stroke="#F4ECE1" strokeWidth="1" strokeDasharray="4 3"/>
          {/* Sol no horizonte */}
          <path d="M120 112 Q124 105 130 112" stroke="#F4ECE1" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* ALERTA ATIVO */}
      {alertas && alertas.length > 0 && (
        <div style={{ backgroundColor: '#fef9ec', border: '1px solid #E5DDD0', borderLeft: '3px solid #B07D4F', borderRadius: 8, padding: '0.875rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <AlertTriangle size={16} color="#B07D4F" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>{alertas[0].descricao}</span>
            <span style={{ color: '#6D7A66', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              · {(alertas[0].propriedades as { nome: string } | null)?.nome}
            </span>
          </div>
          <Link href="/dashboard/alertas" style={{ fontSize: '0.78rem', color: '#B07D4F', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
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
          <Link key={label} href={link} style={{
            backgroundColor: 'white',
            border: '1px solid #E5DDD0',
            borderRadius: 8,
            padding: '1.25rem 1.5rem',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 4px 20px -2px rgba(45, 76, 56, 0.03)',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#6D7A66', fontWeight: 500, lineHeight: 1.4 }}>{label}</p>
              <div style={{ width: 32, height: 32, backgroundColor: '#F5EFE6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color="#B07D4F" />
              </div>
            </div>
            <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1 }}>{valor}</p>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>

        {/* CONSULTAS RECENTES */}
        <div style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 8, boxShadow: '0 4px 20px -2px rgba(45, 76, 56, 0.03)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5DDD0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1rem', color: '#1D3325' }}>Consultas recentes</h2>
            <Link href="/dashboard/historico" style={{ fontSize: '0.78rem', color: '#B07D4F', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
          {!consultas?.length ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, backgroundColor: '#F5EFE6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Search size={20} color="#B07D4F" />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6D7A66', fontWeight: 500, marginBottom: '0.35rem' }}>Nenhuma consulta ainda</p>
              <p style={{ fontSize: '0.8rem', color: '#A4C0B0' }}>Envie uma localização pelo WhatsApp para começar</p>
            </div>
          ) : consultas.map((c, i) => {
            const resultado = c.resultado as Record<string, unknown> | null
            const car = resultado?.car as Record<string, unknown> | null
            const embargos = resultado?.embargos as unknown[] | null
            const temAlerta = (embargos?.length ?? 0) > 0
            return (
              <div key={c.id} style={{ padding: '1rem 1.5rem', borderBottom: i < consultas.length - 1 ? '1px solid #F5EFE6' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: temAlerta ? '#B07D4F' : '#3B6B4C', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.car_codigo ?? (car?.codigo as string) ?? `${c.latitude?.toFixed(4)}, ${c.longitude?.toFixed(4)}`}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6D7A66' }}>
                    {car?.municipio as string ?? 'Consulta realizada'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#A4C0B0', fontSize: '0.75rem', flexShrink: 0 }}>
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
          <div style={{ backgroundColor: '#1D3325', borderRadius: 8, padding: '1.5rem' }}>
            <p style={{ color: '#A4C0B0', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.5rem' }}>Nova consulta</p>
            <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#F4ECE1', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.625rem', lineHeight: 1.4 }}>Consulte pelo WhatsApp</h3>
            <p style={{ color: '#8EAB9A', fontSize: '0.78rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Envie sua localização ou código CAR e receba os dados em segundos.
            </p>
            <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#B07D4F', color: 'white', padding: '0.65rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
              Abrir WhatsApp
            </a>
          </div>

          {/* PLANO ATUAL */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 8, padding: '1.25rem', boxShadow: '0 4px 20px -2px rgba(45, 76, 56, 0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#6D7A66', fontWeight: 500 }}>Plano ativo</p>
              <span style={{ backgroundColor: '#F5EFE6', color: '#B07D4F', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {PLANO_LABELS[plano] ?? 'Básico'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {['Consultas ilimitadas', 'CAR + INCRA + SIGEF', 'Embargos IBAMA'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle size={13} color="#3B6B4C" />
                  <span style={{ fontSize: '0.78rem', color: '#6D7A66' }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/plano" style={{ display: 'block', textAlign: 'center', fontSize: '0.78rem', color: '#1D3325', fontWeight: 600, textDecoration: 'none', padding: '0.5rem', border: '1px solid #E5DDD0', borderRadius: 5, backgroundColor: '#FBF9F5' }}>
              Gerenciar plano
            </Link>
          </div>

          {/* ADICIONAR PROPRIEDADE */}
          <Link href="/dashboard/propriedades/nova"
            style={{ backgroundColor: 'white', border: '1px dashed #E5DDD0', borderRadius: 8, padding: '1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', boxShadow: '0 4px 20px -2px rgba(45, 76, 56, 0.03)' }}>
            <div style={{ width: 36, height: 36, backgroundColor: '#F5EFE6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={17} color="#B07D4F" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1A1A1A', marginBottom: '0.15rem' }}>Adicionar propriedade</p>
              <p style={{ fontSize: '0.75rem', color: '#6D7A66' }}>Cadastrar para monitoramento</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
