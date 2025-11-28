import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limit (not perfect on serverless; for production use Redis/Upstash)
const buckets: Map<string, { count: number; reset: number }> = new Map()

function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  let bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + windowMs }
    buckets.set(key, bucket)
  }
  bucket.count++
  return bucket.count <= max
}

export function middleware(req: NextRequest) {
  // Only apply to API routes
  if (!req.nextUrl.pathname.startsWith('/api')) return NextResponse.next()

  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10)
  const max = parseInt(process.env.RATE_LIMIT_MAX || '120', 10)

  const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const user = req.headers.get('x-user-id') || 'anon'
  const key = `${ip}:${user}`

  if (!rateLimit(key, max, windowMs)) {
    return new NextResponse(JSON.stringify({ error: 'rate_limited' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '5' }
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}
