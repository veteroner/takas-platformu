'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { MessageCircle, Search, AlertTriangle, Shield, Eye } from 'lucide-react'

type UserMessageStats = {
  user_id: string
  user_email: string
  total_messages: number
  sent_messages: number
  received_messages: number
  last_message_date: string
}

export default function AdminMessagesPage() {
  const [users, setUsers] = useState<UserMessageStats[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLegalWarning, setShowLegalWarning] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        
        const { data: messages, error: msgError } = await supabase
          .from('messages')
          .select('sender_id, receiver_id, created_at')
          .order('created_at', { ascending: false })

        if (msgError) throw msgError

        const { data: { users: allUsers }, error: usersError } = await supabase.auth.admin.listUsers()
        if (usersError) throw usersError

        const userMap = new Map<string, UserMessageStats>()

        messages?.forEach(msg => {
          if (!userMap.has(msg.sender_id)) {
            const user = allUsers?.find(u => u.id === msg.sender_id)
            userMap.set(msg.sender_id, {
              user_id: msg.sender_id,
              user_email: user?.email || 'Bilinmiyor',
              total_messages: 0,
              sent_messages: 0,
              received_messages: 0,
              last_message_date: msg.created_at
            })
          }
          const senderStats = userMap.get(msg.sender_id)!
          senderStats.sent_messages++
          senderStats.total_messages++
          if (new Date(msg.created_at) > new Date(senderStats.last_message_date)) {
            senderStats.last_message_date = msg.created_at
          }

          if (!userMap.has(msg.receiver_id)) {
            const user = allUsers?.find(u => u.id === msg.receiver_id)
            userMap.set(msg.receiver_id, {
              user_id: msg.receiver_id,
              user_email: user?.email || 'Bilinmiyor',
              total_messages: 0,
              sent_messages: 0,
              received_messages: 0,
              last_message_date: msg.created_at
            })
          }
          const receiverStats = userMap.get(msg.receiver_id)!
          receiverStats.received_messages++
          receiverStats.total_messages++
          if (new Date(msg.created_at) > new Date(receiverStats.last_message_date)) {
            receiverStats.last_message_date = msg.created_at
          }
        })

        setUsers(Array.from(userMap.values()).sort((a, b) => 
          new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime()
        ))
      } catch (e: any) {
        setError(e?.message || 'Hata')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(u => 
      u.user_email.toLowerCase().includes(q) || 
      u.user_id.toLowerCase().includes(q)
    )
  }, [users, query])

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

  return (
    <div className="space-y-6">
      {showLegalWarning && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 relative">
          <button
            onClick={() => setShowLegalWarning(false)}
            className="absolute top-4 right-4 text-orange-400 hover:text-orange-300"
          >
            ✕
          </button>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Yasal Uyarı - Mesaj Gizliliği
              </h3>
              <div className="text-sm text-orange-300/90 space-y-2">
                <p><strong>KVKK (Kişisel Verilerin Korunması Kanunu) Uyarısı:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Kullanıcı mesajları <strong>kişisel veri</strong> kapsamındadır</li>
                  <li>Mesajları okuma yetkisi <strong>sadece şu durumlarda</strong> kullanılmalıdır:
                    <ul className="list-circle list-inside ml-6 mt-1">
                      <li>Şikayet/ihbar durumunda delil olarak</li>
                      <li>Yasal makamlardan talep geldiğinde</li>
                      <li>Platform kurallarının ihlali şüphesinde</li>
                      <li>Kullanıcı güvenliğinin tehlikede olduğu durumlarda</li>
                    </ul>
                  </li>
                  <li><strong>Gereksiz mesaj okuma</strong> KVKK ihlali oluşturur ve cezai sorumluluk getirir</li>
                  <li>Her mesaj görüntüleme işlemi <strong>log kaydına</strong> alınmalıdır</li>
                </ul>
                <p className="mt-3 text-orange-400 font-medium">
                  ⚠️ Bu özellik sadece <strong>gerekli hallerde</strong> ve <strong>Gizlilik Politikası</strong> çerçevesinde kullanılmalıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="w-8 h-8" />
            Mesajlar - Kullanıcı Bazlı
          </h1>
          <p className="text-gray-400 mt-2">Her kullanıcının mesaj istatistiklerini görüntüleyin</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            value={query} 
            onChange={e=>setQuery(e.target.value)} 
            placeholder="Email veya ID ile ara..." 
            className="bg-white/10 text-white pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400 min-w-[300px]" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Toplam Kullanıcı</div>
          <div className="text-2xl font-bold text-white mt-1">{users.length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Toplam Mesaj</div>
          <div className="text-2xl font-bold text-white mt-1">
            {users.reduce((sum, u) => sum + u.total_messages, 0)}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
          <div className="text-gray-400 text-sm">Aktif Kullanıcı (Son 24 saat)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {users.filter(u => {
              const lastMsg = new Date(u.last_message_date)
              const now = new Date()
              return (now.getTime() - lastMsg.getTime()) < 24 * 60 * 60 * 1000
            }).length}
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <Th>Kullanıcı Email</Th>
              <Th>Gönderilen</Th>
              <Th>Alınan</Th>
              <Th>Toplam</Th>
              <Th>Son Mesaj</Th>
              <Th>İşlem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  {query ? 'Arama sonucu bulunamadı' : 'Henüz mesaj yok'}
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user.user_id} className="hover:bg-white/5 transition-colors">
                  <Td>
                    <div className="space-y-1">
                      <div className="font-medium text-white">{user.user_email}</div>
                      <div className="text-xs text-gray-400 font-mono">{user.user_id}</div>
                    </div>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-medium">
                      {user.sent_messages}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 font-medium">
                      {user.received_messages}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-medium">
                      {user.total_messages}
                    </span>
                  </Td>
                  <Td>
                    <div className="text-gray-300">
                      {new Date(user.last_message_date).toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/messages/${user.user_id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium transition-all shadow-lg hover:shadow-pink-500/50"
                    >
                      <Eye className="w-4 h-4" />
                      Mesajları Gör
                    </Link>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center text-sm text-gray-400">
        <Shield className="w-5 h-5 inline mr-2" />
        Mesaj görüntüleme işlemleri KVKK kapsamında log kaydına alınır ve denetlenir.
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { 
  return <th className="text-left font-semibold px-4 py-3 text-white">{children}</th> 
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) { 
  return <td className={`px-4 py-3 align-top ${className||''}`}>{children}</td> 
}
