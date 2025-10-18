'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type KV = { key: string; value: string }

export default function AdminSettingsPage() {
  const [rows, setRows] = useState<KV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<KV | null>(null)
  const [value, setValue] = useState('')

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  useEffect(() => {
    const run = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/admin/settings', { headers })
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

  const startEdit = (kv: KV) => {
    setEditing(kv)
    setValue(kv.value)
  }

  const save = async () => {
    if (!editing) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ key: editing.key, value })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Kaydetme hatası')
      return
    }
    setRows(prev => prev.map(x => x.key === editing.key ? { ...x, value } : x))
    setEditing(null)
  }

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  )
  if (error) return (
    <div className="m-6 p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400">
      {error}
    </div>
  )

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
      <div className="rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl bg-white/5">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Anahtar</Th>
              <Th>Değer</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(kv => (
              <tr key={kv.key} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <Td className="font-mono text-white">{kv.key}</Td>
                <Td className="text-white">{kv.value}</Td>
                <Td>
                  <button 
                    onClick={()=>startEdit(kv)} 
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-medium"
                  >
                    Düzenle
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Ayarı Düzenle</h2>
            <div className="mb-3 text-sm text-white/60 font-mono bg-white/5 px-3 py-2 rounded-lg">{editing.key}</div>
            <input 
              value={value} 
              onChange={e=>setValue(e.target.value)} 
              className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all" 
              placeholder="Değer girin..."
            />
            <div className="flex gap-2 justify-end mt-6">
              <button 
                onClick={()=>setEditing(null)} 
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
              >
                İptal
              </button>
              <button 
                onClick={save} 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-medium"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-white/60 bg-white/5 p-4 rounded-2xl border border-white/10">
        Politika zorunlu sürümleri `policy_required_*` anahtarlarıyla listelenir. Ayrı sayfa: <a className="underline text-pink-400 hover:text-pink-300 transition-colors" href="/admin/policies">Politika Yönetimi</a>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { 
  return <th className="text-left font-semibold px-3 py-2 text-white">{children}</th> 
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) { 
  return <td className={`px-3 py-2 align-top ${className||''}`}>{children}</td> 
}


