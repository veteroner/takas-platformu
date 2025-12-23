/**
 * Admin Moderasyon API - Ürün Şikayetlerini Yönetme
 * GET: Tüm product_reports listesini al (products ve users join'li)
 * PATCH: Şikayeti reddet veya ürünü manuel kaldır
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

    // product_reports + products + users (reporter) bilgilerini al
    const { data: reports, error } = await supabase
      .from('product_reports')
      .select(`
        *,
        product:products (
          title,
          description,
          status,
          image_url
        ),
        reporter:users (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch product reports:', error)
      return NextResponse.json(
        { error: 'Ürün şikayetleri alınamadı' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('GET /api/admin/moderation/reports error:', error)
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
    const { reportId, productId, action } = body

    if (!reportId || !action) {
      return NextResponse.json(
        { error: 'reportId ve action gereklidir' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (action === 'dismiss') {
      // Şikayeti reddet
      const { error } = await supabase
        .from('product_reports')
        .update({ status: 'dismissed' })
        .eq('id', reportId)

      if (error) {
        console.error('Failed to dismiss report:', error)
        return NextResponse.json(
          { error: 'Şikayet reddedilemedi' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, message: 'Şikayet reddedildi' })
    } else if (action === 'remove' && productId) {
      // Ürünü manuel olarak kaldır
      
      // 1. Ürünü removed yap
      const { error: productError } = await supabase
        .from('products')
        .update({
          status: 'removed',
          removed_at: new Date().toISOString(),
          removal_reason: 'admin_action'
        })
        .eq('id', productId)

      if (productError) {
        console.error('Failed to remove product:', productError)
        return NextResponse.json(
          { error: 'Ürün kaldırılamadı' },
          { status: 500 }
        )
      }

      // 2. Bu ürün için tüm pending raporları auto_removed yap
      const { error: reportsError } = await supabase
        .from('product_reports')
        .update({
          status: 'auto_removed',
          auto_removed_at: new Date().toISOString()
        })
        .eq('product_id', productId)
        .eq('status', 'pending')

      if (reportsError) {
        console.error('Failed to update reports:', reportsError)
        // Devam et, kritik değil
      }

      // 3. removed_products_log'a ekle
      const { data: product } = await supabase
        .from('products')
        .select('*, user_id')
        .eq('id', productId)
        .single()

      if (product) {
        const { error: logError } = await supabase
          .from('removed_products_log')
          .insert({
            product_id: productId,
            product_owner_id: product.user_id,
            removal_reason: 'admin_action',
            report_count: 0,
            product_data: product
          })

        if (logError) {
          console.error('Failed to log removal:', logError)
          // Devam et, kritik değil
        }
      }

      return NextResponse.json({ success: true, message: 'Ürün kaldırıldı' })
    } else {
      return NextResponse.json(
        { error: 'Geçersiz action değeri' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('PATCH /api/admin/moderation/reports error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
