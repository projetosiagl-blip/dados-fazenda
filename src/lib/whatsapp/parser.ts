import { MensagemWhatsApp } from '@/types'

const REGEX_CAR = /[A-Z]{2}-\d{7}-[A-Z0-9]{32}/i
const REGEX_COORDS = /(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/

export function parseMensagem(payload: Record<string, unknown>): MensagemWhatsApp | null {
  try {
    const data = payload.data as Record<string, unknown>
    const key = data?.key as Record<string, unknown>
    const telefone = (key?.remoteJid as string)?.replace('@s.whatsapp.net', '')
    const pushName = data?.pushName as string

    const msg = data?.message as Record<string, unknown>
    if (!msg || !telefone) return null

    // Localização via WhatsApp
    if (msg.locationMessage) {
      const loc = msg.locationMessage as Record<string, unknown>
      return {
        tipo: 'localizacao',
        telefone,
        nome: pushName,
        latitude: loc.degreesLatitude as number,
        longitude: loc.degreesLongitude as number,
      }
    }

    const texto =
      (msg.conversation as string) ||
      ((msg.extendedTextMessage as Record<string, unknown>)?.text as string) ||
      ''

    if (!texto) return null

    // Código CAR no texto
    const matchCAR = texto.match(REGEX_CAR)
    if (matchCAR) {
      return {
        tipo: 'car',
        telefone,
        nome: pushName,
        car_codigo: matchCAR[0].toUpperCase(),
      }
    }

    // Coordenadas no texto (ex: -15.123, -47.456)
    const matchCoords = texto.match(REGEX_COORDS)
    if (matchCoords) {
      return {
        tipo: 'localizacao',
        telefone,
        nome: pushName,
        latitude: parseFloat(matchCoords[1]),
        longitude: parseFloat(matchCoords[2]),
      }
    }

    // Texto genérico
    return {
      tipo: 'texto',
      telefone,
      nome: pushName,
      texto,
    }
  } catch {
    return null
  }
}
