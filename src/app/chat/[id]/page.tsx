'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { getCurrentUser } from '@/lib/auth'
import { getMatchMessages, sendMessage, confirmMatchCompletion, rateUser, hasUserRatedMatch } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { useMessageFilter } from '@/hooks/useMessageFilter'
import { BanStatusBanner } from '@/components/MessageFilterWarning'
import { BlockReportModal, BlockedUserNotice } from '@/components/BlockReportModal'
import { useBlockUser } from '@/hooks/useBlockAndReport'
import { useMarkAsRead } from '@/hooks/useUnreadMessages'
import RatingModal from '@/components/RatingModal'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import LoadingSpinner from '@/components/LoadingSpinner'
import { MessageInput } from '@/components/chat/MessageInput'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { UserInfoSidebar } from '@/components/chat/UserInfoSidebar'
import { ChatHeader } from '@/components/chat/ChatHeader'
import type { ChatMessage, ChatUser, BanDetails, MatchStatusType } from '@/types/chat'
import { MATCH_STATUS, SUBSCRIPTION_CHANNEL_PREFIX, SUBSCRIPTION_EVENTS } from '@/constants/chat'

// Dynamic route - no static generation
export const dynamic = 'force-dynamic'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string
  const { isMobile } = useDeviceType()
  const { t } = useTranslation('messages')
  
  const [user, setUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdsRef = useRef(new Set<string>())
  
  // Profanity filter states
  const { isMessageClean, getWarningMessage } = useMessageFilter()
  const [filterWarning, setFilterWarning] = useState<string | null>(null)
  const [isBanned, setIsBanned] = useState(false)
  const [banDetails, setBanDetails] = useState<BanDetails | null>(null)
  const [isSending, setIsSending] = useState(false)
  
  // Block & Report states
  const [showBlockReportModal, setShowBlockReportModal] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const { isUserBlocked } = useBlockUser()
  const { markMatchAsRead } = useMarkAsRead()
  
  // Memoized computed values
  const messageCount = useMemo(() => messages.length, [messages.length])
  
  // Rating system states
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [matchStatus, setMatchStatus] = useState<MatchStatusType>(MATCH_STATUS.ACTIVE)
  const [userHasRated, setUserHasRated] = useState(false)
  const [isCompletingMatch, setIsCompletingMatch] = useState(false)

  useEffect(() => {
    loadData()
    checkBanStatus()
    loadMatchStatus()
  }, [matchId])

  useEffect(() => {
    if (!matchId) return
    
    const channelName = `${SUBSCRIPTION_CHANNEL_PREFIX}${matchId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: SUBSCRIPTION_EVENTS.INSERT,
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('📨 Yeni mesaj geldi:', payload.new)
          setMessages(prev => {
            // O(1) duplicate check with Set
            if (messageIdsRef.current.has(payload.new.id)) {
              console.log('⚠️ Duplicate mesaj engellendi:', payload.new.id)
              return prev
            }
            messageIdsRef.current.add(payload.new.id)
            return [...prev, payload.new]
          })
          // Scroll removed here - useEffect handles it
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('✏️ Mesaj güncellendi:', payload.new)
          setMessages(prev => 
            prev.map(m => m.id === payload.new.id ? payload.new : m)
          )
        }
      )
      .subscribe((status) => {
        console.log('🔔 Subscription durumu:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time mesajlaşma aktif!')
        }
      })

    return () => {
      console.log('🔌 Subscription kapatılıyor...')
      supabase.removeChannel(channel)
    }
  }, [matchId])

  const scrollToBottom = useCallback((instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'auto' : 'smooth' })
  }, [])

  useEffect(() => {
    // Only scroll if last message is from current user (avoid scroll jumping)
    if (messages.length > 0 && user) {
      const lastMessage = messages[messages.length - 1]
      // Instant scroll for user's own messages
      if (lastMessage.sender_id === user.id) {
        scrollToBottom(true)
      }
    }
  }, [messages.length, user, scrollToBottom])

  const loadMatchStatus = useCallback(async () => {
    if (!matchId || !user) return
    
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('status, user1_confirmed, user2_confirmed, user1_id, user2_id')
        .eq('id', matchId)
        .single()

      if (error) throw error

      if (data.status === 'completed') {
        setMatchStatus('completed')
        // Check if user has rated
        const hasRated = await hasUserRatedMatch(user.id, matchId)
        setUserHasRated(hasRated)
        if (!hasRated) {
          setShowRatingModal(true) // Auto-show rating modal
        }
      } else {
        const userConfirmed = data.user1_id === user.id 
          ? data.user1_confirmed 
          : data.user2_confirmed
        
        const otherConfirmed = data.user1_id === user.id 
          ? data.user2_confirmed 
          : data.user1_confirmed

        if (userConfirmed && otherConfirmed) {
          setMatchStatus('completed')
        } else if (userConfirmed || otherConfirmed) {
          setMatchStatus('pending_completion')
        } else {
          setMatchStatus('active')
        }
      }
    } catch (error) {
      console.error('Error loading match status:', error)
    }
  }, [matchId, user])

  const handleCompleteMatch = useCallback(async () => {
    if (!user) return
    
    setIsCompletingMatch(true)
    try {
      const result = await confirmMatchCompletion(matchId, user.id)
      
      if (result.success) {
        if (result.showRatingModal) {
          setMatchStatus('completed')
          setShowRatingModal(true)
        } else {
          setMatchStatus('pending_completion')
          alert(t('alertMatchPending'))
        }
        loadMatchStatus()
      } else {
        alert(t('errorCompletingMatch'))
      }
    } catch (error) {
      console.error('Error completing match:', error)
      alert(t('errorGeneric') || 'Bir hata oluştu, lütfen tekrar deneyin')
    } finally {
      setIsCompletingMatch(false)
    }
  }, [matchId, user, t, loadMatchStatus])

  const handleSubmitRating = useCallback(async (rating: number, comment?: string) => {
    if (!user || !otherUser) return
    
    try {
      const success = await rateUser({
        raterId: user.id,
        ratedUserId: otherUser.id,
        matchId: matchId,
        rating: rating,
        comment: comment
      })

      if (success) {
        setUserHasRated(true)
        setShowRatingModal(false)
        alert(t('successRatingSubmitted'))
      } else {
        throw new Error('Rating failed')
      }
    } catch (error) {
      console.error('Error rating user:', error)
      alert(t('errorRatingUser'))
      throw error
    }
  }, [user, otherUser, matchId, t])

  const checkBanStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch('/api/messages/filter', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const status = await response.json()
        setIsBanned(status.banned)
        if (status.banned) {
          setBanDetails(status)
        }
      }
    } catch (error) {
      console.error('Ban status check error:', error)
    }
  }, [])

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      // Load match details
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          *,
          user1:users!matches_user1_id_fkey(id, name, email),
          user2:users!matches_user2_id_fkey(id, name, email)
        `)
        .eq('id', matchId)
        .single()

      if (matchData) {
        const other = matchData.user1_id === currentUser.id ? matchData.user2 : matchData.user1
        setOtherUser(other)
        
        // Engelleme kontrolü
        const blocked = await isUserBlocked(currentUser.id, other.id)
        setIsBlocked(blocked)
        
        // Eğer engellenmemişse mesajları okundu olarak işaretle
        if (!blocked) {
          await markMatchAsRead(matchId, currentUser.id)
        }
      }

      // Load messages
      const msgs = await getMatchMessages(matchId)
      setMessages(msgs)
      
      // Initialize message IDs set for duplicate detection
      messageIdsRef.current = new Set(msgs.map(m => m.id))
    } catch (error) {
      console.error('Error loading chat:', error)
    } finally {
      setIsLoading(false)
    }
  }, [matchId, router])

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !user || !otherUser || isSending) return

    // Ban kontrolü
    if (isBanned) {
      setFilterWarning('Mesaj gönderme yetkiniz askıya alındı.')
      return
    }

    const messageText = newMessage.trim()
    
    // 🛡️ FRONTEND KONTROLÜ (hızlı feedback)
    if (!isMessageClean(messageText)) {
      const warningMsg = getWarningMessage(messageText, 0)
      setFilterWarning(warningMsg)
      return
    }

    setIsSending(true)
    setFilterWarning(null)
    setNewMessage('') // Input'u hemen temizle

    // ⚡ OPTIMISTIC UI UPDATE - Mesajı anlık göster
    const tempId = `temp-${Date.now()}`
    const optimisticMessage: ChatMessage = {
      id: tempId,
      match_id: matchId,
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: messageText,
      created_at: new Date().toISOString(),
      read: false
    }

    // Mesajı hemen ekle (kullanıcı anlık görsün)
    setMessages(prev => [...prev, optimisticMessage])
    messageIdsRef.current.add(tempId)

    try {
      // ✅ Mesaj gönder (backend kendi filtreleyecek)
      const sent = await sendMessage(matchId, user.id, otherUser.id, messageText)
      
      if (!sent) {
        // ❌ Hata - optimistic mesajı kaldır ve input'a geri koy
        setMessages(prev => prev.filter(m => m.id !== tempId))
        messageIdsRef.current.delete(tempId)
        setNewMessage(messageText)
        setFilterWarning(t('errorSendingMessage'))
      } else {
        // ✅ Başarılı - Real-time subscription gerçek mesajı ekleyecek
        // Optimistic mesajı kaldır (gerçek mesajla değişecek)
        setMessages(prev => prev.filter(m => m.id !== tempId))
        messageIdsRef.current.delete(tempId)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Optimistic mesajı kaldır
      setMessages(prev => prev.filter(m => m.id !== tempId))
      messageIdsRef.current.delete(tempId)
      setNewMessage(messageText)
      setFilterWarning(t('errorSendingMessage'))
    } finally {
      setIsSending(false)
    }
  }, [newMessage, user, otherUser, isSending, isBanned, matchId, isMessageClean, getWarningMessage])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Desktop Layout
  if (!isMobile) {
    return (
      <DesktopLayout title="Sohbet" maxWidth="7xl">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Chat Area - 3 columns */}
          <div className="col-span-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg flex flex-col overflow-hidden">
            {/* Chat Header */}
            <ChatHeader
              otherUser={otherUser}
              matchStatus={matchStatus}
              userHasRated={userHasRated}
              isCompletingMatch={isCompletingMatch}
              isBlocked={isBlocked}
              onCompleteMatch={handleCompleteMatch}
              onShowBlockReportModal={() => setShowBlockReportModal(true)}
              isMobile={false}
            />

            {/* Ban Banner */}
            {isBanned && banDetails && (
              <BanStatusBanner
                bannedUntil={banDetails.bannedUntil}
                reason={banDetails.reason}
                totalViolations={banDetails.totalViolations}
              />
            )}

            {/* Blocked Notice */}
            {isBlocked && (
              <div className="p-4">
                <BlockedUserNotice userName={otherUser?.name || t('you')} />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <MessageBubble 
                  key={msg.id}
                  content={msg.content}
                  senderId={msg.sender_id}
                  currentUserId={user?.id}
                  createdAt={msg.created_at}
                  read={msg.read}
                  readAt={msg.read_at}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSend={handleSend}
              disabled={isBanned || isSending || isBlocked}
              isSending={isSending}
              filterWarning={filterWarning}
              onClearWarning={() => setFilterWarning(null)}
              isBlocked={isBlocked}
              isBanned={isBanned}
            />
          </div>

          {/* Sidebar - 1 column */}
          <div className="col-span-1">
            <UserInfoSidebar
              otherUser={otherUser}
              matchStatus={matchStatus}
              messageCount={messages.length}
              isBlocked={isBlocked}
              userHasRated={userHasRated}
              isCompletingMatch={isCompletingMatch}
              onCompleteMatch={handleCompleteMatch}
              onShowRatingModal={() => setShowRatingModal(true)}
              onShowBlockReportModal={() => setShowBlockReportModal(true)}
            />
          </div>
        </div>

        {/* Modals */}
        {showBlockReportModal && otherUser && user && (
          <BlockReportModal
            isOpen={showBlockReportModal}
            onClose={() => setShowBlockReportModal(false)}
            targetUserId={otherUser.id}
            targetUserName={otherUser.name}
            currentUserId={user.id}
            onSuccess={() => {
              setIsBlocked(true)
              loadData()
            }}
          />
        )}

        {otherUser && (
          <RatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleSubmitRating}
            otherUserName={otherUser.name}
            otherUserAvatar={otherUser.avatar_url}
          />
        )}
      </DesktopLayout>
    )
  }

  // Mobile Layout
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Ban Banner */}
      {isBanned && banDetails && (
        <BanStatusBanner
          bannedUntil={banDetails.bannedUntil}
          reason={banDetails.reason}
          totalViolations={banDetails.totalViolations}
        />
      )}
      
      {/* Header */}
      <ChatHeader
        otherUser={otherUser}
        matchStatus={matchStatus}
        userHasRated={userHasRated}
        isCompletingMatch={isCompletingMatch}
        isBlocked={isBlocked}
        onCompleteMatch={handleCompleteMatch}
        onShowBlockReportModal={() => setShowBlockReportModal(true)}
        isMobile={true}
      />

      {/* Blocked User Notice */}
      {isBlocked && (
        <div className="p-4">
          <BlockedUserNotice userName={otherUser?.name || t('you')} />
        </div>
      )}

      {/* Block/Report Modal */}
      {showBlockReportModal && otherUser && user && (
        <BlockReportModal
          isOpen={showBlockReportModal}
          onClose={() => setShowBlockReportModal(false)}
          targetUserId={otherUser.id}
          targetUserName={otherUser.name}
          currentUserId={user.id}
          onSuccess={() => {
            setIsBlocked(true)
            loadData()
          }}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id}
            content={msg.content}
            senderId={msg.sender_id}
            currentUserId={user?.id}
            createdAt={msg.created_at}
            read={msg.read}
            readAt={msg.read_at}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pb-safe">
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
          disabled={isBanned || isSending || isBlocked}
          isSending={isSending}
          filterWarning={filterWarning}
          onClearWarning={() => setFilterWarning(null)}
          isBlocked={isBlocked}
          isBanned={isBanned}
        />
      </div>

      {/* Rating Modal */}
      {otherUser && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
          otherUserName={otherUser.name}
          otherUserAvatar={otherUser.avatar_url}
        />
      )}
    </div>
  )
}
