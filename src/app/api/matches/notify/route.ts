import { NextRequest, NextResponse } from 'next/server'
import { extractBearerToken, getSupabaseAdmin } from '@/lib/admin'
import { sendMatchNotification } from '@/lib/notifications'
import { getPublicUserName } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const token = extractBearerToken(req)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !authData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as { match_id?: string }
    const matchId = body.match_id

    if (!matchId) {
      return NextResponse.json({ error: 'match_id gerekli' }, { status: 400 })
    }

    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select(
        `
        id,
        user1_id,
        user2_id,
        user1:users!matches_user1_id_fkey(id, name, first_name, last_name, display_name),
        user2:users!matches_user2_id_fkey(id, name, first_name, last_name, display_name),
        item1:items!matches_item1_id_fkey(id, title),
        item2:items!matches_item2_id_fkey(id, title)
        `
      )
      .eq('id', matchId)
      .single()

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match bulunamadı' }, { status: 404 })
    }

    // Only match participants can trigger notifications
    const requesterId = authData.user.id
    if (requesterId !== match.user1_id && requesterId !== match.user2_id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const user1 = Array.isArray(match.user1) ? match.user1[0] : match.user1
    const user2 = Array.isArray(match.user2) ? match.user2[0] : match.user2
    const item1 = Array.isArray(match.item1) ? match.item1[0] : match.item1
    const item2 = Array.isArray(match.item2) ? match.item2[0] : match.item2

    const user1Name = getPublicUserName(user1) || user1?.name || 'Bir kullanıcı'
    const user2Name = getPublicUserName(user2) || user2?.name || 'Bir kullanıcı'
    const itemName = [item1?.title, item2?.title].filter(Boolean).join(' ↔ ') || 'takas'

    const [sentToUser1, sentToUser2] = await Promise.all([
      sendMatchNotification(match.user1_id, user2Name, itemName, matchId),
      sendMatchNotification(match.user2_id, user1Name, itemName, matchId)
    ])

    return NextResponse.json({
      success: true,
      sent: {
        [match.user1_id]: sentToUser1,
        [match.user2_id]: sentToUser2
      }
    })
  } catch (error) {
    console.error('Match notify error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
