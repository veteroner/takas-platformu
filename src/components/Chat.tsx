'use client'

import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Message } from "@/lib/supabase";

interface ChatProps {
  matchId?: string;
  userId?: string;
  otherUserId?: string;
  otherUserName?: string;
}

export default function Chat({ 
  matchId = "demo-match-123", 
  userId = "current-user-123",
  otherUserId = "other-user-123",
  otherUserName = "Ali Yılmaz"
}: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mesajları yükle
  useEffect(() => {
    loadMessages();
    
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, userId, otherUserName]);

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center gap-3">
        <Link href="/" className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h3 className="font-semibold">{otherUserName}</h3>
          <p className="text-sm opacity-90">Aktif</p>
        </div>
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
    </div>
  );
}
