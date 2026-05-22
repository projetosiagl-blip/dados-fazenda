export type Plano = 'basico' | 'full' | 'empresarial'
export type StatusAssinatura = 'ativa' | 'cancelada' | 'inadimplente' | 'trial'
export type TipoAlerta = 'embargo_ibama' | 'queimada' | 'desmatamento' | 'mudanca_car' | 'area_protegida'

export interface Usuario {
  id: string
  nome: string
  telefone: string
  email?: string
  plano: Plano
  status_assinatura: StatusAssinatura
  criado_em: string
}

export interface Propriedade {
  id: string
  usuario_id: string
  nome: string
  car_codigo?: string
  latitude: number
  longitude: number
  ativa: boolean
  criado_em: string
}

export interface ResultadoConsulta {
  car?: DadosCAR
  incra?: DadosINCRA
  embargos: EmbargosIBAMA[]
  camadas_geo?: CamadasGeo
  consultado_em: string
}

export interface DadosCAR {
  codigo: string
  status: string
  area_ha: number
  municipio: string
  estado: string
  proprietario?: string
  coordenadas?: number[][]
}

export interface DadosINCRA {
  nirf?: string
  ccir?: string
  nome_imovel?: string
  municipio?: string
  area_ha?: number
  situacao?: string
  titulares?: string[]
}

export interface EmbargosIBAMA {
  seq_tad: string
  nome_embargado?: string
  data_embargo: string
  status: string
  municipio?: string
}

export interface CamadasGeo {
  terras_indigenas: string[]
  assentamentos: string[]
  unidades_conservacao: string[]
  icmbio: string[]
  florestas_publicas: string[]
  areas_mineracao: string[]
  dentro_de_prodes: boolean
  queimadas_proximas: number
}

export interface MensagemWhatsApp {
  tipo: 'localizacao' | 'car' | 'texto'
  telefone: string
  nome?: string
  latitude?: number
  longitude?: number
  car_codigo?: string
  texto?: string
}

export interface RespostaWhatsApp {
  texto: string
  telefone: string
}
