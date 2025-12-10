/**
 * Admin Panel API Fetch Helper
 * Tüm admin API çağrılarını 2FA token'ı ile zenginleştirir
 */

const ADMIN_2FA_TOKEN_KEY = 'admin_2fa_token'

interface AdminFetchOptions extends RequestInit {
  headers?: Record<string, string>
}

/**
 * 2FA token'ı ile zenginleştirilmiş admin API çağrısı
 */
export async function adminFetch(url: string, options: AdminFetchOptions = {}): Promise<Response> {
  const token2FA = typeof window !== 'undefined' 
    ? localStorage.getItem(ADMIN_2FA_TOKEN_KEY) 
    : null
  
  const headers: Record<string, string> = {
    ...options.headers
  }
  
  if (token2FA) {
    headers['x-admin-2fa-token'] = token2FA
  }
  
  return fetch(url, {
    ...options,
    headers
  })
}

/**
 * Auth header'larını 2FA token'ı ile birleştir
 */
export function getAdminHeaders(authHeaders: Record<string, string> = {}): Record<string, string> {
  const token2FA = typeof window !== 'undefined' 
    ? localStorage.getItem(ADMIN_2FA_TOKEN_KEY) 
    : null
  
  const headers: Record<string, string> = {
    ...authHeaders
  }
  
  if (token2FA) {
    headers['x-admin-2fa-token'] = token2FA
  }
  
  return headers
}

/**
 * 2FA token'ı kaydet
 */
export function setAdmin2FAToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_2FA_TOKEN_KEY, token)
  }
}

/**
 * 2FA token'ı temizle
 */
export function clearAdmin2FAToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_2FA_TOKEN_KEY)
  }
}

/**
 * 2FA token'ı var mı kontrol et
 */
export function hasAdmin2FAToken(): boolean {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(ADMIN_2FA_TOKEN_KEY)
  }
  return false
}
