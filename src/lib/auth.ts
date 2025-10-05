import { supabase } from './supabase'
import type { User } from './supabase'

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
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get user profile from database
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
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
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
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
