'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function AnalyticsLoader() {
  const [enabled, setEnabled] = useState(false)
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!enabled || !measurementId) return null

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    setEnabled(consent === 'all')
  }, [])

  if (!enabled || !measurementId) return null

  return (
    <>
      {/* Google Analytics (env ile) */}
      {/* Google Analytics: consent sonrası yükleme */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}


