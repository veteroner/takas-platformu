import { NextRequest, NextResponse } from 'next/server'

// IP bazlı rate limiting için basit in-memory store
// Production'da Redis kullanılmalı
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 5 * 60 * 1000 // 5 dakika
const MAX_REQUESTS = 3 // 5 dakikada max 3 kayıt

export async function POST(request: NextRequest) {
  try {
    // IP adresini al
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 
               request.headers.get('x-real-ip') || 
               'unknown'

    const now = Date.now()
    const key = `signup:${ip}`

    // Mevcut rate limit bilgisini al
    let rateLimit = rateLimitStore.get(key)

    // Süre dolmuşsa sıfırla
    if (rateLimit && now > rateLimit.resetAt) {
      rateLimit = undefined
    }

    // İlk istek
    if (!rateLimit) {
      rateLimitStore.set(key, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW
      })
      return NextResponse.json({ 
        allowed: true,
        remaining: MAX_REQUESTS - 1
      })
    }

    // Limit aşıldı mı?
    if (rateLimit.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((rateLimit.resetAt - now) / 1000)
      return NextResponse.json(
        { 
          allowed: false,
          error: `Çok fazla kayıt denemesi. ${Math.ceil(retryAfter / 60)} dakika sonra tekrar deneyin.`,
          retryAfter
        },
        { status: 429 }
      )
    }

    // Sayacı artır
    rateLimit.count++
    rateLimitStore.set(key, rateLimit)

    return NextResponse.json({ 
      allowed: true,
      remaining: MAX_REQUESTS - rateLimit.count
    })

  } catch (error) {
    console.error('Rate limit check error:', error)
    // Hata durumunda kayda izin ver
    return NextResponse.json({ allowed: true })
  }
}

// Cleanup: Eski kayıtları temizle (her saat)
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000)
