import { MensagemWhatsApp } from '@/types'

const REGEX_CAR = /[A-Z]{2}-\d{7}-[A-Z0-9]{32}/i
const REGEX_COORDS = /(-?\d{1,3}\.\d{3,})[,\s]+(-?\d{1,3}\.\d{3,})/
const REGEX_GOOGLE_MAPS = /(?:maps\.google\.com|goo\.gl\/maps|google\.com\/maps).*?(?:@|q=|ll=)(-?\d{1,3}\.\d+)[,+](-?\d{1,3}\.\d+)/
const REGEX_WAZE = /waze\.com\/ul\?ll=(-?\d{1,3}\.\d+)%2C(-?\d{1,3}\.\d+)/
const REGEX_APPLE_MAPS = /maps\.apple\.com.*?[?&]ll=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/
const REGEX_PLUS_CODE = /[23456789CFGHJMPQRVWX]{4}\+[23456789CFGHJMPQRVWX]{2,}/

const COMANDOS_AJUDA = ['oi', 'olá', 'ola', 'help', 'ajuda', 'menu', 'início', 'inicio', 'start']
const COMANDOS_PLANOS = ['planos', 'plano', 'assinar', 'preço', 'preco', 'valor', 'quanto custa']

export function parseMensagem(payload: Record<string, unknown>): MensagemWhatsApp | null {
  try {
    const data = payload.data as Record<string, unknown>
    const key = data?.key as Record<string, unknown>
    const telefone = (key?.remoteJid as string)?.replace('@s.whatsapp.net', '')
    const pushName = data?.pushName as string

    const msg = data?.message as Record<string, unknown>
    if (!msg || !telefone) return null

    // 1. Localização nativa do WhatsApp
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

    // 2. Localização via live location
    if (msg.liveLocationMessage) {
      const loc = msg.liveLocationMessage as Record<string, unknown>
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
      ((msg.imageMessage as Record<string, unknown>)?.caption as string) ||
      ''

    if (!texto) return null

    const textoLower = texto.toLowerCase().trim()

    // 3. Comandos especiais
    if (COMANDOS_AJUDA.some(c => textoLower === c)) {
      return { tipo: 'texto', telefone, nome: pushName, texto: '__ajuda__' }
    }
    if (COMANDOS_PLANOS.some(c => textoLower.includes(c))) {
      return { tipo: 'texto', telefone, nome: pushName, texto: '__planos__' }
    }

    // 4. Código CAR
    const matchCAR = texto.match(REGEX_CAR)
    if (matchCAR) {
      return { tipo: 'car', telefone, nome: pushName, car_codigo: matchCAR[0].toUpperCase() }
    }

    // 5. Link Google Maps
    const matchGoogle = texto.match(REGEX_GOOGLE_MAPS)
    if (matchGoogle) {
      return {
        tipo: 'localizacao',
        telefone,
        nome: pushName,
        latitude: parseFloat(matchGoogle[1]),
        longitude: parseFloat(matchGoogle[2]),
      }
    }

    // 6. Link Waze
    const matchWaze = texto.match(REGEX_WAZE)
    if (matchWaze) {
      return {
        tipo: 'localizacao',
        telefone,
        nome: pushName,
        latitude: parseFloat(matchWaze[1]),
        longitude: parseFloat(matchWaze[2]),
      }
    }

    // 7. Link Apple Maps
    const matchApple = texto.match(REGEX_APPLE_MAPS)
    if (matchApple) {
      return {
        tipo: 'localizacao',
        telefone,
        nome: pushName,
        latitude: parseFloat(matchApple[1]),
        longitude: parseFloat(matchApple[2]),
      }
    }

    // 8. Coordenadas brutas no texto (ex: -15.1234, -47.5678)
    const matchCoords = texto.match(REGEX_COORDS)
    if (matchCoords) {
      const lat = parseFloat(matchCoords[1])
      const lon = parseFloat(matchCoords[2])
      // Valida que são coordenadas plausíveis para o Brasil
      if (lat >= -34 && lat <= 5 && lon >= -74 && lon <= -28) {
        return { tipo: 'localizacao', telefone, nome: pushName, latitude: lat, longitude: lon }
      }
    }

    // 9. Plus Code (Google) — retorna como texto para tratamento futuro
    if (REGEX_PLUS_CODE.test(texto)) {
      return { tipo: 'texto', telefone, nome: pushName, texto: `__plus_code__:${texto.trim()}` }
    }

    // 10. Texto genérico
    return { tipo: 'texto', telefone, nome: pushName, texto }
  } catch {
    return null
  }
}
