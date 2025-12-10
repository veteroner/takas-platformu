import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin'
import { verifyAdmin2FAToken } from '@/lib/admin-2fa'

export async function GET(req: NextRequest) {
  // 2FA olmadan admin auth kontrolü
  const verified = await verifyAdminAuth(req)

  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2FA token kontrolü
  const twoFAToken = req.headers.get('x-admin-2fa-token')
  
  if (!twoFAToken) {
    return NextResponse.json({ 
      error: '2FA required',
      requires2FA: true 
    }, { status: 403 })
  }
  
  const twoFAResult = verifyAdmin2FAToken(twoFAToken, verified.user.id)
  
  if (!twoFAResult) {
    return NextResponse.json({ 
      error: '2FA token invalid or expired',
      requires2FA: true 
    }, { status: 403 })
  }

  return NextResponse.json({ ok: true, admin: verified.user })
}


