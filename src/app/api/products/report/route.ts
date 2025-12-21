/**
 * Apple Moderasyon Sistemi - Ürün Raporlama API
 * Endpoint: /api/products/report
 * Methods: POST (şikayet gönder), GET (şikayetleri listele)
 */

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const VALID_REPORT_TYPES = [
  'inappropriate_content',
  'illegal_item',
  'scam',
  'fake_item',
  'spam',
  'other'
] as const;

type ReportType = typeof VALID_REPORT_TYPES[number];

interface ReportRequest {
  productId: string;
  reportType: ReportType;
  description?: string;
}

/**
 * POST /api/products/report
 * Yeni ürün şikayeti oluşturur
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Kullanıcı kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const body: ReportRequest = await request.json();
    const { productId, reportType, description } = body;

    // Validasyon
    if (!productId || !reportType) {
      return NextResponse.json(
        { error: 'Ürün ID ve şikayet türü gereklidir' },
        { status: 400 }
      );
    }

    if (!VALID_REPORT_TYPES.includes(reportType)) {
      return NextResponse.json(
        { error: 'Geçersiz şikayet türü' },
        { status: 400 }
      );
    }

    // Ürünün var olduğunu ve aktif olduğunu kontrol et
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, user_id, title, status')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    // Zaten kaldırılmış ürünü şikayet edemez
    if (product.status === 'removed') {
      return NextResponse.json(
        { error: 'Bu ürün zaten kaldırılmış' },
        { status: 400 }
      );
    }

    // Kendi ürününü şikayet edemez
    if (product.user_id === user.id) {
      return NextResponse.json(
        { error: 'Kendi ürününüzü şikayet edemezsiniz' },
        { status: 400 }
      );
    }

    // Şikayeti kaydet
    const { data: report, error: reportError } = await supabase
      .from('product_reports')
      .insert({
        product_id: productId,
        reporter_id: user.id,
        report_type: reportType,
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (reportError) {
      // Unique constraint violation (aynı kullanıcı aynı ürünü 2. kez şikayet ediyor)
      if (reportError.code === '23505') {
        return NextResponse.json(
          { error: 'Bu ürünü zaten şikayet ettiniz' },
          { status: 400 }
        );
      }
      
      console.error('Report insert error:', reportError);
      throw reportError;
    }

    // Trigger otomatik çalışacak ve threshold kontrolü yapacak
    // 3+ şikayet varsa ürün otomatik kaldırılacak

    return NextResponse.json({
      success: true,
      message: 'Şikayetiniz alındı. İnceleme yapılacaktır.',
      reportId: report.id,
    });

  } catch (error) {
    console.error('Product report error:', error);
    return NextResponse.json(
      { error: 'Şikayet gönderilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/report?productId=xxx
 * Kullanıcının yaptığı şikayetleri listeler
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    let query = supabase
      .from('product_reports')
      .select(`
        id,
        report_type,
        description,
        status,
        created_at,
        products:product_id (
          id,
          title,
          status
        )
      `)
      .eq('reporter_id', user.id)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data: reports, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      reports: reports || [],
    });

  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Şikayetler alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}
