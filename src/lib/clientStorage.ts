'use client'

function getCookieValue(key: string): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const cookie of cookies) {
    const eqIdx = cookie.indexOf('=')
    const k = eqIdx >= 0 ? cookie.slice(0, eqIdx) : cookie
    if (k === key) {
      const v = eqIdx >= 0 ? cookie.slice(eqIdx + 1) : ''
      try {
        return decodeURIComponent(v)
      } catch {
        return v
      }
    }
  }
  return null
}

function setCookieValue(key: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 365): void {
  if (typeof document === 'undefined') return

  const encoded = encodeURIComponent(value)
  document.cookie = `${key}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`
}

export function getClientStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null

  try {
    const v = window.localStorage.getItem(key)
    if (v != null) return v
  } catch {
    // ignore
  }

  return getCookieValue(key)
}

export function setClientStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, value)
    return
  } catch {
    // ignore
  }

  setCookieValue(key, value)
}
