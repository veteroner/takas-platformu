'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { policyVersions } from '@/lib/legal'

export default function ConsentGuard() {
  useEffect(() => {
    // Native mobil uygulamalarda bu kontrol gereksiz
    // ATT (iOS) ve Android izin sistemi kullanılır
    if (Capacitor.isNativePlatform()) {
      return
    }
    
    // If versions bump in settings API, force re-consent by clearing flag
    fetch('/api/policies')
      .then(r => r.json())
      .then(({ data }) => {
        if (!Array.isArray(data)) return
        const required: Record<string, string> = {}
        for (const row of data) required[row.key.replace('policy_required_', '')] = row.value
        Object.entries(policyVersions).forEach(([k]) => {
          const acceptedVersion = localStorage.getItem(`accepted_${k}`)
          const requiredVersion = required[k]
          if (requiredVersion && acceptedVersion !== requiredVersion) {
            localStorage.removeItem(`accepted_${k}`)
          }
        })
      })
      .catch(() => {})
  }, [])
  return null
}


