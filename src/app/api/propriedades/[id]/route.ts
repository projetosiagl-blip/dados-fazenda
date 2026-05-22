import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const campos: Record<string, unknown> = {}

  if (typeof body.monitorada === 'boolean') campos.monitorada = body.monitorada
  if (typeof body.nome === 'string') campos.nome = body.nome
  if (typeof body.ativa === 'boolean') campos.ativa = body.ativa

  const { data, error } = await supabase
    .from('propriedades')
    .update(campos)
    .eq('id', id)
    .eq('usuario_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, data })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { error } = await supabase
    .from('propriedades')
    .update({ ativa: false })
    .eq('id', id)
    .eq('usuario_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
