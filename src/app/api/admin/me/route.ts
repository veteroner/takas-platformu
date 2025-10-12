import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)

  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ ok: true, admin: verified.user })
}


