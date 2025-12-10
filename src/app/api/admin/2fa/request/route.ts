import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getAdminEmailAllowlist, getAdminUserIdAllowlist, extractBearerToken } from '@/lib/admin'
import { createAdminOTP, sendOTPEmail } from '@/lib/admin-2fa'

/**
 * POST /api/admin/2fa/request
 * Admin için 2FA kodu talep et
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
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
    
    // OTP oluştur
    const code = createAdminOTP(email)
    
    // E-posta gönder
    const sent = await sendOTPEmail(email, code)
    
    if (!sent && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Doğrulama kodu e-posta adresinize gönderildi.',
      // Development'ta kodu göster
      ...(process.env.NODE_ENV === 'development' && { devCode: code })
    })
    
  } catch (error: unknown) {
    console.error('2FA request error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
