import axios from 'axios'
import { DadosINCRA } from '@/types'

const api = axios.create({
  baseURL: 'https://api.netrin.com.br',
  headers: { Authorization: `Bearer ${process.env.NETRIN_API_KEY}` },
})

export async function consultarINCRA(car: string): Promise<DadosINCRA | null> {
  try {
    const { data } = await api.get('/incra-sigef/parcelas', {
      params: { car },
    })

    if (!data?.data) return null
    const d = data.data

    return {
      nirf: d.nirf,
      ccir: d.ccir,
      nome_imovel: d.nome,
      municipio: d.municipio,
      area_ha: d.area_hectares,
      situacao: d.situacao,
      titulares: d.titulares ?? [],
    }
  } catch {
    return null
  }
}

export async function consultarINCRAPorCoordenada(
  lat: number,
  lon: number
): Promise<DadosINCRA | null> {
  try {
    const { data } = await api.get('/incra-sigef/parcelas', {
      params: { latitude: lat, longitude: lon },
    })

    if (!data?.data) return null
    const d = data.data

    return {
      nirf: d.nirf,
      ccir: d.ccir,
      nome_imovel: d.nome,
      municipio: d.municipio,
      area_ha: d.area_hectares,
      situacao: d.situacao,
      titulares: d.titulares ?? [],
    }
  } catch {
    return null
  }
}
