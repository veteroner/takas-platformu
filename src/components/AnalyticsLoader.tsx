'use client'

import Script from 'next/script'

export default function AnalyticsLoader() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!measurementId) return null

  return (
    <>
      {/* Google Analytics */}
      <Script 
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} 
        strategy="afterInteractive" 
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}


