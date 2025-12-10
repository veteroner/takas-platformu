import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In-memory rate limit buckets
// Note: On serverless, each instance has separate memory. For production, consider Redis/Upstash.
const buckets: Map<string, { count: number; reset: number }> = new Map()

// Cleanup old buckets periodically to prevent memory leak
let lastCleanup = Date.now()
function cleanupBuckets() {
  const now = Date.now()
  if (now - lastCleanup > 300000) { // Every 5 minutes
    for (const [key, bucket] of buckets) {
      if (bucket.reset < now) buckets.delete(key)
    }
    lastCleanup = now
  }
}

function rateLimit(key: string, max: number, windowMs: number): { allowed: boolean; remaining: number } {
  cleanupBuckets()
  const now = Date.now()
  let bucket = buckets.get(key)
  if (!bucket || bucket.reset < now) {
    bucket = { count: 0, reset: now + windowMs }
    buckets.set(key, bucket)
  }
  bucket.count++
  return { 
    allowed: bucket.count <= max, 
    remaining: Math.max(0, max - bucket.count) 
  }
}

// Route-specific rate limits
const ROUTE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/swipes': { max: 60, windowMs: 60000 },      // 60 swipes per minute (flood protection)
  '/api/messages': { max: 30, windowMs: 60000 },    // 30 messages per minute
  '/api/items': { max: 20, windowMs: 60000 },       // 20 item operations per minute
  '/api/auth': { max: 10, windowMs: 60000 },        // 10 auth attempts per minute (brute force protection)
  '/api/admin': { max: 30, windowMs: 60000 },       // Admin routes
  'default': { max: 120, windowMs: 60000 }          // Default: 120 requests per minute
}

function getRouteLimit(pathname: string): { max: number; windowMs: number } {
  for (const [route, limit] of Object.entries(ROUTE_LIMITS)) {
    if (route !== 'default' && pathname.startsWith(route)) {
      return limit
    }
  }
  return ROUTE_LIMITS['default']
}

export function middleware(req: NextRequest) {
  // Only apply to API routes
  if (!req.nextUrl.pathname.startsWith('/api')) return NextResponse.next()

  const pathname = req.nextUrl.pathname
  const { max, windowMs } = getRouteLimit(pathname)

  // Create unique key: IP + User + Route category
  const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const user = req.headers.get('x-user-id') || 'anon'
  const routeKey = Object.keys(ROUTE_LIMITS).find(r => r !== 'default' && pathname.startsWith(r)) || 'default'
  const key = `${ip}:${user}:${routeKey}`

  const { allowed, remaining } = rateLimit(key, max, windowMs)

  if (!allowed) {
    return new NextResponse(JSON.stringify({ 
      error: 'rate_limited',
      message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
      retryAfter: Math.ceil(windowMs / 1000)
    }), {
      status: 429,
      headers: { 
        'Content-Type': 'application/json', 
        'Retry-After': String(Math.ceil(windowMs / 1000)),
        'X-RateLimit-Limit': String(max),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + Math.ceil(windowMs / 1000))
      }
    })
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(max))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  
  return response
}

export const config = {
  matcher: ['/api/:path*']
}
