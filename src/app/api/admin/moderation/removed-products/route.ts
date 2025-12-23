/**
 * Admin Moderasyon API - Kaldırılan Ürünler
 * GET: removed_products_log listesini al (owner bilgisi ile)
 * PATCH: Ürünü geri yükle (restore)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminRequest } from '@/lib/admin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const verified = await verifyAdminRequest(req)
    if (!verified) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    if (verified.requires2FA) {
      return NextResponse.json(
        { error: '2FA gerekli', requires2FA: true },
        { status: 403 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // removed_products_log + owner bilgilerini al
    const { data: products, error } = await supabase
      .from('removed_products_log')
      .select(`
        *,
        owner:users (
          full_name,
          email
        )
      `)
      .order('removed_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch removed products:', error)
      return NextResponse.json(
        { error: 'Kaldırılan ürünler alınamadı' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('GET /api/admin/moderation/removed-products error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Admin yetkisi kontrolü
    const verified = await verifyAdminRequest(req)
    if (!verified) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    if (verified.requires2FA) {
      return NextResponse.json(
        { error: '2FA gerekli', requires2FA: true },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { logId, productId, action, reason } = body

    if (!logId || !productId || action !== 'restore') {
      return NextResponse.json(
        { error: 'logId, productId ve action=restore gereklidir' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Ürünü tekrar aktif yap
    const { error: productError } = await supabase
      .from('products')
      .update({
        status: 'active',
        removed_at: null,
        removal_reason: null
      })
      .eq('id', productId)

    if (productError) {
      console.error('Failed to restore product:', productError)
      return NextResponse.json(
        { error: 'Ürün geri yüklenemedi' },
        { status: 500 }
      )
    }

    // 2. Log kaydını güncelle
    const { error: logError } = await supabase
      .from('removed_products_log')
      .update({
        restored_at: new Date().toISOString(),
        restoration_reason: reason || 'Admin tarafından geri yüklendi'
      })
      .eq('id', logId)

    if (logError) {
      console.error('Failed to update log:', logError)
      // Devam et, kritik değil
    }

    // 3. İlgili raporları dismissed yap (varsa)
    const { error: reportsError } = await supabase
      .from('product_reports')
      .update({ status: 'dismissed' })
      .eq('product_id', productId)
      .in('status', ['pending', 'auto_removed'])

    if (reportsError) {
      console.error('Failed to update reports:', reportsError)
      // Devam et, kritik değil
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ürün başarıyla geri yüklendi' 
    })
  } catch (error) {
    console.error('PATCH /api/admin/moderation/removed-products error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
