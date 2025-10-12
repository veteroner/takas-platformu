'use client'

import { useEffect, useState } from 'react'

const POLICY_KEYS = [
  { key: 'terms', label: 'Üyelik Sözleşmesi' },
  { key: 'kvkk', label: 'KVKK Aydınlatma' },
  { key: 'privacy', label: 'Gizlilik Politikası' },
  { key: 'cookies', label: 'Çerez Politikası' },
  { key: 'marketing', label: 'Pazarlama Açık Rıza' },
  { key: 'email', label: 'Ticari Elektronik İleti' },
]

export default function AdminPoliciesPage() {
  const [required, setRequired] = useState<Record<string,string>>({})
  const [key, setKey] = useState('terms')
  const [version, setVersion] = useState('v1')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [bulkVersion, setBulkVersion] = useState('')

  useEffect(() => {
    fetch('/api/policies').then(r=>r.json()).then(({data})=>{
      const map: Record<string,string> = {}
      for (const row of data || []) map[row.key.replace('policy_required_','')] = row.value
      setRequired(map)
    })
  }, [])

  const submit = async () => {
    setLoading(true)
    setMsg('')
    const res = await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policyKey: key, newVersion: version })
    })
    setLoading(false)
    if (res.ok) {
      setMsg('Güncellendi')
      setRequired({ ...required, [key]: version })
    } else {
      const j = await res.json().catch(()=>({}))
      setMsg(j?.error || 'Hata')
    }
  }

  const submitInline = async (policyKey: string, v: string) => {
    if (!v) return
    setMsg('')
    const res = await fetch('/api/policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policyKey, newVersion: v })
    })
    if (res.ok) {
      setRequired(prev => ({ ...prev, [policyKey]: v }))
      setMsg(`${policyKey} güncellendi`)
    } else {
      const j = await res.json().catch(()=>({}))
      setMsg(j?.error || 'Hata')
    }
  }

  const submitBulk = async () => {
    if (!bulkVersion) return
    setLoading(true)
    setMsg('')
    try {
      for (const p of POLICY_KEYS) {
        // ardışık basit istek; dilersen Promise.all ile paralelleştirilebilir
        // ancak hata yönetimi basit tutulsun
        // eslint-disable-next-line no-await-in-loop
        await fetch('/api/policies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ policyKey: p.key, newVersion: bulkVersion })
        })
      }
      const map: Record<string,string> = {}
      for (const p of POLICY_KEYS) map[p.key] = bulkVersion
      setRequired(map)
      setMsg('Tüm politikalar güncellendi')
    } catch (e:any) {
      setMsg(e?.message || 'Hata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Politika Sürümü Yönetimi</h1>
      <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
        <div>
          <label className="block mb-1">Politika</label>
          <select value={key} onChange={e=>setKey(e.target.value)} className="w-full bg-white/10 p-2 rounded">
            {POLICY_KEYS.map(p=> (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Zorunlu sürüm</label>
          <input value={version} onChange={e=>setVersion(e.target.value)} className="w-full bg-white/10 p-2 rounded" />
          <p className="text-sm mt-1 opacity-80">Mevcut: {required[key] || '-'}</p>
        </div>
        <button onClick={submit} disabled={loading} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white">
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </div>

      <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block mb-1">Toplu sürüm ata</label>
            <input value={bulkVersion} onChange={e=>setBulkVersion(e.target.value)} className="w-full bg-white/10 p-2 rounded" placeholder="örn. v2" />
          </div>
          <button onClick={submitBulk} disabled={loading || !bulkVersion} className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white whitespace-nowrap">Hepsine Uygula</button>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-3 py-2">Politika</th>
                <th className="text-left px-3 py-2">Mevcut Zorunlu</th>
                <th className="text-left px-3 py-2">Yeni Sürüm</th>
                <th className="text-left px-3 py-2">Eylem</th>
              </tr>
            </thead>
            <tbody>
              {POLICY_KEYS.map(p => {
                const current = required[p.key] || '-'
                const [tmp, setTmp] = useState(current)
                return (
                  <tr key={p.key} className="border-t border-white/10">
                    <td className="px-3 py-2">{p.label}</td>
                    <td className="px-3 py-2">{current}</td>
                    <td className="px-3 py-2"><input className="bg-white/10 px-2 py-1 rounded" value={tmp} onChange={e=>setTmp(e.target.value)} /></td>
                    <td className="px-3 py-2">
                      <button onClick={()=>submitInline(p.key, tmp)} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Kaydet</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


