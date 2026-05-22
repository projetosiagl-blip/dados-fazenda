import { MapPin, Plus, Bell, CheckCircle, AlertTriangle, MoreVertical } from 'lucide-react'
import Link from 'next/link'

const PROPRIEDADES = [
  {
    nome: 'Fazenda Santa Maria',
    municipio: 'Rio Verde', estado: 'GO',
    area_ha: 1240,
    car: 'GO-5219803-XXXX',
    status_car: 'Ativo',
    monitorada: true,
    embargos: 0,
    ultima_consulta: 'Hoje, 09:14',
  },
  {
    nome: 'Sítio Boa Vista',
    municipio: 'Mineiros', estado: 'GO',
    area_ha: 340,
    car: 'GO-5213103-XXXX',
    status_car: 'Ativo',
    monitorada: true,
    embargos: 1,
    ultima_consulta: 'Ontem, 15:32',
  },
  {
    nome: 'Fazenda Progresso',
    municipio: 'Chapadão do Céu', estado: 'GO',
    area_ha: 2800,
    car: 'GO-5204300-XXXX',
    status_car: 'Pendente',
    monitorada: false,
    embargos: 0,
    ultima_consulta: '20/05/2026',
  },
]

export default function Propriedades() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Propriedades</h1>
          <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>{PROPRIEDADES.length} imóveis cadastrados</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem 1.25rem', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
          <Plus size={16} />
          Adicionar propriedade
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PROPRIEDADES.map((p, i) => (
          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, backgroundColor: '#f0f5f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} color="#2d6a4f" />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>{p.nome}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#4a5568' }}>{p.municipio} - {p.estado}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {p.embargos > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#fef9ec', border: '1px solid #f0c040', borderRadius: 20, padding: '0.2rem 0.75rem' }}>
                    <AlertTriangle size={12} color="#b7882c" />
                    <span style={{ fontSize: '0.75rem', color: '#b7882c', fontWeight: 600 }}>{p.embargos} embargo</span>
                  </div>
                )}
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568', padding: '0.25rem' }}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { label: 'Área', valor: `${p.area_ha.toLocaleString('pt-BR')} ha` },
                { label: 'CAR', valor: p.car },
                { label: 'Status CAR', valor: p.status_car },
                { label: 'Última consulta', valor: p.ultima_consulta },
              ].map(item => (
                <div key={item.label} style={{ backgroundColor: '#f8faf6', borderRadius: 6, padding: '0.6rem 0.75rem' }}>
                  <p style={{ fontSize: '0.72rem', color: '#4a5568', marginBottom: '0.2rem' }}>{item.label}</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a' }}>{item.valor}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.monitorada
                  ? <><Bell size={14} color="#2d6a4f" /><span style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 500 }}>Monitoramento ativo</span></>
                  : <><Bell size={14} color="#4a5568" /><span style={{ fontSize: '0.8rem', color: '#4a5568' }}>Sem monitoramento</span></>
                }
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, background: 'none', border: '1px solid #d4ddc8', borderRadius: 5, padding: '0.4rem 0.875rem', cursor: 'pointer' }}>
                  Ver relatório
                </button>
                <button style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600, backgroundColor: '#2d6a4f', border: 'none', borderRadius: 5, padding: '0.4rem 0.875rem', cursor: 'pointer' }}>
                  Nova consulta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
