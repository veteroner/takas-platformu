/**
 * API Endpoint: Ürün Filtreleme
 * 
 * POST /api/products/filter - Ürün yasadışı içerik kontrolü
 * GET /api/products/filter - İstatistikler (admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { detectIllegalProduct } from '@/lib/illegal-product-filter'
import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

/**
 * POST: Ürün içeriğini kontrol et
 */
export async function POST(req: NextRequest) {
  try {
    const { title, description, userId } = await req.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Ürün başlığı gereklidir' },
        { status: 400 }
      )
    }

    // Yasadışı içerik kontrolü
    const result = detectIllegalProduct(title, description)

    // Eğer yasadışı içerik tespit edildiyse loga kaydet
    if (!result.isClean && result.shouldBlock) {
      try {
        // Supabase'e log kaydet (opsiyonel - tablo oluşturmanız gerekir)
        await supabase.from('illegal_product_attempts').insert({
          user_id: userId || 'anonymous',
          title: title.substring(0, 200),
          description: description?.substring(0, 500),
          detected_words: result.detectedWords,
          categories: result.categories,
          risk_level: result.riskLevel,
          created_at: new Date().toISOString()
        })
      } catch (logError) {
        // Log hatasını sessizce görmezden gel
        console.error('Failed to log illegal attempt:', logError)
      }
    }

    return NextResponse.json({
      allowed: result.isClean,
      shouldBlock: result.shouldBlock,
      riskLevel: result.riskLevel,
      message: result.message,
      categories: result.categories,
      detectedWords: result.detectedWords
    })
  } catch (error: any) {
    console.error('Product filter error:', error)
    return NextResponse.json(
      { error: 'İçerik kontrolü başarısız oldu' },
      { status: 500 }
    )
  }
}

/**
 * GET: İstatistikleri getir (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const verified = await verifyAdminRequest(req)
    if (!verified) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (verified.requires2FA) return NextResponse.json({ error: '2FA required', requires2FA: true }, { status: 403 })

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    
    const { data, error } = await supabaseAdmin
      .from('illegal_product_attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      attempts: data || [],
      total: data?.length || 0
    })
  } catch (error: any) {
    console.error('Failed to fetch statistics:', error)
    return NextResponse.json(
      { error: 'İstatistikler alınamadı' },
      { status: 500 }
    )
  }
}
