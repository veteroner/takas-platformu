'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Message = {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

export default function AdminMessagesPage() {
  const [rows, setRows] = useState<Message[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const run = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/admin/messages', { headers })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Yükleme hatası')
        }
        const j = await res.json()
        setRows(j.data || [])
      } catch (e: any) {
        setError(e?.message || 'Hata')
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(m => m.content.toLowerCase().includes(q) || m.sender_id.toLowerCase().includes(q) || m.receiver_id.toLowerCase().includes(q))
  }, [rows, query])

  const remove = async (id: string) => {
    if (!confirm('Mesajı silmek istediğinize emin misiniz?')) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE', headers: authHeaders })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Silme hatası')
      return
    }
    setRows(prev => prev.filter(x => x.id !== id))
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Mesajlar</h1>
        <input 
          value={query} 
          onChange={e=>setQuery(e.target.value)} 
          placeholder="Ara..." 
          className="bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400" 
        />
      </div>
      <div className="overflow-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <Th>İçerik</Th>
              <Th>Gönderen</Th>
              <Th>Alıcı</Th>
              <Th>Tarih</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <Td className="max-w-xl truncate"><div title={m.content}>{m.content}</div></Td>
                <Td className="font-mono">{m.sender_id}</Td>
                <Td className="font-mono">{m.receiver_id}</Td>
                <Td>{new Date(m.created_at).toLocaleString('tr-TR')}</Td>
                <Td>
                  <button 
                    onClick={()=>remove(m.id)} 
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    Sil
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left font-semibold px-4 py-3 text-white">{children}</th> }
function Td({ children, className }: { children: React.ReactNode; className?: string }) { return <td className={`px-4 py-3 align-top text-white ${className||''}`}>{children}</td> }


