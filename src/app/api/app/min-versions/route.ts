import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const admin = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null

export async function GET() {
  if (!admin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  const { data, error } = await admin
    .from('app_settings')
    .select('key, value')
    .in('key', ['min_ios_version', 'min_android_version'])

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const map: Record<string, string> = {}
  for (const row of data || []) map[row.key] = row.value
  return NextResponse.json({ data: map })
}
