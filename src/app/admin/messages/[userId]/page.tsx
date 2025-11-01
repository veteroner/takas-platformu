'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Send, Trash2, AlertTriangle, Shield, User } from 'lucide-react'
import Link from 'next/link'

type Message = {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

type UserInfo = {
  id: string
  email: string
  created_at: string
}

export default function UserMessagesPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Get user info and messages from API
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        const res = await fetch(`/api/admin/messages/users/${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j?.error || 'Yükleme hatası')
        }
        
        const j = await res.json()
        setUserInfo(j.data.userInfo)
        setMessages(j.data.messages || [])
      } catch (e: any) {
        setError(e?.message || 'Hata')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  const deleteMessage = async (msgId: string) => {
    if (!deleteReason.trim()) {
      alert('Lütfen silme nedenini belirtin (KVKK gereği)')
      return
    }

    if (!confirm(`Mesajı silmek istediğinize emin misiniz?\n\nNeden: ${deleteReason}`)) {
      return
    }

    try {
      // Log the deletion (KVKK compliance)
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: 'delete_message',
        target_id: msgId,
        target_type: 'message',
        reason: deleteReason,
        metadata: { user_id: userId }
      })

      // Delete message
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', msgId)

      if (error) throw error

      setMessages(prev => prev.filter(m => m.id !== msgId))
      setDeleteReason('')
      alert('Mesaj silindi ve işlem log kaydına alındı')
    } catch (e: any) {
      alert('Silme hatası: ' + (e?.message || 'Bilinmeyen hata'))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
      <h3 className="font-semibold mb-2">Hata</h3>
      <p>{error}</p>
    </div>
  )

  const sentMessages = messages.filter(m => m.sender_id === userId)
  const receivedMessages = messages.filter(m => m.receiver_id === userId)

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-orange-300">
          <p className="font-semibold mb-1">KVKK Uyarısı</p>
          <p>Bu sayfadaki mesajları görüntüleme işleminiz log kaydına alınmaktadır. Sadece gerekli durumlarda (şikayet, yasal talep, güvenlik) erişim yapın.</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/messages"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-8 h-8" />
              Kullanıcı Mesajları
            </h1>
            {userInfo && (
              <div className="text-gray-400 mt-1 space-y-1">
                <p className="font-medium">{userInfo.email}</p>
                <p className="text-sm font-mono">{userInfo.id}</p>
                <p className="text-xs">Kayıt: {new Date(userInfo.created_at).toLocaleDateString('tr-TR')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Toplam Mesaj</div>
          <div className="text-2xl font-bold text-white mt-1">{messages.length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Gönderilen</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{sentMessages.length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Alınan</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{receivedMessages.length}</div>
        </div>
      </div>

      {/* Delete Reason Input */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
        <label className="block text-sm font-medium text-white mb-2">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Silme Nedeni (KVKK gereği zorunlu)
        </label>
        <input
          type="text"
          value={deleteReason}
          onChange={e => setDeleteReason(e.target.value)}
          placeholder="Örn: Kullanıcı şikayeti, Yasal makam talebi, Küfür/hakaret içeriği..."
          className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400"
        />
        <p className="text-xs text-gray-400 mt-2">
          Mesaj silerken bu nedeni belirtmeniz KVKK kapsamında zorunludur. Tüm silme işlemleri log kaydına alınır.
        </p>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Send className="w-5 h-5" />
          Mesaj Geçmişi ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center text-gray-400">
            Henüz mesaj yok
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => {
              const isSent = msg.sender_id === userId
              return (
                <div
                  key={msg.id}
                  className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:border-white/20 transition-colors ${
                    isSent ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isSent 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {isSent ? '→ Gönderilen' : '← Alınan'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {msg.read && (
                          <span className="text-xs text-gray-500">✓ Okundu</span>
                        )}
                      </div>
                      <p className="text-white leading-relaxed">{msg.content}</p>
                      <div className="text-xs text-gray-500 font-mono space-y-1">
                        <div>Eşleşme ID: {msg.match_id}</div>
                        <div>Mesaj ID: {msg.id}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      disabled={!deleteReason.trim()}
                      className="flex-shrink-0 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={deleteReason.trim() ? 'Mesajı Sil' : 'Önce silme nedenini belirtin'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center text-sm text-gray-400">
        <Shield className="w-5 h-5 inline mr-2" />
        Bu sayfanın görüntülenmesi KVKK kapsamında log kaydına alındı.
      </div>
    </div>
  )
}
