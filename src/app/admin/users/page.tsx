'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type User = {
  id: string
  email: string
  name: string
  avatar?: string | null
  bio?: string | null
  location?: string | null
  created_at: string
  rating?: number | null
  total_trades?: number | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<User | null>(null)
  const [editData, setEditData] = useState<Partial<User>>({})

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const run = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/admin/users', { headers })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Yükleme hatası')
        }
        const j = await res.json()
        setUsers(j.data || [])
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
    if (!q) return users
    return users.filter(u =>
      (u.email?.toLowerCase() || '').includes(q) ||
      (u.name?.toLowerCase() || '').includes(q) ||
      (u.location?.toLowerCase() || '').includes(q)
    )
  }, [users, query])

  const startEdit = (u: User) => {
    setEditing(u)
    setEditData({ name: u.name, location: u.location || '', bio: u.bio || '' })
  }

  const save = async () => {
    if (!editing) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ id: editing.id, updates: editData })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Kaydetme hatası')
      return
    }
    const j = await res.json()
    setUsers(prev => prev.map(x => x.id === j.data.id ? j.data : x))
    setEditing(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE', headers: authHeaders })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Silme hatası')
      return
    }
    setUsers(prev => prev.filter(x => x.id !== id))
  }

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>
  }
  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Kullanıcılar</h1>
        <input
          value={query}
          onChange={e=>setQuery(e.target.value)}
          placeholder="Ara..."
          className="bg-white/10 px-3 py-2 rounded"
        />
      </div>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>E-posta</Th>
              <Th>Ad</Th>
              <Th>Konum</Th>
              <Th>Kayıt</Th>
              <Th>Skor</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-white/10">
                <Td>{u.email}</Td>
                <Td>{u.name}</Td>
                <Td>{u.location || '-'}</Td>
                <Td>{new Date(u.created_at).toLocaleDateString('tr-TR')}</Td>
                <Td>{u.rating ?? '-'}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={()=>startEdit(u)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">Düzenle</button>
                    <button onClick={()=>remove(u.id)} className="px-2 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white">Sil</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-xl border border-white/10 p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Kullanıcıyı Düzenle</h2>
            <div className="grid gap-3">
              <label className="text-sm">
                <div className="mb-1">Ad</div>
                <input className="w-full bg-white/10 px-3 py-2 rounded" value={editData.name || ''} onChange={e=>setEditData(d=>({ ...d, name: e.target.value }))} />
              </label>
              <label className="text-sm">
                <div className="mb-1">Konum</div>
                <input className="w-full bg-white/10 px-3 py-2 rounded" value={editData.location || ''} onChange={e=>setEditData(d=>({ ...d, location: e.target.value }))} />
              </label>
              <label className="text-sm">
                <div className="mb-1">Biyografi</div>
                <textarea className="w-full bg-white/10 px-3 py-2 rounded" rows={4} value={editData.bio || ''} onChange={e=>setEditData(d=>({ ...d, bio: e.target.value }))} />
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded bg-white/10">İptal</button>
              <button onClick={save} className="px-3 py-2 rounded bg-pink-500 text-white">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-medium px-3 py-2">{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-top">{children}</td>
}


