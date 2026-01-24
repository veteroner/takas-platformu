import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/admin'
import { sendMatchNotification } from '@/lib/notifications'
import { getPublicUserName } from '@/lib/utils'

type Body = {
  user_id?: string
  item_id?: string
  direction?: 'left' | 'right' | 'up'
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = (await req.json()) as Body
    const userId = body.user_id
    const itemId = body.item_id
    const direction = body.direction

    if (!userId || !itemId || !direction) {
      return NextResponse.json({ error: 'Eksik bilgi: user_id, item_id, direction gerekli' }, { status: 400 })
    }

    if (userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const action = direction === 'right' ? 'like' : direction === 'up' ? 'super_like' : 'pass'

    // Find item owner (needed to detect match pair)
    const { data: item, error: itemError } = await supabaseAdmin
      .from('items')
      .select('owner_id, title')
      .eq('id', itemId)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item bulunamadı' }, { status: 404 })
    }

    const otherUserId = item.owner_id as string

    // Check if match already existed BEFORE this swipe
    const pairUser1 = userId < otherUserId ? userId : otherUserId
    const pairUser2 = userId < otherUserId ? otherUserId : userId

    const { data: beforeMatch } = await supabaseAdmin
      .from('matches')
      .select('id')
      .eq('user1_id', pairUser1)
      .eq('user2_id', pairUser2)
      .order('created_at', { ascending: false })
      .limit(1)

    const existedBefore = Array.isArray(beforeMatch) && beforeMatch.length > 0

    // Upsert swipe in user_swipes
    // We avoid client-side direct writes so we can reliably trigger push.
    const { data: existingSwipe } = await supabaseAdmin
      .from('user_swipes')
      .select('id, action')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .maybeSingle()

    if (existingSwipe) {
      if (existingSwipe.action !== action) {
        const { error: updErr } = await supabaseAdmin
          .from('user_swipes')
          .update({ action })
          .eq('id', existingSwipe.id)
        if (updErr) return NextResponse.json({ error: 'Swipe güncellenemedi' }, { status: 500 })
      }
    } else {
      const { error: insErr } = await supabaseAdmin
        .from('user_swipes')
        .insert([{ user_id: userId, item_id: itemId, action }])
      if (insErr) return NextResponse.json({ error: 'Swipe kaydedilemedi' }, { status: 500 })
    }

    // If this was a like, the DB trigger may have created a match. Check AFTER.
    let matchCreated = false
    let matchId: string | null = null

    if (action === 'like') {
      const { data: afterMatch } = await supabaseAdmin
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
        .eq('user1_id', pairUser1)
        .eq('user2_id', pairUser2)
        .order('created_at', { ascending: false })
        .limit(1)

      const matchRow = Array.isArray(afterMatch) ? afterMatch[0] : null

      if (!existedBefore && matchRow?.id) {
        matchCreated = true
        matchId = matchRow.id

        const u1 = Array.isArray(matchRow.user1) ? matchRow.user1[0] : matchRow.user1
        const u2 = Array.isArray(matchRow.user2) ? matchRow.user2[0] : matchRow.user2
        const it1 = Array.isArray(matchRow.item1) ? matchRow.item1[0] : matchRow.item1
        const it2 = Array.isArray(matchRow.item2) ? matchRow.item2[0] : matchRow.item2

        const user1Name = getPublicUserName(u1) || u1?.name || 'Bir kullanıcı'
        const user2Name = getPublicUserName(u2) || u2?.name || 'Bir kullanıcı'
        const itemName = [it1?.title, it2?.title].filter(Boolean).join(' ↔ ') || 'takas'

        // Send push to BOTH users automatically
        await Promise.all([
          sendMatchNotification(matchRow.user1_id, user2Name, itemName, matchId || undefined),
          sendMatchNotification(matchRow.user2_id, user1Name, itemName, matchId || undefined)
        ])
      }
    }

    return NextResponse.json({
      success: true,
      recorded: true,
      matchCreated,
      matchId
    })
  } catch (error) {
    console.error('Swipe API error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
