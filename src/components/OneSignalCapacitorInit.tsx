'use client'

import { useEffect } from 'react'

export default function OneSignalCapacitorInit() {
  useEffect(() => {
    // Dynamically import to avoid SSR issues
    (async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
        if (!appId) return
        // Try Capacitor plugin first
        try {
          const mod: any = await import('@onesignal/capacitor-plugin')
          if (mod?.OneSignal) {
            await mod.OneSignal.initialize(appId)
            await mod.OneSignal.Notifications.requestPermission()
            return
          }
        } catch {}
        // Fallback silently on web: optionally load web SDK later
      } catch (e) {
        // no-op on web or if plugin not available
      }
    })()
  }, [])
  return null
}


