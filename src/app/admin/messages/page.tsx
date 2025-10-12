'use client'

import { useEffect, useMemo, useState } from 'react'

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

  const headers: Record<string, string> = {}

  useEffect(() => {
    const run = async () => {
      try {
        const auth = await import('@supabase/supabase-js')
        const { createClient } = auth
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(url, key)
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        if (token) headers['Authorization'] = `Bearer ${token}`
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
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE', headers })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Silme hatası')
      return
    }
    setRows(prev => prev.filter(x => x.id !== id))
  }

  if (loading) return <div className="p-6">Yükleniyor...</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mesajlar</h1>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ara..." className="bg-white/10 px-3 py-2 rounded" />
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>İçerik</Th>
              <Th>Gönderen</Th>
              <Th>Alıcı</Th>
              <Th>Tarih</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-white/10">
                <Td className="max-w-xl truncate" title={m.content}>{m.content}</Td>
                <Td className="font-mono">{m.sender_id}</Td>
                <Td className="font-mono">{m.receiver_id}</Td>
                <Td>{new Date(m.created_at).toLocaleString('tr-TR')}</Td>
                <Td>
                  <button onClick={()=>remove(m.id)} className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white">Sil</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left font-medium px-3 py-2">{children}</th> }
function Td({ children, className }: { children: React.ReactNode; className?: string }) { return <td className={`px-3 py-2 align-top ${className||''}`}>{children}</td> }


