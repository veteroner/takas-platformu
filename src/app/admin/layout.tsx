'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const auth = await import('@supabase/supabase-js')
        const { createClient } = auth
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setAllowed(false)
          setError('Önce giriş yapın')
          return
        }
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        setAllowed(res.ok)
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          setError(j?.error || 'Yetkisiz')
        }
      } catch (e: any) {
        setAllowed(false)
        setError(e?.message || 'Hata')
      }
    }
    run()
  }, [])

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Erişim Yok</h1>
          <p className="opacity-80 mb-4">{error || 'Bu sayfaya erişim yetkiniz yok.'}</p>
          <Link href="/" className="px-4 py-2 rounded bg-pink-500 text-white">Ana sayfa</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-white/10 p-4 space-y-2">
        <h2 className="text-lg font-semibold mb-4">Admin</h2>
        <nav className="flex flex-col gap-1">
          <Link className="hover:underline" href="/admin">Dashboard</Link>
          <Link className="hover:underline" href="/admin/users">Kullanıcılar</Link>
          <Link className="hover:underline" href="/admin/items">Eşyalar</Link>
          <Link className="hover:underline" href="/admin/matches">Eşleşmeler</Link>
          <Link className="hover:underline" href="/admin/messages">Mesajlar</Link>
          <Link className="hover:underline" href="/admin/reports">Şikayetler</Link>
          <Link className="hover:underline" href="/admin/blocks">Engellemeler</Link>
          <Link className="hover:underline" href="/admin/settings">Ayarlar</Link>
          <Link className="hover:underline" href="/admin/policies">Politikalar</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}


