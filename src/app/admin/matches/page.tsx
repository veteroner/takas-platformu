'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Match = {
  id: string
  user1_id: string
  user2_id: string
  item1_id: string
  item2_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
}

export default function AdminMatchesPage() {
  const [rows, setRows] = useState<Match[]>([])
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
        const res = await fetch('/api/admin/matches', { headers })
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
    return rows.filter(m => m.id.toLowerCase().includes(q) || m.status.toLowerCase().includes(q))
  }, [rows, query])

  const updateStatus = async (m: Match, status: Match['status']) => {
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ id: m.id, updates: { status } })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Güncelleme hatası')
      return
    }
    const j = await res.json()
    setRows(prev => prev.map(x => x.id === j.data.id ? j.data : x))
  }

  if (loading) return <div className="p-6">Yükleniyor...</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Eşleşmeler</h1>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ara..." className="bg-white/10 px-3 py-2 rounded" />
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>ID</Th>
              <Th>Durum</Th>
              <Th>Oluşturulma</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} className="border-t border-white/10">
                <Td className="font-mono">{m.id}</Td>
                <Td>
                  <select className="bg-white/10 px-2 py-1 rounded" value={m.status} onChange={e=>updateStatus(m, e.target.value as Match['status'])}>
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                    <option value="completed">completed</option>
                  </select>
                </Td>
                <Td>{new Date(m.created_at).toLocaleString('tr-TR')}</Td>
                <Td>-</Td>
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


