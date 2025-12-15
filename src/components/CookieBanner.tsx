'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { createClient } from '@/lib/supabase/client'
import { saveConsent } from '@/lib/consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Çerez banner'ı sadece web platformunda göster
    // Native mobil uygulamalarda ATT (iOS) ve Android izinleri kullanılır
    if (Capacitor.isNativePlatform()) {
      setVisible(false)
      return
    }
    
    // Kullanıcı bilgisini al
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id)
      }
    })
    
    const v = localStorage.getItem('cookie-consent')
    setVisible(!v)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl bg-black/80 text-white backdrop-blur rounded-2xl p-4 border border-white/10">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm flex-1">
          Deneyiminizi iyileştirmek için çerezleri kullanıyoruz. Ayrıntılar için{' '}
          <Link className="underline" href="/cerez-politikasi">Çerez Politikası</Link>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              localStorage.setItem('cookie-consent', 'necessary')
              // Veritabanına kaydet
              if (userId) {
                await saveConsent(userId, 'cookies', '1.0')
              }
              setVisible(false)
            }}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >Sadece zorunlu</button>
          <button
            onClick={async () => {
              localStorage.setItem('cookie-consent', 'all')
              // Veritabanına kaydet
              if (userId) {
                await saveConsent(userId, 'cookies', '1.0')
              }
              setVisible(false)
            }}
            className="px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600"
          >Tümünü kabul et</button>
        </div>
      </div>
    </div>
  )
}


