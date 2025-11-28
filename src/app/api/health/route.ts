import { NextResponse } from 'next/server'

export async function GET() {
  // Basit sağlık kontrolü (200 OK)
  return NextResponse.json({ ok: true, ts: Date.now() })
}
