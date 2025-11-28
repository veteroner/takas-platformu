'use client'

import { useEffect, useRef, useState } from 'react'

function useOnlineStatus() {
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return online
}

async function checkHealth(timeoutMs = 3000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch('/api/health', { signal: controller.signal, cache: 'no-store' })
    clearTimeout(t)
    return res.ok
  } catch {
    return false
  }
}

export default function NetworkGuard() {
  const online = useOnlineStatus()
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    const run = async () => {
      const ok = await checkHealth()
      setVisible(!(online && ok))
    }
    run()
    // Periyodik kontrol (30s)
    timer.current = window.setInterval(run, 30000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [online])

  if (!visible) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="m-2 rounded-xl bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            {online ? 'Sunucuya ulaşılamıyor. Birazdan tekrar deneyeceğiz.' : 'Çevrimdışı görünüyorsunuz. Lütfen bağlantınızı kontrol edin.'}
          </div>
          <button
            onClick={async () => {
              const ok = await checkHealth(1500)
              setVisible(!(navigator.onLine && ok))
            }}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-red-600 text-sm font-medium hover:bg-red-50"
          >
            Yeniden dene
          </button>
        </div>
      </div>
    </div>
  )
}
