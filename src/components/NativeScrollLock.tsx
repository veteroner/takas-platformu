'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export default function NativeScrollLock() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const html = document.documentElement
    const body = document.body

    html.classList.add('native-app')
    body.classList.add('native-app')

    return () => {
      html.classList.remove('native-app')
      body.classList.remove('native-app')
    }
  }, [])

  return null
}
