'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import i18n from '@/lib/i18n'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Report to Sentry
    Sentry.captureException(error)
    console.error('App error boundary:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-violet-600 text-white p-6">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-2">{i18n.t('globalError.title', { ns: 'common' })}</h2>
          <p className="opacity-90 mb-6">{i18n.t('globalError.description', { ns: 'common' })}</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-50 transition"
          >
            {i18n.t('globalError.retry', { ns: 'common' })}
          </button>
        </div>
      </body>
    </html>
  )
}
