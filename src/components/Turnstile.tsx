'use client'

import { useEffect, useRef, useState } from 'react'

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

export default function Turnstile({
  siteKey,
  onVerify,
  onError,
  theme = 'auto',
  size = 'normal'
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Turnstile script'i yükle
    if (!document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      
      window.onloadTurnstileCallback = () => {
        setIsLoaded(true)
      }
      
      script.onload = () => {
        setIsLoaded(true)
      }
      
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !widgetIdRef.current) {
      // Widget'ı render et
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          onVerify(token)
        },
        'error-callback': () => {
          onError?.()
        },
        theme,
        size
      })
    }
  }, [isLoaded, siteKey, onVerify, onError, theme, size])

  return <div ref={containerRef} />
}
