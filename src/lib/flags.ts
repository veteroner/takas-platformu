// Basit feature flag sistemi: app_settings + env fallback
import { supabase } from './supabase'

let cache: Record<string, boolean> | null = null
let lastFetch = 0
const CACHE_MS = 30000

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const now = Date.now()
  if (cache && (now - lastFetch) < CACHE_MS) return cache

  const envFlagsRaw = process.env.NEXT_PUBLIC_FEATURE_FLAGS || ''
  const envFlags: Record<string, boolean> = {}
  envFlagsRaw.split(',').map(f => f.trim()).filter(Boolean).forEach(pair => {
    // format: key or key:true / key:false
    const [k, v] = pair.split(':')
    envFlags[k] = v === undefined ? true : v === 'true'
  })

  try {
    const { data } = await supabase
      .from('app_settings')
      .select('key, value')
      .like('key', 'flag_%')

    const flags: Record<string, boolean> = { ...envFlags }
    for (const row of data || []) {
      const key = row.key.replace('flag_', '')
      flags[key] = row.value === 'true'
    }
    cache = flags
    lastFetch = now
    return flags
  } catch {
    return envFlags
  }
}

export async function isFlagEnabled(name: string): Promise<boolean> {
  const flags = await getFeatureFlags()
  return !!flags[name]
}
