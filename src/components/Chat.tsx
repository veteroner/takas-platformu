'use client'

import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/lib/supabase";
import RatingModal from "./RatingModal";
import { confirmMatchCompletion, rateUser, hasUserRatedMatch } from "@/lib/api";

interface ChatProps {
  matchId?: string;
  userId?: string;
  otherUserId?: string;
  otherUserName?: string;
  otherUserAvatar?: string;
}

export default function Chat({ 
  matchId = "demo-match-123", 
  userId = "current-user-123",
  otherUserId = "other-user-123",
  otherUserName = "Ali Yılmaz",
  otherUserAvatar
}: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [matchStatus, setMatchStatus] = useState<'active' | 'pending_completion' | 'completed'>('active');
  const [userHasRated, setUserHasRated] = useState(false);
  const [isCompletingMatch, setIsCompletingMatch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mesajları ve match durumunu yükle
  useEffect(() => {
    loadMessages();
    loadMatchStatus();
    
    // Realtime mesajları dinle
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('Yeni mesaj geldi:', payload);
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, {
            id: newMessage.id,
            sender: newMessage.sender_id === userId ? "Sen" : otherUserName,
            text: newMessage.content,
            timestamp: new Date(newMessage.created_at).toLocaleTimeString('tr-TR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isOwn: newMessage.sender_id === userId
          }]);
        }
      )
      .subscribe();

    // Match durumu değişikliklerini dinle
    const matchChannel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          console.log('Match durumu güncellendi:', payload);
          loadMatchStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(matchChannel);
    };
  }, [matchId, userId, otherUserName]);

  // Match durumunu yükle
  const loadMatchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('status, user1_confirmed, user2_confirmed, user1_id, user2_id')
        .eq('id', matchId)
        .single();

      if (error) throw error;

      if (data.status === 'completed') {
        setMatchStatus('completed');
        // Kullanıcı puanlama yaptı mı kontrol et
        const hasRated = await hasUserRatedMatch(userId, matchId);
        setUserHasRated(hasRated);
        if (!hasRated) {
          setShowRatingModal(true); // Otomatik olarak rating modal'ı aç
        }
      } else {
        // Kullanıcının onay durumunu kontrol et
        const userConfirmed = data.user1_id === userId 
          ? data.user1_confirmed 
          : data.user2_confirmed;
        
        const otherConfirmed = data.user1_id === userId 
          ? data.user2_confirmed 
          : data.user1_confirmed;

        if (userConfirmed && otherConfirmed) {
          setMatchStatus('completed');
        } else if (userConfirmed || otherConfirmed) {
          setMatchStatus('pending_completion');
        } else {
          setMatchStatus('active');
        }
      }
    } catch (error) {
      console.error('Match durumu yüklenemedi:', error);
    }
  };

  // Mesajları scroll et
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/messages?match_id=${matchId}&user_id=${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg: Message) => ({
          id: msg.id,
          sender: msg.sender_id === userId ? "Sen" : otherUserName,
          text: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isOwn: msg.sender_id === userId
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim() && !sending) {
      setSending(true);
      const messageText = input.trim();
      setInput(""); // Hemen temizle

      try {
        // API'ye mesaj gönder - bildirim otomatik olarak gönderilecek
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            match_id: matchId,
            sender_id: userId,
            receiver_id: otherUserId,
            content: messageText
          })
        });

        if (!response.ok) {
          throw new Error('Mesaj gönderilemedi');
        }

        const data = await response.json();
        console.log('Mesaj gönderildi, bildirim tetiklendi:', data);

      } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
        setInput(messageText); // Hata durumunda geri yükle
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Takası tamamla butonu
  const handleCompleteMatch = async () => {
    setIsCompletingMatch(true);
    try {
      const result = await confirmMatchCompletion(matchId, userId);
      
      if (result.success) {
        if (result.showRatingModal) {
          // Her iki taraf da onayladı - rating modal aç
          setMatchStatus('completed');
          setShowRatingModal(true);
        } else {
          // Sadece bu kullanıcı onayladı - diğerini bekle
          setMatchStatus('pending_completion');
          alert(result.message);
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Takas tamamlama hatası:', error);
      alert('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setIsCompletingMatch(false);
    }
  };

  // Puanlama submit
  const handleSubmitRating = async (rating: number, comment?: string) => {
    try {
      const success = await rateUser({
        raterId: userId,
        ratedUserId: otherUserId,
        matchId: matchId,
        rating: rating,
        comment: comment
      });

      if (success) {
        setUserHasRated(true);
        setShowRatingModal(false);
        alert('Teşekkürler! Puanınız kaydedildi. 🌟');
      } else {
        throw new Error('Rating failed');
      }
    } catch (error) {
      console.error('Puanlama hatası:', error);
      throw error; // RatingModal'a hata fırlatmak için
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h3 className="font-semibold">{otherUserName}</h3>
            <p className="text-sm opacity-90">
              {matchStatus === 'completed' ? 'Takas Tamamlandı ✅' : 'Aktif'}
            </p>
          </div>
        </div>

        {/* Takası Tamamla Butonu */}
        {matchStatus === 'active' && (
          <button
            onClick={handleCompleteMatch}
            disabled={isCompletingMatch}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2.5 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCompletingMatch ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Takası Tamamla
              </>
            )}
          </button>
        )}

        {matchStatus === 'pending_completion' && (
          <div className="w-full bg-yellow-500/20 backdrop-blur-sm py-2.5 px-4 rounded-xl text-sm text-center">
            ⏳ Diğer tarafın onayı bekleniyor...
          </div>
        )}

        {matchStatus === 'completed' && !userHasRated && (
          <div className="w-full bg-green-500/20 backdrop-blur-sm py-2.5 px-4 rounded-xl text-sm text-center">
            ✅ Takas tamamlandı! Lütfen puanlayın.
          </div>
        )}

        {matchStatus === 'completed' && userHasRated && (
          <div className="w-full bg-green-500/20 backdrop-blur-sm py-2.5 px-4 rounded-xl text-sm text-center">
            🌟 Takas tamamlandı ve puanlandı!
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Henüz mesaj yok. İlk mesajı sen gönder! 💬</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.isOwn 
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-2 items-end">
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesaj yaz..."
            disabled={sending}
          />
          <button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50"
            onClick={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        otherUserName={otherUserName}
        otherUserAvatar={otherUserAvatar}
      />
    </div>
  );
}
