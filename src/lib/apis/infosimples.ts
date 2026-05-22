import axios from 'axios'
import { DadosCAR } from '@/types'

const api = axios.create({
  baseURL: 'https://api.infosimples.com/api/v2',
  params: { token: process.env.INFOSIMPLES_TOKEN },
})

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

export async function consultarCARPorCoordenada(
  lat: number,
  lon: number
): Promise<DadosCAR | null> {
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
