'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getAdminHeaders } from '@/lib/admin-fetch'

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
    return getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
        <h3 className="font-semibold mb-2">Hata</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Kullanıcılar</h1>
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
              <Th>E-posta</Th>
              <Th>Ad</Th>
              <Th>Konum</Th>
              <Th>Kayıt</Th>
              <Th>Skor</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <Td>{u.email}</Td>
                <Td>{u.name}</Td>
                <Td>{u.location || '-'}</Td>
                <Td>{new Date(u.created_at).toLocaleDateString('tr-TR')}</Td>
                <Td>{u.rating ?? '-'}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button 
                      onClick={()=>startEdit(u)} 
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={()=>remove(u.id)} 
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Kullanıcıyı Düzenle</h2>
            <div className="grid gap-4">
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Ad</div>
                <input 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  value={editData.name || ''} 
                  onChange={e=>setEditData(d=>({ ...d, name: e.target.value }))} 
                />
              </label>
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Konum</div>
                <input 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  value={editData.location || ''} 
                  onChange={e=>setEditData(d=>({ ...d, location: e.target.value }))} 
                />
              </label>
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Biyografi</div>
                <textarea 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  rows={4} 
                  value={editData.bio || ''} 
                  onChange={e=>setEditData(d=>({ ...d, bio: e.target.value }))} 
                />
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={()=>setEditing(null)} 
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                İptal
              </button>
              <button 
                onClick={save} 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 text-white font-medium transition-all"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-semibold px-4 py-3 text-white">{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top text-white">{children}</td>
}


