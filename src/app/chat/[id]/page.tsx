'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, MoreVertical, CheckCircle, MessageCircle, Package, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { getMatchMessages, sendMessage, confirmMatchCompletion, rateUser, hasUserRatedMatch } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { useMessageFilter } from '@/hooks/useMessageFilter'
import { MessageFilterWarning, BanStatusBanner } from '@/components/MessageFilterWarning'
import { BlockReportModal, BlockedUserNotice } from '@/components/BlockReportModal'
import { useBlockUser } from '@/hooks/useBlockAndReport'
import { useMarkAsRead } from '@/hooks/useUnreadMessages'
import RatingModal from '@/components/RatingModal'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'

// Dynamic route - no static generation
export const dynamic = 'force-dynamic'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string
  const { isMobile } = useDeviceType()
  
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Profanity filter states
  const { isMessageClean, getWarningMessage } = useMessageFilter()
  const [filterWarning, setFilterWarning] = useState<string | null>(null)
  const [isBanned, setIsBanned] = useState(false)
  const [banDetails, setBanDetails] = useState<any>(null)
  const [isSending, setIsSending] = useState(false)
  
  // Block & Report states
  const [showBlockReportModal, setShowBlockReportModal] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const { isUserBlocked } = useBlockUser()
  const { markMatchAsRead } = useMarkAsRead()
  
  // Rating system states
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [matchStatus, setMatchStatus] = useState<'active' | 'pending_completion' | 'completed'>('active')
  const [userHasRated, setUserHasRated] = useState(false)
  const [isCompletingMatch, setIsCompletingMatch] = useState(false)

  useEffect(() => {
    loadData()
    checkBanStatus()
    loadMatchStatus()
  }, [matchId])

  // Real-time subscription'ı ayrı useEffect'te yap
  useEffect(() => {
    if (!matchId) return
    
    // Sadece matchId ile channel name oluştur (unique olmak için Date.now() kullanma!)
    const channelName = `chat-${matchId}`
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          console.log('📨 Yeni mesaj geldi:', payload.new)
          setMessages(prev => {
            // Duplicate kontrolü - mesaj zaten varsa ekleme
            const exists = prev.some(m => m.id === payload.new.id)
            if (exists) {
              console.log('⚠️ Duplicate mesaj engellendi:', payload.new.id)
              return prev
            }
            return [...prev, payload.new]
          })
          scrollToBottom()
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

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load match status for rating system
  const loadMatchStatus = async () => {
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
  }

  // Handle "Takası Tamamla" button
  const handleCompleteMatch = async () => {
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
          alert(result.message)
        }
        loadMatchStatus() // Reload status
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error completing match:', error)
      alert('Bir hata oluştu, lütfen tekrar deneyin')
    } finally {
      setIsCompletingMatch(false)
    }
  }

  // Handle rating submission
  const handleSubmitRating = async (rating: number, comment?: string) => {
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
        alert('Teşekkürler! Puanınız kaydedildi. 🌟')
      } else {
        throw new Error('Rating failed')
      }
    } catch (error) {
      console.error('Error rating user:', error)
      throw error
    }
  }

  const checkBanStatus = async () => {
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
  }

  const loadData = async () => {
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
    } catch (error) {
      console.error('Error loading chat:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
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

    try {
      // 🛡️ BACKEND KONTROLÜ (API filtreleme)
      const { data: { session } } = await supabase.auth.getSession()
      
      const filterResponse = await fetch('/api/messages/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          message: messageText,
          matchId,
          receiverId: otherUser.id
        })
      })

      const filterResult = await filterResponse.json()

      // Mesaj engellendi
      if (!filterResult.allowed) {
        setFilterWarning(filterResult.reason || filterResult.message)
        setNewMessage(messageText) // Mesajı geri koy
        
        // Ban durumunu güncelle
        if (filterResult.bannedUntil) {
          setIsBanned(true)
          setBanDetails(filterResult)
        }
        
        setIsSending(false)
        return
      }

      // ✅ Mesaj temiz - gönder
      const sent = await sendMessage(matchId, user.id, otherUser.id, messageText)
      
      if (!sent) {
        // ❌ Hata - mesajı geri koy
        setNewMessage(messageText)
        setFilterWarning('Mesaj gönderilemedi, tekrar deneyin')
      }
      // ✅ Başarılı - Real-time subscription otomatik ekleyecek, bir şey yapmaya gerek yok!
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageText)
      setFilterWarning('Mesaj gönderilemedi')
    } finally {
      setIsSending(false)
    }
  }

  // Shared Message Bubble Component
  const MessageBubble = ({ msg }: { msg: any }) => {
    const isMine = msg.sender_id === user?.id
    
    const getMessageStatus = () => {
      if (!isMine) return null
      if (msg.read_at) return <span className="ml-1" title="Görüldü">✓✓</span>
      else if (msg.read) return <span className="ml-1" title="İletildi">✓✓</span>
      else return <span className="ml-1" title="Gönderildi">✓</span>
    }
    
    return (
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
          isMine 
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          <p className="text-sm leading-relaxed">{msg.content}</p>
          <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${isMine ? 'text-white/80' : 'text-gray-500'}`}>
            <span>{new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
            {getMessageStatus()}
          </div>
        </div>
      </div>
    )
  }

  // Shared Input Component
  const MessageInput = () => (
    <div className="bg-white border-t border-gray-200 p-4">
      {filterWarning && (
        <div className="mb-3">
          <MessageFilterWarning
            reason={filterWarning}
            severity="high"
            onClose={() => setFilterWarning(null)}
          />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value)
            if (filterWarning) setFilterWarning(null)
          }}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder={isBlocked ? "Kullanıcı engellenmiş" : isBanned ? "Mesaj gönderemezsiniz" : "Mesajınızı yazın..."}
          disabled={isBanned || isSending || isBlocked}
          className="flex-1 bg-gray-100 border-2 border-gray-300 rounded-full px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || isBanned || isSending || isBlocked}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )

  // User Info Sidebar for Desktop
  const UserInfoSidebar = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 sticky top-24">
      {/* User Profile */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          {otherUser?.avatar_url ? (
            <Image src={otherUser.avatar_url} alt="" width={96} height={96} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{otherUser?.name || 'Kullanıcı'}</h3>
        <p className="text-sm text-gray-500">{otherUser?.email}</p>
      </div>

      {/* Match Status */}
      <div className="space-y-3 mb-6">
        <div className={`w-full rounded-xl py-3 px-4 text-sm text-center font-medium ${
          matchStatus === 'completed' 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : matchStatus === 'pending_completion'
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {matchStatus === 'completed' && '✅ Takas Tamamlandı'}
          {matchStatus === 'pending_completion' && '⏳ Onay Bekleniyor'}
          {matchStatus === 'active' && '💬 Aktif Sohbet'}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isBlocked && matchStatus === 'active' && (
          <button
            onClick={handleCompleteMatch}
            disabled={isCompletingMatch}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

        {matchStatus === 'completed' && !userHasRated && (
          <button
            onClick={() => setShowRatingModal(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
          >
            ⭐ Puanla
          </button>
        )}

        {!isBlocked && (
          <button
            onClick={() => setShowBlockReportModal(true)}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all"
          >
            Engelle / Şikayet Et
          </button>
        )}

        <Link 
          href="/messages"
          className="w-full block text-center bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
        >
          ← Tüm Mesajlar
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MessageCircle className="w-4 h-4" />
          <span>{messages.length} mesaj</span>
        </div>
        <p className="text-xs text-gray-400">
          Takaslarınızı güvenle tamamlayın. Şüpheli durumları bildirin.
        </p>
      </div>
    </div>
  )

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
            <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {otherUser?.avatar_url ? (
                  <Image src={otherUser.avatar_url} alt="" width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-gray-800">{otherUser?.name || 'Kullanıcı'}</h2>
                <p className="text-xs text-gray-500">
                  {matchStatus === 'completed' ? '✅ Takas Tamamlandı' : 'Çevrimiçi'}
                </p>
              </div>
            </div>

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
                <BlockedUserNotice userName={otherUser?.name || 'Kullanıcı'} />
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput />
          </div>

          {/* Sidebar - 1 column */}
          <div className="col-span-1">
            <UserInfoSidebar />
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
      <header className="bg-white shadow-sm border-b border-gray-200 pt-safe">
        <div className="px-4 py-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">{otherUser?.name || 'Kullanıcı'}</h1>
              <p className="text-xs text-gray-500">
                {matchStatus === 'completed' ? '✅ Takas Tamamlandı' : otherUser?.email}
              </p>
            </div>
            {!isBlocked && (
              <button
                onClick={() => setShowBlockReportModal(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Seçenekler"
              >
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Takası Tamamla Button */}
          {!isBlocked && matchStatus === 'active' && (
            <button
              onClick={handleCompleteMatch}
              disabled={isCompletingMatch}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className="w-full bg-yellow-100 border border-yellow-300 rounded-xl py-2.5 px-4 text-sm text-center text-yellow-800">
              ⏳ Diğer tarafın onayı bekleniyor...
            </div>
          )}

          {matchStatus === 'completed' && !userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              ✅ Takas tamamlandı! Lütfen puanlayın.
            </div>
          )}

          {matchStatus === 'completed' && userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              🌟 Takas tamamlandı ve puanlandı!
            </div>
          )}
        </div>
      </header>

      {/* Blocked User Notice */}
      {isBlocked && (
        <div className="p-4">
          <BlockedUserNotice userName={otherUser?.name || 'Kullanıcı'} />
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
            loadData() // Reload to update UI
          }}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pb-safe">
        <MessageInput />
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
