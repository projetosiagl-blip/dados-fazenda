import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import axios from 'axios'

const INPE_URL = 'https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=bdqueimadas:focos_bd_referencia&outputFormat=application/json&count=5000&CQL_FILTER=datahora>=\'TODAY-1\'&srsName=EPSG:4326'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data } = await axios.get(INPE_URL, { timeout: 30000 })
    const features = data?.features ?? []

    if (!features.length) {
      return NextResponse.json({ ok: true, importados: 0, mensagem: 'Sem focos novos' })
    }

    const supabase = createServiceClient()

    const registros = features.map((f: Record<string, unknown>) => {
      const props = f.properties as Record<string, unknown>
      const geom = f.geometry as { coordinates: [number, number] }
      const [lon, lat] = geom?.coordinates ?? [0, 0]
      return {
        latitude: lat,
        longitude: lon,
        municipio: props?.municipio as string,
        estado: props?.estado as string,
        data_hora: props?.datahora as string,
        satelite: props?.satelite as string,
        geom: `SRID=4326;POINT(${lon} ${lat})`,
      }
    })

    const { error } = await supabase.from('queimadas').upsert(registros, {
      onConflict: 'latitude,longitude,data_hora',
      ignoreDuplicates: true,
    })

    if (error) throw error

    return NextResponse.json({ ok: true, importados: registros.length, executado_em: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
