import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const body = await req.json()
  const { id, updates } = body as { id: string; updates: Record<string, any> }

  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}


