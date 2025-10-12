import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const body = await req.json()
  const { id, updates } = body as { id: string; updates: Record<string, any> }

  const { data, error } = await supabase
    .from('matches')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}


