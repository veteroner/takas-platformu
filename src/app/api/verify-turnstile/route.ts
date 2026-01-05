import { NextRequest, NextResponse } from 'next/server'

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token gerekli' },
        { status: 400 }
      )
    }

    if (!TURNSTILE_SECRET_KEY) {
      console.error('TURNSTILE_SECRET_KEY tanımlı değil')
      return NextResponse.json(
        { success: false, error: 'Sunucu yapılandırma hatası' },
        { status: 500 }
      )
    }

    // Cloudflare Turnstile doğrulama
    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    )

    const data = await verifyResponse.json()

    if (data.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Doğrulama başarısız' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
