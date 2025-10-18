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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Politika Sürümü Yönetimi</h1>
      
      <div className="space-y-4 bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Politika</label>
          <select 
            value={key} 
            onChange={e=>setKey(e.target.value)} 
            className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
          >
            {POLICY_KEYS.map(p=> (
              <option key={p.key} value={p.key} className="bg-gray-800 text-white">{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Zorunlu sürüm</label>
          <input 
            value={version} 
            onChange={e=>setVersion(e.target.value)} 
            className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400" 
            placeholder="Örn: v1"
          />
          <p className="text-sm mt-2 text-white">Mevcut: <span className="text-white font-medium">{required[key] || '-'}</span></p>
        </div>
        <button 
          onClick={submit} 
          disabled={loading} 
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Güncelleniyor...' : 'Güncelle'}
        </button>
        {msg && <p className="text-sm mt-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">{msg}</p>}
      </div>

      <div className="space-y-4 bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-white">Toplu sürüm ata</label>
            <input 
              value={bulkVersion} 
              onChange={e=>setBulkVersion(e.target.value)} 
              className="w-full bg-white/10 text-white p-3 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 placeholder-gray-400" 
              placeholder="örn. v2" 
            />
          </div>
          <button 
            onClick={submitBulk} 
            disabled={loading || !bulkVersion} 
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/50 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Hepsine Uygula
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left px-4 py-3 text-white font-semibold">Politika</th>
                <th className="text-left px-4 py-3 text-white font-semibold">Mevcut Zorunlu</th>
                <th className="text-left px-4 py-3 text-white font-semibold">Yeni Sürüm</th>
                <th className="text-left px-4 py-3 text-white font-semibold">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {POLICY_KEYS.map(p => {
                const current = required[p.key] || '-'
                const [tmp, setTmp] = useState(current)
                return (
                  <tr key={p.key} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{p.label}</td>
                    <td className="px-4 py-3 text-white">{current}</td>
                    <td className="px-4 py-3">
                      <input 
                        className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-pink-500 focus:outline-none w-24" 
                        value={tmp} 
                        onChange={e=>setTmp(e.target.value)} 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={()=>submitInline(p.key, tmp)} 
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                      >
                        Kaydet
                      </button>
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


