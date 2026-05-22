import { AlertTriangle, Bell, CheckCircle, Flame, TreePine, ShieldAlert } from 'lucide-react'

const ALERTAS = [
  {
    id: 1, tipo: 'embargo', icone: ShieldAlert, cor: '#c0392b', fundo: '#fdf2f2',
    titulo: 'Novo embargo IBAMA detectado',
    descricao: 'Foi identificado um termo de embargo em área a 3km do imóvel cadastrado.',
    propriedade: 'Sítio Boa Vista', municipio: 'Mineiros - GO',
    data: 'Hoje, 09:45', lido: false,
  },
  {
    id: 2, tipo: 'queimada', icone: Flame, cor: '#e67e22', fundo: '#fef5ec',
    titulo: 'Foco de queimada próximo',
    descricao: 'Detectado foco de queimada a 8km da propriedade pelo satélite AQUA_M-T.',
    propriedade: 'Fazenda Santa Maria', municipio: 'Rio Verde - GO',
    data: 'Ontem, 14:20', lido: true,
  },
  {
    id: 3, tipo: 'car', icone: CheckCircle, cor: '#2d6a4f', fundo: '#f0f9f4',
    titulo: 'Status CAR atualizado',
    descricao: 'O Cadastro Ambiental Rural da propriedade foi atualizado no SICAR.',
    propriedade: 'Fazenda Progresso', municipio: 'Chapadão do Céu - GO',
    data: '19/05/2026', lido: true,
  },
]

export default function Alertas() {
  const naoLidos = ALERTAS.filter(a => !a.lido).length

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Alertas</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>
            {naoLidos > 0 ? `${naoLidos} alerta(s) não lido(s)` : 'Todos os alertas foram lidos'}
          </p>
        </div>
        {naoLidos > 0 && (
          <button style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: '1px solid #d4ddc8', borderRadius: 6, padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Marcar todos como lidos
          </button>
        )}
      </div>

      {/* INFO BOX */}
      <div style={{ backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Bell size={16} color="#2d6a4f" />
        <p style={{ fontSize: '0.85rem', color: '#2d6a4f' }}>
          Os alertas são enviados automaticamente para seu WhatsApp assim que detectados.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ALERTAS.map(alerta => {
          const Icon = alerta.icone
          return (
            <div key={alerta.id} style={{ backgroundColor: 'white', border: `1px solid ${alerta.lido ? '#d4ddc8' : alerta.cor}`, borderRadius: 8, padding: '1.25rem 1.5rem', position: 'relative' }}>
              {!alerta.lido && (
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: 8, height: 8, backgroundColor: alerta.cor, borderRadius: '50%' }} />
              )}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: 40, height: 40, backgroundColor: alerta.fundo, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={alerta.cor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.925rem', color: '#1a1a1a' }}>{alerta.titulo}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#4a5568', flexShrink: 0, marginLeft: '1rem' }}>{alerta.data}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.5, marginBottom: '0.75rem' }}>{alerta.descricao}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', color: '#4a5568', backgroundColor: '#f5f7f2', padding: '0.2rem 0.6rem', borderRadius: 4 }}>
                      {alerta.propriedade} · {alerta.municipio}
                    </span>
                    <button style={{ fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Ver detalhes →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {ALERTAS.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <CheckCircle size={40} color="#2d6a4f" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Nenhum alerta</h3>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Suas propriedades estão sendo monitoradas e estão sem ocorrências.</p>
        </div>
      )}
    </div>
  )
}
