import { supabase } from './supabase'
import type { User } from './supabase'

/**
 * Clear all Supabase auth tokens to prevent refresh token errors
 */
export function clearAuthTokens(): void {
  try {
    // Clear localStorage tokens
    if (typeof window !== 'undefined') {
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Clear cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        if (name.trim().includes('sb-') || name.trim().includes('supabase')) {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        }
      })
    }
  } catch (error) {
    console.log('Could not clear auth tokens:', error)
  }
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  created_at: string
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  })

  if (authError) throw authError

  return authData
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Auth hatası varsa null döndür (invalid token vs.)
    if (userError || !user) {
      return null
    }

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      // Profile bulunamazsa temel user bilgilerini döndür
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name || 'User',
        created_at: user.created_at
      }
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar_url,
      created_at: profile.created_at
    }
  } catch (error) {
    // Tüm auth hatalarını yakala ve null döndür
    console.error('Auth error in getCurrentUser:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error

  return data
}

/**
 * Get user's items
 */
export async function getUserItems(userId: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
  .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    // Token geçersizse false döndür
    if (error) {
      console.error('Auth session error:', error)
      return false
    }
    
    return !!session
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'https://takazone.com'}/reset-password`
  })

  if (error) throw error
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}
