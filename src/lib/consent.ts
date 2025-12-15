import { supabase } from '@/lib/supabase'

export type ConsentType = 'cookies' | 'privacy' | 'terms'

/**
 * Save user consent to database
 */
export async function saveConsent(
  userId: string,
  consentType: ConsentType,
  version: string = '1.0'
): Promise<boolean> {
  try {
    // Get user's IP and user agent
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null
    
    const { error } = await supabase.from('consents').insert({
      user_id: userId,
      policy_key: consentType,
      version: version,
      accepted_at: new Date().toISOString(),
      user_agent: userAgent
      // IP will be captured by Supabase/Postgres if needed via server-side
    })

    if (error) {
      console.error('Error saving consent:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Failed to save consent:', err)
    return false
  }
}

/**
 * Check if user has given consent
 */
export async function hasConsent(
  userId: string,
  consentType: ConsentType,
  minVersion: string = '1.0'
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('consents')
      .select('version, accepted_at')
      .eq('user_id', userId)
      .eq('policy_key', consentType)
      .gte('version', minVersion)
      .order('accepted_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Get all consents for a user
 */
export async function getUserConsents(userId: string) {
  try {
    const { data, error } = await supabase
      .from('consents')
      .select('*')
      .eq('user_id', userId)
      .order('accepted_at', { ascending: false })

    if (error) {
      console.error('Error fetching consents:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Failed to fetch consents:', err)
    return []
  }
}
