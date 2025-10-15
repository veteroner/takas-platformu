/**
 * Message Filtering API Route
 * 
 * Bu endpoint mesaj göndermeden önce içeriği kontrol eder.
 * Uygunsuz içerik tespit edilirse engeller ve veritabanına kaydeder.
 * 
 * KVKK Uyumlu: Tüm işlemler loglanır ve 6 ay saklanır.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { filterMessage, detectProfanity } from '@/lib/profanity-filter'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Service role client for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user with auth header
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Request body
    const body = await request.json()
    const { message, matchId, receiverId } = body

    if (!message || !matchId || !receiverId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Kullanıcının ban durumunu kontrol et
    const { data: banStatus } = await supabaseAdmin
      .rpc('is_user_chat_banned', { check_user_id: user.id })
    
    if (banStatus) {
      // Ban detaylarını al
      const { data: banDetails } = await supabaseAdmin
        .from('user_chat_bans')
        .select('banned_until, reason')
        .eq('user_id', user.id)
        .single()
      
      return NextResponse.json(
        {
          allowed: false,
          banned: true,
          bannedUntil: banDetails?.banned_until,
          reason: banDetails?.reason || 'Tekrarlanan ihlaller nedeniyle mesaj gönderemezsiniz.'
        },
        { status: 403 }
      )
    }

    // Önceki ihlal sayısını al (son 30 gün)
    const { data: violationCount } = await supabaseAdmin
      .rpc('get_user_violation_count', { check_user_id: user.id })
    
    const previousViolations = violationCount || 0

    // Mesajı filtrele
    const filterResult = await filterMessage(
      user.id,
      message,
      previousViolations
    )

    // Mesaj temizse, gönderilmesine izin ver
    if (filterResult.allowed) {
      return NextResponse.json({
        allowed: true,
        message: 'Message is clean'
      })
    }

    // Mesaj uygunsuz - Detayları al
    const profanityResult = detectProfanity(message)
    
    // Violation kaydı oluştur
    const { error: violationError } = await supabaseAdmin
      .rpc('record_violation', {
        p_user_id: user.id,
        p_violation_type: profanityResult.violationType || 'severe',
        p_severity: profanityResult.severity,
        p_content: message.substring(0, 500), // İlk 500 karakter
        p_detected_words: profanityResult.detectedWords,
        p_action_taken: filterResult.banUntil ? 'ban' : 'warning',
        p_ban_until: filterResult.banUntil || null,
        p_context: {
          match_id: matchId,
          receiver_id: receiverId,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent')
        }
      })

    if (violationError) {
      console.error('Error recording violation:', violationError)
    }

    // Filtered message log (KVKK uyumlu)
    await supabaseAdmin
      .from('filtered_messages')
      .insert({
        user_id: user.id,
        match_id: matchId,
        original_content: message.substring(0, 500),
        detected_words: profanityResult.detectedWords,
        severity: profanityResult.severity,
        blocked: true
      })

    // Response
    return NextResponse.json({
      allowed: false,
      reason: filterResult.reason,
      severity: profanityResult.severity,
      violationLevel: filterResult.violationLevel,
      bannedUntil: filterResult.banUntil,
      message: filterResult.reason
    }, { status: 403 })

  } catch (error) {
    console.error('Filter message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint - Kullanıcının ban durumunu kontrol et
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ban durumunu kontrol et
    const { data: isBanned } = await supabaseAdmin
      .rpc('is_user_chat_banned', { check_user_id: user.id })
    
    if (!isBanned) {
      return NextResponse.json({
        banned: false,
        canSendMessages: true
      })
    }

    // Ban detaylarını al
    const { data: banDetails } = await supabaseAdmin
      .from('user_chat_bans')
      .select('banned_until, reason, total_violations, ban_count')
      .eq('user_id', user.id)
      .single()
    
    return NextResponse.json({
      banned: true,
      canSendMessages: false,
      bannedUntil: banDetails?.banned_until,
      reason: banDetails?.reason,
      totalViolations: banDetails?.total_violations,
      banCount: banDetails?.ban_count
    })

  } catch (error) {
    console.error('Check ban status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
