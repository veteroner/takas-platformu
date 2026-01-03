import { supabase } from './supabase'

export interface UserSettings {
  id?: string
  user_id: string
  language: 'tr' | 'en' | 'de' | 'ar' | 'da'
  theme: 'light' | 'dark' | 'system'
  notifications_enabled: boolean
  created_at?: string
  updated_at?: string
}

export interface ProfileVisibility {
  visibility: 'public' | 'private'
}

/**
 * Kullanıcı ayarlarını veritabanından al
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // Ayarlar yoksa default döndür
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return null
  }
}

/**
 * İlk kez giriş yapan kullanıcı için default ayarlar oluştur
 * localStorage'daki dil tercihini kullanır (kullanıcının giriş öncesi seçtiği dil)
 */
export async function createDefaultUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    // localStorage'dan dil tercihini al (kullanıcı giriş öncesi seçmiş olabilir)
    let preferredLanguage: 'tr' | 'en' | 'de' | 'ar' | 'da' = 'tr'
    
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('i18nextLng')
      if (storedLang && ['tr', 'en', 'de', 'ar', 'da'].includes(storedLang)) {
        preferredLanguage = storedLang as 'tr' | 'en' | 'de' | 'ar' | 'da'
      } else {
        // localStorage yoksa browser language kullan
        const browserLang = navigator.language.toLowerCase().split('-')[0]
        if (['tr', 'en', 'de', 'ar', 'da'].includes(browserLang)) {
          preferredLanguage = browserLang as 'tr' | 'en' | 'de' | 'ar' | 'da'
        }
      }
    }

    const defaultSettings: UserSettings = {
      user_id: userId,
      language: preferredLanguage,
      theme: 'system',
      notifications_enabled: true,
    }

    const { data, error } = await supabase
      .from('user_settings')
      .insert(defaultSettings)
      .select()
      .single()

    if (error) throw error
    
    console.log('✅ Default user settings created:', defaultSettings)
    return data
  } catch (error) {
    console.error('Error creating default user settings:', error)
    return null
  }
}

/**
 * Kullanıcı ayarlarını kaydet/güncelle
 */
export async function saveUserSettings(settings: UserSettings): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: settings.user_id,
        language: settings.language,
        theme: settings.theme,
        notifications_enabled: settings.notifications_enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error saving user settings:', error)
    return false
  }
}

/**
 * Profil görünürlüğünü al
 */
export async function getProfileVisibility(userId: string): Promise<'public' | 'private'> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('visibility')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data?.visibility || 'public'
  } catch (error) {
    console.error('Error fetching profile visibility:', error)
    return 'public'
  }
}

/**
 * Profil görünürlüğünü güncelle
 */
export async function updateProfileVisibility(
  userId: string,
  visibility: 'public' | 'private'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ visibility })
      .eq('id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating profile visibility:', error)
    return false
  }
}

/**
 * Bildirim tercihlerini güncelle
 */
export async function updateNotificationPrefs(
  userId: string,
  enabled: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('notification_prefs')
      .upsert({
        user_id: userId,
        enabled,
        frequency: 'daily'
      }, {
        onConflict: 'user_id'
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating notification prefs:', error)
    return false
  }
}
