import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mesajları getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const matchId = searchParams.get('match_id');
    const userId = searchParams.get('user_id');

    if (!matchId) {
      return NextResponse.json(
        { error: 'match_id parametresi gerekli' },
        { status: 400 }
      );
    }

    // Mesajları çek
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, name, avatar)
      `)
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Messages fetch error:', error);
      return NextResponse.json(
        { error: 'Mesajlar getirilemedi' },
        { status: 500 }
      );
    }

    // Eğer user_id verilmişse, okunmamış mesajları okundu olarak işaretle
    if (userId) {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .eq('receiver_id', userId)
        .eq('read', false);
    }

    return NextResponse.json({
      success: true,
      messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
