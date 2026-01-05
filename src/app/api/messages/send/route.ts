import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendMessageNotification } from '@/lib/notifications';
import { getPublicUserName } from '@/lib/utils';

interface SendMessageRequest {
  match_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { match_id, sender_id, receiver_id, content } = body;

    // Validasyon
    if (!match_id || !sender_id || !receiver_id || !content) {
      return NextResponse.json(
        { error: 'Eksik bilgi: match_id, sender_id, receiver_id ve content gerekli' },
        { status: 400 }
      );
    }

    // Mesajı veritabanına kaydet
    const { data: message, error: messageError } = await supabase
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
    const { data: sender } = await supabase
      .from('users')
      .select('name, first_name, last_name, display_name')
      .eq('id', sender_id)
      .single();

    const senderName = getPublicUserName(sender) || sender?.name || 'Bir kullanıcı';

    // Push bildirimi gönder
    const notificationSent = await sendMessageNotification(
      receiver_id,
      senderName,
      content,
      match_id
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
