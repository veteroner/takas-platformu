'use client'

import React, { useEffect, useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { getUserMatches } from "@/lib/api";
import { useRouter } from "next/navigation";
import { MatchUnreadBadge } from "@/components/UnreadBadge";
import { supabase } from "@/lib/supabase";

export default function ChatList() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // 🔔 Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return;

    console.log('🔔 ChatList: Real-time mesaj dinleme başlatıldı');

    const channel = supabase
      .channel(`chat-list-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('📨 ChatList: Yeni mesaj geldi, liste güncelleniyor...', payload);
          // Yeni mesaj geldiğinde listeyi yeniden yükle
          loadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user1_id=eq.${user.id},user2_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🎉 ChatList: Yeni eşleşme, liste güncelleniyor...', payload);
          // Yeni eşleşme geldiğinde listeyi yeniden yükle
          loadData();
        }
      )
      .subscribe((status) => {
        console.log('🔔 ChatList subscription durumu:', status);
      });

    return () => {
      console.log('🔌 ChatList subscription kapatılıyor...');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);

      // Load user's matches
      const userMatches = await getUserMatches(currentUser.id);
      
      // Son mesaj zamanına göre sırala (en yeni üstte)
      const sortedMatches = userMatches.sort((a, b) => {
        const dateA = a.messages?.[0]?.created_at || a.created_at;
        const dateB = b.messages?.[0]?.created_at || b.created_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      setMatches(sortedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
          <div className="px-4 py-4 pt-12 md:pt-4 flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Mesajlar
            </h1>
          </div>
        </header>

        {/* Chat List */}
        <div className="p-4">
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match) => {
                // Get the other user
                const otherUser = match.user1_id === user?.id ? match.user2 : match.user1;
                const myItem = match.user1_id === user?.id ? match.item1 : match.item2;
                const theirItem = match.user1_id === user?.id ? match.item2 : match.item1;
                
                // Son mesajı al
                const lastMessage = match.messages?.[0];
                const lastMessageText = lastMessage?.content || 'Henüz mesaj yok';
                const lastMessageTime = lastMessage?.created_at || match.created_at;
                const isMyMessage = lastMessage?.sender_id === user?.id;

                return (
                  <Link
                    key={match.id}
                    href={`/chat/${match.id}`}
                    className="block bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {otherUser?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        {/* Okunmamış mesaj badge'i */}
                        <MatchUnreadBadge
                          matchId={match.id}
                          userId={user?.id || null}
                          className="absolute -top-1 -right-1"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{otherUser?.name || 'Kullanıcı'}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(lastMessageTime).toLocaleDateString('tr-TR', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        
                        {/* Son mesaj preview */}
                        <p className="text-sm text-gray-600 truncate">
                          {isMyMessage && <span className="text-gray-500">Sen: </span>}
                          {lastMessageText}
                        </p>
                        
                        {/* Takas ürünleri */}
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {myItem?.title} ⇄ {theirItem?.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz eşleşme yok</h3>
              <p className="text-gray-500">
                Takas yapmaya başla ve ilk eşleşmeni al!
              </p>
              <Link
                href="/"
                className="inline-block mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Keşfetmeye Başla
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
