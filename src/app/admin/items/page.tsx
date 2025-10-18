'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Item = {
  id: string
  title: string
  description: string
  category: string
  condition: string
  estimated_value?: number | null
  images: string[]
  owner_id: string
  status: 'active' | 'traded' | 'deleted'
  created_at: string
  location?: string | null
  views: number
  likes: number
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [edit, setEdit] = useState<Item | null>(null)
  const [editData, setEditData] = useState<Partial<Item>>({})

  // Always attach a fresh Supabase access token to admin requests
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const run = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/admin/items', { headers })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Yükleme hatası')
        }
        const j = await res.json()
        setItems(j.data || [])
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
    if (!q) return items
    return items.filter(i => (i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)))
  }, [items, query])

  const updateStatus = async (item: Item, status: Item['status']) => {
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ id: item.id, updates: { status } })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Güncelleme hatası')
      return
    }
    const j = await res.json()
    setItems(prev => prev.map(x => x.id === j.data.id ? j.data : x))
  }

  const startEdit = (i: Item) => {
    setEdit(i)
    setEditData({ title: i.title, description: i.description, category: i.category, condition: i.condition, location: i.location || '' })
  }
  const save = async () => {
    if (!edit) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ id: edit.id, updates: editData })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Kaydetme hatası')
      return
    }
    const j = await res.json()
    setItems(prev => prev.map(x => x.id === j.data.id ? j.data : x))
    setEdit(null)
  }

  const remove = async (id: string) => {
    if (!confirm('Eşyayı silmek istediğinize emin misiniz?')) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`/api/admin/items?id=${id}`, { method: 'DELETE', headers: authHeaders })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Silme hatası')
      return
    }
    setItems(prev => prev.filter(x => x.id !== id))
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
        <h1 className="text-3xl font-bold text-white">Eşyalar</h1>
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
              <Th>Başlık</Th>
              <Th>Kategori</Th>
              <Th>Durum</Th>
              <Th>Değer</Th>
              <Th>Konum</Th>
              <Th>Görüntülenme</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map(i => (
              <tr key={i.id} className="hover:bg-white/5 transition-colors">
                <Td>{i.title}</Td>
                <Td>{i.category}</Td>
                <Td>
                  <select 
                    className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none" 
                    value={i.status} 
                    onChange={e=>updateStatus(i, e.target.value as Item['status'])}
                  >
                    <option value="active" className="bg-gray-800">active</option>
                    <option value="traded" className="bg-gray-800">traded</option>
                    <option value="deleted" className="bg-gray-800">deleted</option>
                  </select>
                </Td>
                <Td>{i.estimated_value ?? '-'}</Td>
                <Td>{i.location || '-'}</Td>
                <Td>{i.views}</Td>
                <Td>
                  <div className="flex gap-2">
                    <button 
                      onClick={()=>startEdit(i)} 
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={()=>remove(i.id)} 
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

      {edit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-white">Eşyayı Düzenle</h2>
            <div className="grid gap-4">
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Başlık</div>
                <input 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  value={editData.title || ''} 
                  onChange={e=>setEditData(d=>({ ...d, title: e.target.value }))} 
                />
              </label>
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Açıklama</div>
                <textarea 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  rows={4} 
                  value={editData.description || ''} 
                  onChange={e=>setEditData(d=>({ ...d, description: e.target.value }))} 
                />
              </label>
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Kategori</div>
                <input 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  value={editData.category || ''} 
                  onChange={e=>setEditData(d=>({ ...d, category: e.target.value }))} 
                />
              </label>
              <label className="text-sm">
                <div className="mb-2 text-white font-medium">Durum</div>
                <select 
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
                  value={editData.status || edit.status} 
                  onChange={e=>setEditData(d=>({ ...d, status: e.target.value as Item['status'] }))}
                >
                  <option value="active" className="bg-gray-800">active</option>
                  <option value="traded" className="bg-gray-800">traded</option>
                  <option value="deleted" className="bg-gray-800">deleted</option>
                </select>
              </label>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={()=>setEdit(null)} 
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

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left font-semibold px-4 py-3 text-white">{children}</th> }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-3 align-top text-white">{children}</td> }


