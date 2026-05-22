import axios from 'axios'
import { EmbargosIBAMA } from '@/types'

const IBAMA_URL =
  'https://dadosabertos.ibama.gov.br/dataset/4d867509-74b9-4a94-ae70-59fee95083f3/resource/fiscalizacao-termo-de-embargo/download'

export async function buscarEmbargos(
  lat: number,
  lon: number,
  raioKm = 10
): Promise<EmbargosIBAMA[]> {
  try {
    // Busca no banco local (PostGIS) — muito mais rápido que API ao vivo
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = createServiceClient()

    const { data, error } = await supabase.rpc('buscar_embargos_proximo', {
      lat,
      lon,
      raio_km: raioKm,
    })

    if (error || !data) return []

    return data.map((e: Record<string, unknown>) => ({
      seq_tad: String(e.seq_tad),
      nome_embargado: e.nome_embargado as string,
      data_embargo: e.data_embargo as string,
      status: e.status as string,
      municipio: e.municipio as string,
    }))
  } catch {
    return []
  }
}

export async function sincronizarEmbargos(): Promise<number> {
  try {
    const { data } = await axios.get(IBAMA_URL, { timeout: 30000 })

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = createServiceClient()

    const linhas = String(data).split('\n').slice(1).filter(Boolean)
    let importados = 0

    for (const linha of linhas) {
      const cols = linha.split(';')
      if (cols.length < 5) continue

      await supabase.from('embargos_ibama').upsert({
        seq_tad: cols[0]?.trim(),
        nome_embargado: cols[1]?.trim(),
        municipio: cols[2]?.trim(),
        estado: cols[3]?.trim(),
        data_embargo: cols[4]?.trim(),
        status: cols[5]?.trim() ?? 'Ativo',
      }, { onConflict: 'seq_tad' })

      importados++
    }

    return importados
  } catch {
    return 0
  }
}
