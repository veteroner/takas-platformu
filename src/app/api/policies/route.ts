import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabaseAdmin: any = null

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    { auth: { persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  // Return early if Supabase is not configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    )
  }

  // Admin: bump version and set re-consent required flag
  try {
    const body = await req.json()
    const { policyKey, newVersion } = body as { policyKey: string; newVersion: string }

    // Store current required version in a simple table (key/value)
    const { error } = await supabaseAdmin
      .from('app_settings')
      .upsert({ key: `policy_required_${policyKey}`, value: newVersion }, { onConflict: 'key' })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

export async function GET() {
  // Return early if Supabase is not configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured' }, 
      { status: 503 }
    )
  }

  // Client: fetch required versions to enforce re-consent
  const { data, error } = await supabaseAdmin
    .from('app_settings')
    .select('key, value')
    .like('key', 'policy_required_%')

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}


