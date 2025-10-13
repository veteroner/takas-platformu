import type { SeekingPreferences } from '@/types'
import { getSeekingPreferences, upsertSeekingPreferences } from './api'
import { supabase } from './supabase'

const SEEKING_PREFS_KEY = 'takas_seeking_preferences'

export function loadSeekingPreferences(): SeekingPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SEEKING_PREFS_KEY)
    return raw ? (JSON.parse(raw) as SeekingPreferences) : null
  } catch {
    return null
  }
}

export function saveSeekingPreferences(prefs: SeekingPreferences) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SEEKING_PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export async function loadSeekingPreferencesAsync(): Promise<SeekingPreferences | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id) {
    const db = await getSeekingPreferences(user.id)
    if (db) return db
  }
  return loadSeekingPreferences()
}

export async function saveSeekingPreferencesAsync(prefs: SeekingPreferences): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id) {
    await upsertSeekingPreferences(user.id, prefs)
  }
  saveSeekingPreferences(prefs)
}
