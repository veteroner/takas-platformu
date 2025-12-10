import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'
import { verifyAdmin2FAToken } from './admin-2fa'

type VerifiedAdmin = {
  user: {
    id: string
    email: string
  }
  requires2FA?: boolean
}

let cachedAdminClient: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) return null

  cachedAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false }
  })
  return cachedAdminClient
}

export function getAdminEmailAllowlist(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || ''
  return new Set(
    raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
  )
}

export function getAdminUserIdAllowlist(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS || ''
  return new Set(
    raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  )
}

export function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length === 2 && parts[0].toLowerCase() === 'bearer' && parts[1]) {
    return parts[1]
  }
  return null
}

/**
 * Admin isteklerini doğrula (Auth + Admin role + 2FA)
 * NOT: 2FA olmadan sadece auth kontrol etmek için verifyAdminAuth kullanın
 */
export async function verifyAdminRequest(req: NextRequest, options?: { skip2FA?: boolean }): Promise<VerifiedAdmin | null> {
  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) return null

  const token = extractBearerToken(req)
  if (!token) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) return null

  const email = (data.user.email || '').toLowerCase()
  const id = data.user.id

  const emailAllow = getAdminEmailAllowlist()
  const idAllow = getAdminUserIdAllowlist()

  if (emailAllow.size === 0 && idAllow.size === 0) return null

  const isAllowed = (email && emailAllow.has(email)) || (id && idAllow.has(id))
  if (!isAllowed) return null

  // 2FA kontrolü (skip2FA true değilse)
  if (!options?.skip2FA) {
    const twoFAToken = req.headers.get('x-admin-2fa-token')
    if (!twoFAToken || !verifyAdmin2FAToken(twoFAToken, id)) {
      return { user: { id, email }, requires2FA: true }
    }
  }

  return { user: { id, email } }
}

/**
 * Sadece admin auth kontrolü (2FA olmadan)
 * Login, /me ve 2FA endpoint'leri için
 */
export async function verifyAdminAuth(req: NextRequest): Promise<VerifiedAdmin | null> {
  return verifyAdminRequest(req, { skip2FA: true })
}


