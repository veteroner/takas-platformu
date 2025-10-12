import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const [users, items, matches, messages] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('items').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true }),
    supabase.from('messages').select('id', { count: 'exact', head: true })
  ])

  const data = {
    users: users.count || 0,
    items: items.count || 0,
    matches: matches.count || 0,
    messages: messages.count || 0
  }

  return NextResponse.json({ data })
}


