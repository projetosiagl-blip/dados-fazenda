'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export default function NovaPropriedade() {
  const [form, setForm] = useState({ nome: '', car_codigo: '', latitude: '', longitude: '', area_ha: '', municipio: '', estado: 'GO', monitorada: false })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  function set(campo: string, valor: string | boolean) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setErro('Sessão expirada. Faça login novamente.')
      setCarregando(false)
      return
    }

    const { error } = await supabase.from('propriedades').insert({
      usuario_id: user.id,
      nome: form.nome,
      car_codigo: form.car_codigo || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      area_ha: form.area_ha ? parseFloat(form.area_ha) : null,
      municipio: form.municipio || null,
      estado: form.estado,
      monitorada: form.monitorada,
      ativa: true,
    })

    if (error) {
      setErro('Erro ao cadastrar propriedade. Tente novamente.')
      setCarregando(false)
      return
    }

    setSucesso(true)
    setCarregando(false)
  }

  if (sucesso) {
    return (
      <div style={{ padding: '2rem', maxWidth: 600 }}>
        <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8 }}>
          <div style={{ width: 56, height: 56, backgroundColor: '#f0f9f4', border: '2px solid #52b788', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Check size={28} color="#2d6a4f" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a1a' }}>Propriedade cadastrada!</h2>
          <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            <strong>{form.nome}</strong> foi adicionada com sucesso.
            {form.monitorada && ' O monitoramento está ativo e você receberá alertas pelo WhatsApp.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/dashboard/propriedades"
              style={{ backgroundColor: '#2d6a4f', color: 'white', padding: '0.65rem 1.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem' }}>
              Ver propriedades
            </Link>
            <button onClick={() => { setSucesso(false); setForm({ nome: '', car_codigo: '', latitude: '', longitude: '', area_ha: '', municipio: '', estado: 'GO', monitorada: false }) }}
              style={{ backgroundColor: 'white', color: '#2d6a4f', padding: '0.65rem 1.5rem', borderRadius: 6, border: '1px solid #d4ddc8', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
              Adicionar outra
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 620 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/propriedades"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4a5568', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <ArrowLeft size={15} />
          Voltar
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>Adicionar propriedade</h1>
        <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>Cadastre uma fazenda para consultar e monitorar</p>
      </div>

      <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
        {erro && (
          <div style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} color="#c0392b" />
            <span style={{ fontSize: '0.85rem', color: '#c0392b' }}>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
              Nome da propriedade <span style={{ color: '#c0392b' }}>*</span>
            </label>
            <input type="text" required value={form.nome} onChange={e => set('nome', e.target.value)}
              placeholder="Fazenda Santa Maria"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>
              Código CAR
            </label>
            <input type="text" value={form.car_codigo} onChange={e => set('car_codigo', e.target.value.toUpperCase())}
              placeholder="GO-5219803-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', fontFamily: 'monospace' }} />
            <p style={{ color: '#4a5568', fontSize: '0.72rem', marginTop: '0.25rem' }}>Formato: UF-7dígitos-32caracteres</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Latitude</label>
              <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)}
                placeholder="-17.8500"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Longitude</label>
              <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)}
                placeholder="-50.9200"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Área (hectares)</label>
              <input type="number" step="any" value={form.area_ha} onChange={e => set('area_ha', e.target.value)}
                placeholder="1240"
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Estado</label>
              <select value={form.estado} onChange={e => set('estado', e.target.value)}
                style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa', cursor: 'pointer' }}>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.4rem' }}>Município</label>
            <input type="text" value={form.municipio} onChange={e => set('municipio', e.target.value)}
              placeholder="Rio Verde"
              style={{ width: '100%', padding: '0.7rem', border: '1px solid #d4ddc8', borderRadius: 6, fontSize: '0.875rem', backgroundColor: '#fafcfa' }} />
          </div>

          <div style={{ backgroundColor: '#f8faf6', border: '1px solid #d4ddc8', borderRadius: 6, padding: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.monitorada} onChange={e => set('monitorada', e.target.checked)}
                style={{ width: 16, height: 16, marginTop: 2, cursor: 'pointer', accentColor: '#2d6a4f' }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', marginBottom: '0.2rem' }}>
                  Ativar monitoramento contínuo
                </p>
                <p style={{ fontSize: '0.78rem', color: '#4a5568', lineHeight: 1.5 }}>
                  Você receberá alertas automáticos pelo WhatsApp quando detectarmos embargos, queimadas ou outras mudanças nesta propriedade.
                </p>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
            <Link href="/dashboard/propriedades"
              style={{ flex: 1, textAlign: 'center', padding: '0.75rem', backgroundColor: 'white', color: '#4a5568', border: '1px solid #d4ddc8', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>
              Cancelar
            </Link>
            <button type="submit" disabled={carregando}
              style={{ flex: 2, padding: '0.75rem', backgroundColor: carregando ? '#7aab8e' : '#2d6a4f', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.9rem', cursor: carregando ? 'not-allowed' : 'pointer' }}>
              {carregando ? 'Cadastrando...' : 'Cadastrar propriedade'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: '1.25rem', backgroundColor: '#f0f9f4', border: '1px solid #b8dfc8', borderRadius: 6, padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
        <MapPin size={15} color="#2d6a4f" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.8rem', color: '#2d6a4f', lineHeight: 1.5 }}>
          Dica: você também pode consultar qualquer propriedade enviando sua localização ou código CAR diretamente pelo WhatsApp, sem precisar cadastrar.
        </p>
      </div>
    </div>
  )
}
