'use client'

import { useEffect } from 'react'

export default function OneSignalCapacitorInit() {
  useEffect(() => {
    // Dynamically import to avoid SSR issues
    (async () => {
      try {
        const { OneSignal } = await import('@onesignal/capacitor-plugin')
        const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
        if (!appId) return
        await OneSignal.initialize(appId)
        await OneSignal.Notifications.requestPermission()
      } catch (e) {
        // no-op on web or if plugin not available
      }
    })()
  }, [])
  return null
}


