import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const body = await req.json()
  const { key, value } = body as { key: string; value: string }

  const { error } = await supabase
    .from('app_settings')
    .upsert({ key, value }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}


