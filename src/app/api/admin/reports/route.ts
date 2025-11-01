import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, verifyAdminRequest } from '@/lib/admin'

export async function PATCH(req: NextRequest) {
  try {
    const verified = await verifyAdminRequest(req)
    if (!verified) {
      return NextResponse.json({ error: 'Yetkisiz istek' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Sunucu yapılandırması eksik (SUPABASE_SERVICE_ROLE_KEY)'
      }, { status: 500 })
    }

    const body = await req.json().catch(() => null as any)
    const id = body?.id as string | number | undefined
    const update = body?.update as Record<string, any> | undefined

    if (!id || !update || typeof update !== 'object') {
      return NextResponse.json({ error: 'Geçersiz istek gövdesi' }, { status: 400 })
    }

    // Attach audit fields
    const now = new Date().toISOString()
    const enriched = {
      ...update,
      updated_at: update.updated_at ?? now,
      resolved_by: update.status && ['resolved', 'rejected', 'in_review'].includes(update.status)
        ? verified.user.id
        : update.resolved_by,
      resolved_at: update.status && ['resolved', 'rejected'].includes(update.status)
        ? now
        : update.resolved_at
    }

    const { data, error } = await supabaseAdmin
      .from('user_reports')
      .update(enriched)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, report: data }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Bilinmeyen hata' }, { status: 500 })
  }
}
