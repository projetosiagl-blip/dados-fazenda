import axios from 'axios'
import { DadosCAR, DadosINCRA } from '@/types'

const api = axios.create({
  baseURL: 'https://api.infosimples.com/api/v2',
  params: { token: process.env.INFOSIMPLES_TOKEN },
  timeout: 20000,
})

// ============================================================
// CAR / SICAR
// ============================================================

export async function consultarCAR(codigo: string): Promise<DadosCAR | null> {
  try {
    const { data } = await api.get('/consultas/car/imovel', {
      params: { car: codigo },
    })
    if (data.code !== 200 || !data.data?.[0]) return null
    const d = data.data[0]
    return {
      codigo: d.car ?? codigo,
      status: d.status ?? 'Desconhecido',
      area_ha: parseFloat(d.area ?? '0'),
      municipio: d.municipio ?? '',
      estado: d.estado ?? '',
      proprietario: d.proprietario,
      coordenadas: d.coordenadas,
    }
  } catch {
    return null
  }
}

export async function consultarCARPorCoordenada(lat: number, lon: number): Promise<DadosCAR | null> {
  try {
    const { data } = await api.get('/consultas/car/imovel', {
      params: { latitude: lat, longitude: lon },
    })
    if (data.code !== 200 || !data.data?.[0]) return null
    const d = data.data[0]
    return {
      codigo: d.car ?? '',
      status: d.status ?? 'Desconhecido',
      area_ha: parseFloat(d.area ?? '0'),
      municipio: d.municipio ?? '',
      estado: d.estado ?? '',
      proprietario: d.proprietario,
      coordenadas: d.coordenadas,
    }
  } catch {
    return null
  }
}

// ============================================================
// INCRA / SIGEF — via Infosimples
// ============================================================

export async function consultarINCRAPorCAR(car: string): Promise<DadosINCRA | null> {
  try {
    const { data } = await api.get('/consultas/incra/sigef/parcelas', {
      params: { car },
    })
    if (data.code !== 200 || !data.data?.[0]) return null
    const d = data.data[0]
    return {
      nirf: d.nirf,
      ccir: d.ccir,
      nome_imovel: d.denominacao ?? d.nome,
      municipio: d.municipio,
      area_ha: parseFloat(d.area_registrada ?? d.area_total ?? '0') || undefined,
      situacao: d.situacao,
      titulares: d.detentores?.map((t: Record<string, unknown>) => t.nome as string) ?? [],
    }
  } catch {
    return null
  }
}

export async function consultarINCRAPorCoordenada(lat: number, lon: number): Promise<DadosINCRA | null> {
  try {
    const { data } = await api.get('/consultas/incra/sigef/parcelas', {
      params: { latitude: lat, longitude: lon },
    })
    if (data.code !== 200 || !data.data?.[0]) return null
    const d = data.data[0]
    return {
      nirf: d.nirf,
      ccir: d.ccir,
      nome_imovel: d.denominacao ?? d.nome,
      municipio: d.municipio,
      area_ha: parseFloat(d.area_registrada ?? d.area_total ?? '0') || undefined,
      situacao: d.situacao,
      titulares: d.detentores?.map((t: Record<string, unknown>) => t.nome as string) ?? [],
    }
  } catch {
    return null
  }
}

// ============================================================
// CCIR — Certificado de Cadastro de Imóvel Rural
// ============================================================

export async function consultarCCIR(nirf: string): Promise<string | null> {
  try {
    const { data } = await api.get('/consultas/incra/sncr/imovel', {
      params: { nirf },
    })
    if (data.code !== 200 || !data.data?.[0]) return null
    return data.data[0].ccir ?? null
  } catch {
    return null
  }
}
