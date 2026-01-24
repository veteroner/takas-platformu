import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  const { userId } = await context.params

  try {
    // Get user info from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .eq('id', userId)
      .single()

    if (profileError) throw new Error('Kullanıcı bulunamadı')

    // Get user messages (sent + received)
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (msgError) throw msgError

    return NextResponse.json({
      data: {
        userInfo: profile,
        messages: messages || []
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
