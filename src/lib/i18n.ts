import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next), 'language-selection'
  .init({
    resources,
    fallbackLng: 'tr',
    defaultNS: 'common',
    ns: ['common', 'settings', 'profile', 'home'],
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false,
    },
  })

export default i18n
