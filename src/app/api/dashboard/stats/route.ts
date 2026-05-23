import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const inicioMes = new Date()
  inicioMes.setDate(1)
  inicioMes.setHours(0, 0, 0, 0)

  const [props, consultas, alertas, consultasMes] = await Promise.all([
    supabase.from('propriedades').select('id', { count: 'exact', head: true }).eq('usuario_id', user.id).eq('ativa', true),
    supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('usuario_id', user.id),
    supabase.from('alertas').select('id', { count: 'exact', head: true }).eq('usuario_id', user.id).eq('enviado', false),
    supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('usuario_id', user.id).gte('criado_em', inicioMes.toISOString()),
  ])

  return NextResponse.json({
    propriedades: props.count ?? 0,
    consultas_total: consultas.count ?? 0,
    consultas_mes: consultasMes.count ?? 0,
    alertas_ativos: alertas.count ?? 0,
  })
}
