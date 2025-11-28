// List active products with limited fields and simple cache
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 60 // 60s cache window

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ error: 'Config missing' }, { status: 500 })

  const client = createClient(url, anon)
  const { data, error } = await client
    .from('items')
    .select('id,title,category,condition,images,estimated_value,location,created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
