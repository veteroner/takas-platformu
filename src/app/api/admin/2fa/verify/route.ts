import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminEmailAllowlist, getAdminUserIdAllowlist, extractBearerToken } from '@/lib/admin'
import { verifyAdminOTP, createAdmin2FAToken } from '@/lib/admin-2fa'

/**
 * POST /api/admin/2fa/verify
 * Admin 2FA kodunu doğrula
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Body'den kodu al
    const body = await req.json()
    const { code } = body as { code: string }
    
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: '6 haneli kod gerekli' }, { status: 400 })
    }
    
    // Token'dan kullanıcıyı al
    const token = extractBearerToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error || !data?.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const email = (data.user.email || '').toLowerCase()
    const userId = data.user.id
    
    // Admin kontrolü
    const emailAllow = getAdminEmailAllowlist()
    const idAllow = getAdminUserIdAllowlist()
    
    const isAdmin = (email && emailAllow.has(email)) || (userId && idAllow.has(userId))
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }
    
    // OTP doğrula
    const result = verifyAdminOTP(email, code)
    
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    // 2FA token oluştur (userId ile)
    const admin2FAToken = createAdmin2FAToken(email, userId)
    
    return NextResponse.json({ 
      success: true,
      admin2FAToken,
      message: 'Doğrulama başarılı. Admin paneline yönlendiriliyorsunuz.'
    })
    
  } catch (err) {
    console.error('2FA verify error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
