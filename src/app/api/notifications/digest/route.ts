import { NextResponse } from 'next/server'
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

// This endpoint can be invoked by a cron (Vercel/Netlify/Cloudflare) hourly/daily
export async function GET() {
  // Return early if Supabase is not configured
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Database not configured', users: 0, items: [] }, 
      { status: 503 }
    )
  }

  // Strategy: for each user with enabled notifications, if there are new items
  // since last digest, prepare a message payload (simplified)
  const { data: prefs } = await supabaseAdmin
    .from('notification_prefs')
    .select('user_id, enabled, frequency, last_digest_at')
    .eq('enabled', true)
    .limit(1000)

  const { data: latest } = await supabaseAdmin
    .from('items')
    .select('id, title, images, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  // TODO: Call OneSignal REST API to send push notifications per user
  // If OneSignal keys provided, send a single bulk notification to external user ids
  if (prefs && prefs.length && process.env.ONESIGNAL_REST_API_KEY && process.env.ONESIGNAL_APP_ID) {
    const externalIds = prefs.map((p: any) => p.user_id)
    const title = latest && latest.length ? `Yeni eklenen ürünler (${latest.length})` : 'Yeni ürünlere göz atın'
    const content = latest && latest.length ? `${latest[0].title} dahil yeni ürünler yayınlandı` : 'İlginizi çekebilecek yeni ürünler var'

    try {
      await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: process.env.ONESIGNAL_APP_ID,
          include_external_user_ids: externalIds,
          headings: { tr: title, en: 'New items' },
          contents: { tr: content, en: 'Check out the latest items' },
          ttl: 3600,
          data: { path: '/' },
        }),
      })
    } catch (e) {
      // ignore errors in demo
    }
  }

  // For demo, we return counts and update last_digest_at
  if (prefs && prefs.length) {
    const now = new Date().toISOString()
    await supabaseAdmin.from('notification_prefs').upsert(
      prefs.map((p: any) => ({ user_id: p.user_id, last_digest_at: now }))
    )
  }

  return NextResponse.json({ users: prefs?.length || 0, items: latest || [] })
}


