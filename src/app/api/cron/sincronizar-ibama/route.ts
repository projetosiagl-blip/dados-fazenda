import { NextRequest, NextResponse } from 'next/server'
import { sincronizarEmbargos } from '@/lib/apis/ibama'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const total = await sincronizarEmbargos()
    return NextResponse.json({ ok: true, importados: total, executado_em: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
