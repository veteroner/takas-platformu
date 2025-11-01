import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function GET(req: NextRequest) {
  const verified = await verifyAdminRequest(req)
  if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseAdmin()
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

  try {
    // Get all messages
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('sender_id, receiver_id, created_at')
      .order('created_at', { ascending: false })

    if (msgError) throw msgError

    // Get all users from profiles table instead of auth.users
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')

    if (profileError) throw profileError

    // Calculate stats per user
    const userMap = new Map()

    messages?.forEach((msg: any) => {
      // Process sender
      if (!userMap.has(msg.sender_id)) {
        const profile = profiles?.find((p: any) => p.id === msg.sender_id)
        userMap.set(msg.sender_id, {
          user_id: msg.sender_id,
          user_email: profile?.email || 'Bilinmiyor',
          total_messages: 0,
          sent_messages: 0,
          received_messages: 0,
          last_message_date: msg.created_at
        })
      }
      const senderStats = userMap.get(msg.sender_id)
      senderStats.sent_messages++
      senderStats.total_messages++
      if (new Date(msg.created_at) > new Date(senderStats.last_message_date)) {
        senderStats.last_message_date = msg.created_at
      }

      // Process receiver
      if (!userMap.has(msg.receiver_id)) {
        const profile = profiles?.find((p: any) => p.id === msg.receiver_id)
        userMap.set(msg.receiver_id, {
          user_id: msg.receiver_id,
          user_email: profile?.email || 'Bilinmiyor',
          total_messages: 0,
          sent_messages: 0,
          received_messages: 0,
          last_message_date: msg.created_at
        })
      }
      const receiverStats = userMap.get(msg.receiver_id)
      receiverStats.received_messages++
      receiverStats.total_messages++
      if (new Date(msg.created_at) > new Date(receiverStats.last_message_date)) {
        receiverStats.last_message_date = msg.created_at
      }
    })

    const users = Array.from(userMap.values()).sort((a: any, b: any) => 
      new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
    )

    return NextResponse.json({ data: users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
