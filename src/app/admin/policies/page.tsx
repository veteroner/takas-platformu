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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Politika Sürümü Yönetimi</h1>
      <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
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
    </div>
  )
}


