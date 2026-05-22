import { CheckCircle, AlertTriangle, Clock, Download, Search } from 'lucide-react'

const HISTORICO = [
  { propriedade: 'Fazenda Santa Maria', municipio: 'Rio Verde - GO', car: 'GO-5219803-XXXX', data: '22/05/2026 09:14', status: 'ok', area_ha: 1240, embargos: 0 },
  { propriedade: 'Sítio Boa Vista', municipio: 'Mineiros - GO', car: 'GO-5213103-XXXX', data: '21/05/2026 15:32', status: 'alerta', area_ha: 340, embargos: 1 },
  { propriedade: 'Fazenda Progresso', municipio: 'Chapadão do Céu - GO', car: 'GO-5204300-XXXX', data: '20/05/2026 11:05', status: 'ok', area_ha: 2800, embargos: 0 },
  { propriedade: 'Fazenda Santa Maria', municipio: 'Rio Verde - GO', car: 'GO-5219803-XXXX', data: '15/05/2026 08:30', status: 'ok', area_ha: 1240, embargos: 0 },
  { propriedade: 'Sítio Boa Vista', municipio: 'Mineiros - GO', car: 'GO-5213103-XXXX', data: '10/05/2026 14:20', status: 'ok', area_ha: 340, embargos: 0 },
]

export default function Historico() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Histórico de consultas</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>{HISTORICO.length} consultas realizadas</p>
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#4a5568' }} />
          <input placeholder="Buscar propriedade ou CAR..."
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.6rem', paddingBottom: '0.6rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: 'white', outline: 'none' }} />
        </div>
        <select style={{ padding: '0.6rem 0.875rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: 'white', color: '#4a5568', cursor: 'pointer' }}>
          <option>Todos os status</option>
          <option>Sem alertas</option>
          <option>Com alertas</option>
        </select>
      </div>

      {/* TABELA */}
      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8faf6', borderBottom: '1px solid #d4ddc8' }}>
              {['Propriedade', 'CAR', 'Área', 'Embargos', 'Data', 'Ações'].map(h => (
                <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORICO.map((c, i) => (
              <tr key={i} style={{ borderBottom: i < HISTORICO.length - 1 ? '1px solid #f0f4ec' : 'none' }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {c.status === 'ok'
                      ? <CheckCircle size={15} color="#2d6a4f" />
                      : <AlertTriangle size={15} color="#b7882c" />}
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>{c.propriedade}</p>
                      <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{c.municipio}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#4a5568', fontFamily: 'monospace' }}>{c.car}</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>{c.area_ha.toLocaleString('pt-BR')} ha</span>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  {c.embargos > 0
                    ? <span style={{ backgroundColor: '#fef9ec', color: '#b7882c', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20 }}>{c.embargos} ativo</span>
                    : <span style={{ backgroundColor: '#f0f9f4', color: '#2d6a4f', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20 }}>Nenhum</span>
                  }
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4a5568', fontSize: '0.8rem' }}>
                    <Clock size={12} />
                    {c.data}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Download size={13} />
                    Baixar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
