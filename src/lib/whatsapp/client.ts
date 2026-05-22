import axios from 'axios'

const evolution = axios.create({
  baseURL: process.env.EVOLUTION_API_URL,
  headers: {
    apikey: process.env.EVOLUTION_API_KEY,
    'Content-Type': 'application/json',
  },
})

const INSTANCIA = process.env.EVOLUTION_INSTANCE!

export async function enviarMensagem(telefone: string, texto: string) {
  const numero = telefone.replace(/\D/g, '')

  await evolution.post(`/message/sendText/${INSTANCIA}`, {
    number: `${numero}@s.whatsapp.net`,
    text: texto,
  })
}

export async function enviarArquivo(telefone: string, url: string, nome: string) {
  const numero = telefone.replace(/\D/g, '')

  await evolution.post(`/message/sendMedia/${INSTANCIA}`, {
    number: `${numero}@s.whatsapp.net`,
    mediatype: 'document',
    media: url,
    fileName: nome,
  })
}
