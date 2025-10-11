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

  try {
    const body = await req.json()
    const { userId, consents } = body as {
      userId: string
      consents: Array<{ policyKey: string; version: string }>
    }

    const ip = req.headers.get('x-forwarded-for') || ''
    const userAgent = req.headers.get('user-agent') || ''

    const { error } = await supabaseAdmin
      .from('consents')
      .insert(
        consents.map(c => ({
          user_id: userId,
          policy_key: c.policyKey,
          version: c.version,
          ip,
          user_agent: userAgent,
        }))
      )

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


