import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import translation files
import commonTR from '@/locales/tr/common.json'
import settingsTR from '@/locales/tr/settings.json'
import profileTR from '@/locales/tr/profile.json'
import homeTR from '@/locales/tr/home.json'
import myItemsTR from '@/locales/tr/my-items.json'
import uploadTR from '@/locales/tr/upload.json'
import matchesTR from '@/locales/tr/matches.json'
import messagesTR from '@/locales/tr/messages.json'
import notificationsTR from '@/locales/tr/notifications.json'
import preferencesTR from '@/locales/tr/preferences.json'
import loginTR from '@/locales/tr/login.json'
import forgotPasswordTR from '@/locales/tr/forgot-password.json'
import aboutTR from '@/locales/tr/about.json'

import commonEN from '@/locales/en/common.json'
import settingsEN from '@/locales/en/settings.json'
import profileEN from '@/locales/en/profile.json'
import homeEN from '@/locales/en/home.json'
import myItemsEN from '@/locales/en/my-items.json'
import uploadEN from '@/locales/en/upload.json'
import matchesEN from '@/locales/en/matches.json'
import messagesEN from '@/locales/en/messages.json'
import notificationsEN from '@/locales/en/notifications.json'
import preferencesEN from '@/locales/en/preferences.json'
import loginEN from '@/locales/en/login.json'
import forgotPasswordEN from '@/locales/en/forgot-password.json'
import aboutEN from '@/locales/en/about.json'

import commonDE from '@/locales/de/common.json'
import settingsDE from '@/locales/de/settings.json'
import profileDE from '@/locales/de/profile.json'
import homeDE from '@/locales/de/home.json'
import myItemsDE from '@/locales/de/my-items.json'
import uploadDE from '@/locales/de/upload.json'
import matchesDE from '@/locales/de/matches.json'
import messagesDE from '@/locales/de/messages.json'
import notificationsDE from '@/locales/de/notifications.json'
import preferencesDE from '@/locales/de/preferences.json'
import loginDE from '@/locales/de/login.json'
import forgotPasswordDE from '@/locales/de/forgot-password.json'
import aboutDE from '@/locales/de/about.json'

import commonAR from '@/locales/ar/common.json'
import settingsAR from '@/locales/ar/settings.json'
import profileAR from '@/locales/ar/profile.json'
import homeAR from '@/locales/ar/home.json'
import myItemsAR from '@/locales/ar/my-items.json'
import uploadAR from '@/locales/ar/upload.json'
import matchesAR from '@/locales/ar/matches.json'
import messagesAR from '@/locales/ar/messages.json'
import notificationsAR from '@/locales/ar/notifications.json'
import preferencesAR from '@/locales/ar/preferences.json'
import loginAR from '@/locales/ar/login.json'
import forgotPasswordAR from '@/locales/ar/forgot-password.json'
import aboutAR from '@/locales/ar/about.json'

import commonDA from '@/locales/da/common.json'
import settingsDA from '@/locales/da/settings.json'
import profileDA from '@/locales/da/profile.json'
import homeDA from '@/locales/da/home.json'
import myItemsDA from '@/locales/da/my-items.json'
import uploadDA from '@/locales/da/upload.json'
import matchesDA from '@/locales/da/matches.json'
import messagesDA from '@/locales/da/messages.json'
import notificationsDA from '@/locales/da/notifications.json'
import preferencesDA from '@/locales/da/preferences.json'
import loginDA from '@/locales/da/login.json'
import forgotPasswordDA from '@/locales/da/forgot-password.json'
import aboutDA from '@/locales/da/about.json'

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
    'my-items': myItemsTR,
    upload: uploadTR,
    matches: matchesTR,
    messages: messagesTR,
    notifications: notificationsTR,
    preferences: preferencesTR,
    login: loginTR,
    'forgot-password': forgotPasswordTR,
    about: aboutTR,
    'language-selection': languageSelectionTR,
  },
  en: {
    common: commonEN,
    settings: settingsEN,
    profile: profileEN,
    home: homeEN,
    'my-items': myItemsEN,
    upload: uploadEN,
    matches: matchesEN,
    messages: messagesEN,
    notifications: notificationsEN,
    preferences: preferencesEN,
    login: loginEN,
    'forgot-password': forgotPasswordEN,
    about: aboutEN,
    'language-selection': languageSelectionEN,
  },
  de: {
    common: commonDE,
    settings: settingsDE,
    profile: profileDE,
    home: homeDE,
    'my-items': myItemsDE,
    upload: uploadDE,
    matches: matchesDE,
    messages: messagesDE,
    notifications: notificationsDE,
    preferences: preferencesDE,
    login: loginDE,
    'forgot-password': forgotPasswordDE,
    about: aboutDE,
    'language-selection': languageSelectionDE,
  },
  ar: {
    common: commonAR,
    settings: settingsAR,
    profile: profileAR,
    home: homeAR,
    'my-items': myItemsAR,
    upload: uploadAR,
    matches: matchesAR,
    messages: messagesAR,
    notifications: notificationsAR,
    preferences: preferencesAR,
    login: loginAR,
    'forgot-password': forgotPasswordAR,
    about: aboutAR,
    'language-selection': languageSelectionAR,
  },
  da: {
    common: commonDA,
    settings: settingsDA,
    profile: profileDA,
    home: homeDA,
    'my-items': myItemsDA,
    upload: uploadDA,
    matches: matchesDA,
    messages: messagesDA,
    notifications: notificationsDA,
    preferences: preferencesDA,
    login: loginDA,
    'forgot-password': forgotPasswordDA,
    about: aboutDA,
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
