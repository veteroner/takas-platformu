import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import commonTR from '@/locales/tr/common.json'
import settingsTR from '@/locales/tr/settings.json'
import profileTR from '@/locales/tr/profile.json'
import homeTR from '@/locales/tr/home.json'

import commonEN from '@/locales/en/common.json'
import settingsEN from '@/locales/en/settings.json'
import profileEN from '@/locales/en/profile.json'
import homeEN from '@/locales/en/home.json'

import commonDE from '@/locales/de/common.json'
import settingsDE from '@/locales/de/settings.json'
import profileDE from '@/locales/de/profile.json'
import homeDE from '@/locales/de/home.json'

import commonAR from '@/locales/ar/common.json'
import settingsAR from '@/locales/ar/settings.json'
import profileAR from '@/locales/ar/profile.json'
import homeAR from '@/locales/ar/home.json'

import commonDA from '@/locales/da/common.json'
import settingsDA from '@/locales/da/settings.json'
import profileDA from '@/locales/da/profile.json'
import homeDA from '@/locales/da/home.json'

import languageSelectionTR from '@/locales/tr/language-selection.json'
import languageSelectionEN from '@/locales/en/language-selection.json'
import languageSelectionDE from '@/locales/de/language-selection.json'
import languageSelectionAR from '@/locales/ar/language-selection.json'
import languageSelectionDA from '@/locales/da/language-selection.json'

export const resources = {
  tr: {
    common: commonTR,
    settings: settingsTR,
    profile: profileTR,
    home: homeTR,
    'language-selection': languageSelectionTR,
  },
  en: {
    common: commonEN,
    settings: settingsEN,
    profile: profileEN,
    home: homeEN,
    'language-selection': languageSelectionEN,
  },
  de: {
    common: commonDE,
    settings: settingsDE,
    profile: profileDE,
    home: homeDE,
    'language-selection': languageSelectionDE,
  },
  ar: {
    common: commonAR,
    settings: settingsAR,
    profile: profileAR,
    home: homeAR,
    'language-selection': languageSelectionAR,
  },
  da: {
    common: commonDA,
    settings: settingsDA,
    profile: profileDA,
    home: homeDA,
    'language-selection': languageSelectionDA,
  },
} as const

type SupportedLanguage = keyof typeof resources

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['tr', 'en', 'de', 'ar', 'da']

function safeGetCookieValue(key: string): string | null {
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

function safeGetLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function normalizeLanguage(input: string | null | undefined): SupportedLanguage | null {
  if (!input) return null
  const normalized = input.toLowerCase().split('-')[0] as SupportedLanguage
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : null
}

function detectInitialLanguage(): SupportedLanguage {
  // 1) localStorage (may throw on iOS Safari / Private mode)
  const fromLocalStorage = normalizeLanguage(safeGetLocalStorageItem('i18nextLng'))
  if (fromLocalStorage) return fromLocalStorage

  // 2) cookie fallback (works when localStorage is blocked)
  const fromCookie = normalizeLanguage(safeGetCookieValue('i18nextLng'))
  if (fromCookie) return fromCookie

  // 3) browser language
  if (typeof navigator !== 'undefined') {
    const fromNavigator = normalizeLanguage(navigator.language)
    if (fromNavigator) return fromNavigator
  }

  return 'tr'
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: 'tr',
    defaultNS: 'common',
    ns: ['common', 'settings', 'profile', 'home', 'language-selection'],
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    react: {
      useSuspense: false,
    },
  })

export default i18n
