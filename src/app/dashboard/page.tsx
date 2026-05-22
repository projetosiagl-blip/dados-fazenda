import { MapPin, Search, Bell, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

const STATS = [
  { label: 'Propriedades monitoradas', valor: '3', icon: MapPin, cor: '#2d6a4f' },
  { label: 'Consultas este mês', valor: '12', icon: Search, cor: '#b7882c' },
  { label: 'Alertas ativos', valor: '1', icon: Bell, cor: '#c0392b' },
  { label: 'Relatórios gerados', valor: '3', icon: FileText, cor: '#2d6a4f' },
]

const CONSULTAS_RECENTES = [
  { propriedade: 'Fazenda Santa Maria', municipio: 'Rio Verde - GO', data: 'Hoje, 09:14', status: 'ok', car: 'GO-5219803-XXXX' },
  { propriedade: 'Sítio Boa Vista', municipio: 'Mineiros - GO', data: 'Ontem, 15:32', status: 'alerta', car: 'GO-5213103-XXXX' },
  { propriedade: 'Fazenda Progresso', municipio: 'Chapadão do Céu - GO', data: '20/05/2026', status: 'ok', car: 'GO-5204300-XXXX' },
]

const ALERTAS = [
  { tipo: 'embargo', texto: 'Novo embargo IBAMA detectado em área próxima', propriedade: 'Sítio Boa Vista', tempo: '2 horas atrás' },
]

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>

      {/* CABEÇALHO */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Bom dia, Luiz</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Aqui está o resumo das suas propriedades</p>
      </div>

      {/* ALERTA ATIVO */}
      {ALERTAS.length > 0 && (
        <div style={{ backgroundColor: '#fef9ec', border: '1px solid #f0c040', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={18} color="#b7882c" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>{ALERTAS[0].texto}</p>
            <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>{ALERTAS[0].propriedade} · {ALERTAS[0].tempo}</p>
          </div>
          <Link href="/dashboard/alertas" style={{ fontSize: '0.8rem', color: '#b7882c', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>Ver detalhes →</Link>
        </div>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STATS.map(({ label, valor, icon: Icon, cor }) => (
          <div key={label} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 500 }}>{label}</span>
              <div style={{ width: 32, height: 32, backgroundColor: '#f0f5f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={cor} />
              </div>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>{valor}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

        {/* CONSULTAS RECENTES */}
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #d4ddc8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Consultas recentes</h2>
            <Link href="/dashboard/historico" style={{ fontSize: '0.8rem', color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>Ver todas →</Link>
          </div>
          <div>
            {CONSULTAS_RECENTES.map((c, i) => (
              <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: i < CONSULTAS_RECENTES.length - 1 ? '1px solid #f0f4ec' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: '#f0f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.status === 'ok'
                    ? <CheckCircle size={18} color="#2d6a4f" />
                    : <AlertTriangle size={18} color="#b7882c" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>{c.propriedade}</p>
                  <p style={{ fontSize: '0.78rem', color: '#4a5568' }}>{c.municipio} · {c.car}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a5568', fontSize: '0.75rem' }}>
                  <Clock size={12} />
                  {c.data}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAINEL LATERAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* NOVA CONSULTA */}
          <div style={{ backgroundColor: '#1e4d2b', borderRadius: 8, padding: '1.5rem' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Nova consulta</h3>
            <p style={{ color: '#a8d5b5', fontSize: '0.8rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Envie sua localização ou código CAR via WhatsApp para consultar
            </p>
            <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
              style={{ display: 'block', textAlign: 'center', backgroundColor: '#25D366', color: 'white', padding: '0.7rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Consultar via WhatsApp
            </a>
          </div>

          {/* PLANO */}
          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Seu plano</h3>
              <span style={{ backgroundColor: '#f0f9f4', color: '#2d6a4f', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20 }}>FULL</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Monitoramento ativo', 'Alertas WhatsApp', 'Farm Scan mensal', '+25 camadas de dados'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={13} color="#2d6a4f" />
                  <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #d4ddc8' }}>
              <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>Próxima cobrança: <strong style={{ color: '#1a1a1a' }}>21/06/2026</strong></p>
            </div>
          </div>

          {/* TREND */}
          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <TrendingUp size={16} color="#2d6a4f" />
              <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Uso este mês</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Consultas</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1a1a' }}>12</span>
              </div>
              <div style={{ height: 6, backgroundColor: '#f0f4ec', borderRadius: 3 }}>
                <div style={{ height: 6, backgroundColor: '#2d6a4f', borderRadius: 3, width: '40%' }} />
              </div>
              <p style={{ fontSize: '0.72rem', color: '#4a5568' }}>Ilimitado no plano Full</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
