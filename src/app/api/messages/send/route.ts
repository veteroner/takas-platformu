import { NextRequest, NextResponse } from 'next/server';
import { sendMessageNotification } from '@/lib/notifications';
import { getPublicUserName } from '@/lib/utils';
import { getSupabaseAdmin } from '@/lib/admin';

interface SendMessageRequest {
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    // Auth required (server-side verify)
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SendMessageRequest = await request.json();
    const { match_id, sender_id, receiver_id, content } = body;

    // Validasyon
    if (!match_id || !sender_id || !receiver_id || !content) {
      return NextResponse.json(
        { error: 'Eksik bilgi: match_id, sender_id, receiver_id ve content gerekli' },
        { status: 400 }
      );
    }

    // Ensure sender matches authenticated user
    if (sender_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Mesajı veritabanına kaydet
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert({
        match_id,
        sender_id,
        receiver_id,
        content,
        read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (messageError) {
      console.error('Message save error:', messageError);
      return NextResponse.json(
        { error: 'Mesaj kaydedilemedi' },
        { status: 500 }
      );
    }

    // Gönderen kullanıcının bilgilerini al
    const { data: sender } = await supabaseAdmin
      .from('users')
      .select('name, first_name, last_name, display_name')
      .eq('id', sender_id)
      .single();

    const senderName = getPublicUserName(sender) || sender?.name || 'Bir kullanıcı';

    // iOS badge: set to current unread count for receiver
    let iosBadgeCount: number | undefined
    try {
      const { data: unreadCount } = await supabaseAdmin.rpc('get_unread_message_count', {
        p_user_id: receiver_id
      })
      if (typeof unreadCount === 'number') {
        iosBadgeCount = unreadCount
      }
    } catch {
      // ignore badge count errors
    }

    // Push bildirimi gönder
    const notificationSent = await sendMessageNotification(
      receiver_id,
      sender_id,
      senderName,
      content,
      match_id,
      iosBadgeCount
    );

    console.log(`📱 Bildirim durumu: ${notificationSent ? 'Başarılı ✅' : 'Başarısız ❌'}`);

    return NextResponse.json({
      success: true,
      message,
      notification_sent: notificationSent
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
