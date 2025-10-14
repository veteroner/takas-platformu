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

  if (loading) return <div className="p-6">Yükleniyor...</div>
  if (error) return <div className="p-6 text-red-400">{error}</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Ayarlar</h1>
      <div className="rounded-xl border border-white/10 overflow-hidden">
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
              <tr key={kv.key} className="border-t border-white/10">
                <Td className="font-mono">{kv.key}</Td>
                <Td>{kv.value}</Td>
                <Td>
                  <button onClick={()=>startEdit(kv)} className="px-2 py-1 rounded bg-white/10 hover:bg-white/20">Düzenle</button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-xl border border-white/10 p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Ayarı Düzenle</h2>
            <div className="mb-2 text-sm opacity-80">{editing.key}</div>
            <input value={value} onChange={e=>setValue(e.target.value)} className="w-full bg-white/10 px-3 py-2 rounded" />
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded bg-white/10">İptal</button>
              <button onClick={save} className="px-3 py-2 rounded bg-pink-500 text-white">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm opacity-80">
        Politika zorunlu sürümleri `policy_required_*` anahtarlarıyla listelenir. Ayrı sayfa: <a className="underline" href="/admin/policies">Politika Yönetimi</a>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { return <th className="text-left font-medium px-3 py-2">{children}</th> }
function Td({ children, className }: { children: React.ReactNode; className?: string }) { return <td className={`px-3 py-2 align-top ${className||''}`}>{children}</td> }


