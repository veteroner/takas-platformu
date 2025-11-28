'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Report to Sentry
    Sentry.captureException(error)
    // eslint-disable-next-line no-console
    console.error('App error boundary:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-violet-600 text-white p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">Bir şeyler ters gitti</h2>
          <p className="opacity-90 mb-6">Beklenmeyen bir hata oluştu. İstersen tekrar deneyebilirsin.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-50 transition"
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  )
}
