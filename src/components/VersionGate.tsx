'use client'

import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { useTranslation } from 'react-i18next'

function compareVersions(a: string, b: string): number {
  const toNums = (v: string) => v.split('.').map((x) => parseInt(x, 10) || 0)
  const [a1, a2, a3] = toNums(a)
  const [b1, b2, b3] = toNums(b)
  if (a1 !== b1) return a1 - b1
  if (a2 !== b2) return a2 - b2
  return a3 - b3
}

export default function VersionGate() {
  const { t } = useTranslation('common')
  const [outdated, setOutdated] = useState<null | { platform: 'ios' | 'android'; min: string; current: string }>(null)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const run = async () => {
      // Native derlemelerde bu env değişkenini ayarlayacağız
      const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0'
      if (currentVersion === '0.0.0') return

      try {
        const res = await fetch('/api/app/min-versions', { cache: 'no-store' })
        if (!res.ok) return
        const { data } = await res.json()
        const platform = (Capacitor.getPlatform() as 'ios' | 'android')
        const min = platform === 'ios' ? (data.min_ios_version || '1.0.0') : (data.min_android_version || '1.0.0')
        if (compareVersions(currentVersion, min) < 0) {
          setOutdated({ platform, min, current: currentVersion })
        }
      } catch {
        // API erişilemiyorsa gate göstermeyelim
      }
    }

    run()
  }, [])

  if (!outdated) return null

  const storeUrl = outdated.platform === 'ios'
    ? 'https://apps.apple.com' // TODO: gerçek App Store URL
    : 'https://play.google.com/store/apps'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white text-gray-900 p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-2">{t('versionGate.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('versionGate.description', { current: outdated.current, min: outdated.min })}
        </p>
        <a href={storeUrl} target="_blank" className="block w-full text-center px-4 py-2 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-500 transition">
          {t('versionGate.updateInStore')}
        </a>
      </div>
    </div>
  )
}
