'use client'

import React, { useEffect, useState, useCallback } from "react";
import { MessageCircle, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

import { getCurrentUser } from "@/lib/auth";
import { getUserMatches } from "@/lib/api";
import { useRouter } from "next/navigation";
import { MatchUnreadBadge } from "@/components/UnreadBadge";
import { supabase } from "@/lib/supabase";
import DesktopLayout from "@/components/DesktopLayout";
import { useDeviceType } from "@/hooks/useDeviceType";

// Match tipi tanımı
interface MatchUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface MatchItem {
  id: string;
  title: string;
  images?: string[];
}

interface MatchMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  user1?: MatchUser;
  user2?: MatchUser;
  item1?: MatchItem;
  item2?: MatchItem;
  messages?: MatchMessage[];
  created_at: string;
}

export default function ChatList() {
  const { t } = useTranslation('messages');
  const router = useRouter();
  const { isMobile, isDesktop } = useDeviceType();
  const [user, setUser] = useState<{id: string; name: string; email: string; avatar?: string} | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
  }, [user?.id, loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Arama filtresi
  const filteredMatches = matches.filter((match) => {
    if (!searchQuery) return true;
    const otherUser = match.user1_id === user?.id ? match.user2 : match.user1;
    const myItem = match.user1_id === user?.id ? match.item1 : match.item2;
    const theirItem = match.user1_id === user?.id ? match.item2 : match.item1;
    const searchLower = searchQuery.toLowerCase();
    return (
      otherUser?.name?.toLowerCase().includes(searchLower) ||
      myItem?.title?.toLowerCase().includes(searchLower) ||
      theirItem?.title?.toLowerCase().includes(searchLower)
    );
  });

  // Chat item component - tekrar kullanım için
  const ChatItem = ({ match }: { match: Match }) => {
    const otherUser = match.user1_id === user?.id ? match.user2 : match.user1;
    const myItem = match.user1_id === user?.id ? match.item1 : match.item2;
    const theirItem = match.user1_id === user?.id ? match.item2 : match.item1;
    const lastMessage = match.messages?.[0];
    const lastMessageText = lastMessage?.content || t('noMessages');
    const lastMessageTime = lastMessage?.created_at || match.created_at;
    const isMyMessage = lastMessage?.sender_id === user?.id;

    return (
      <Link
        href={`/chat/${match.id}`}
        className="block bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/90 hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {otherUser?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <MatchUnreadBadge
              matchId={match.id}
              userId={user?.id || null}
              className="absolute -top-1 -right-1"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{otherUser?.name || 'Kullanıcı'}</h3>
              <span className="text-xs text-gray-500 shrink-0">
                {new Date(lastMessageTime).toLocaleDateString('tr-TR', { 
                  day: 'numeric', 
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 truncate">
              {isMyMessage && <span className="text-gray-500">{t('you')}: </span>}
              {lastMessageText}
            </p>
            
            <p className="text-xs text-gray-400 truncate mt-1">
              {myItem?.title} ⇄ {theirItem?.title}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  // Desktop görünüm
  if (!isMobile) {
    return (
      <DesktopLayout title={t('title')} maxWidth="4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol panel - Chat listesi */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchMessages')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              {filteredMatches.length > 0 ? (
                <div className="p-2 space-y-2">
                  {filteredMatches.map((match) => (
                    <ChatItem key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? t('noResults') : t('noMessages')}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sağ panel - Hoş geldin mesajı */}
          <div className="hidden lg:flex lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-linear-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('title')}</h2>
              <p className="text-gray-500 max-w-sm">
                {t('welcomeMessage')}
              </p>
              <Link
                href="/feed"
                className="inline-block mt-6 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                {t('discoverButton')}
              </Link>
            </div>
          </div>
        </div>
      </DesktopLayout>
    );
  }

  // Mobil görünüm (mevcut tasarım)

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
          <div className="px-4 py-4 pt-12 md:pt-4 flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
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
                const lastMessageText = lastMessage?.content || t('noMessages');
                const lastMessageTime = lastMessage?.created_at || match.created_at;
                const isMyMessage = lastMessage?.sender_id === user?.id;

                return (
                  <Link
                    key={match.id}
                    href={`/chat/${match.id}`}
                    className="block bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-linear-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
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
                          <span className="text-xs text-gray-500 shrink-0">
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
                          {isMyMessage && <span className="text-gray-500">{t('you')}: </span>}
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
              <h3 className="text-lg font-semibold text-gray-600 mb-2">{t('noMatchesYet')}</h3>
              <p className="text-gray-500">
                {t('startTrading')}
              </p>
              <Link
                href="/"
                className="inline-block mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                {t('startExploring')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
