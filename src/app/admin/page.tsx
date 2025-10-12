'use client'

import { useEffect, useState } from 'react'

type Metrics = {
  users: number
  items: number
  matches: number
  messages: number
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        const res = await fetch('/api/admin/metrics', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Beklenmeyen hata')
        }
        const j = await res.json()
        setMetrics(j.data)
      } catch (e: any) {
        setError(e?.message || 'Hata')
      }
    }
    run()
  }, [])

  if (!metrics && !error) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-6 w-40 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_,i)=> (
            <div key={i} className="h-24 bg-white/5 rounded-xl border border-white/10" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Genel Bakış</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Kullanıcılar" value={metrics!.users} />
        <Card title="Eşyalar" value={metrics!.items} />
        <Card title="Eşleşmeler" value={metrics!.matches} />
        <Card title="Mesajlar" value={metrics!.messages} />
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4">
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-3xl font-semibold mt-1">{value}</div>
    </div>
  )
}


