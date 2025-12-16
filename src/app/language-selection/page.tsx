'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import type { i18n as I18nInstance } from 'i18next'
import { Globe, Check } from 'lucide-react'
import { getClientStorageItem, setClientStorageItem } from '@/lib/clientStorage'
import { clearAuthTokens } from '@/lib/auth'

async function waitForI18nReady(instance: I18nInstance): Promise<void> {
  if (instance.isInitialized) return

  await new Promise<void>((resolve) => {
    const handleInitialized = () => {
      instance.off('initialized', handleInitialized)
      resolve()
    }
    instance.on('initialized', handleInitialized)
  })
}

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' }
]

export default function LanguageSelectionPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation('language-selection')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('tr')
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [isI18nReady, setIsI18nReady] = useState<boolean>(i18n.isInitialized)
  const [, forceRender] = useState(0)

  useEffect(() => {
    const handleInitialized = () => {
      setIsI18nReady(true)
      forceRender(v => v + 1)
    }

    const handleLanguageChanged = () => {
      forceRender(v => v + 1)
    }

    if (i18n.isInitialized) setIsI18nReady(true)

    i18n.on('initialized', handleInitialized)
    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('initialized', handleInitialized)
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  useEffect(() => {
    // Auth token'larını temizle (refresh token hatalarını önlemek için)
    clearAuthTokens()

    // İlk açılış kontrolü
    const hasSelectedLanguage = getClientStorageItem('language-selected')
    
    if (hasSelectedLanguage) {
      // Daha önce seçim yapılmış, ana sayfaya yönlendir
      router.replace('/')
    } else {
      setIsFirstTime(true)
      // Mevcut tarayıcı dilini otomatik seç
      const browserLang = navigator.language.split('-')[0]
      if (LANGUAGES.some(lang => lang.code === browserLang)) {
        setSelectedLanguage(browserLang)
        void (async () => {
          try {
            await waitForI18nReady(i18n)
            await i18n.changeLanguage(browserLang)
          } catch {
            // ignore
          }
        })()
      }
    }
  }, [router, i18n])

  const handleLanguageSelect = async (langCode: string) => {
    setSelectedLanguage(langCode)
    // i18n dil değişikliğini yap ve localStorage'a kaydet
    try {
      await waitForI18nReady(i18n)
      await i18n.changeLanguage(langCode)
      setClientStorageItem('i18nextLng', langCode)
      setClientStorageItem('userLanguage', langCode)

      // Robust fallback: if i18n didn't actually switch, reload to re-init from storage.
      const current = (i18n.language || '').toLowerCase().split('-')[0]
      if (current !== langCode) {
        window.location.reload()
        return
      }
    } catch (error) {
      console.error('Language change error:', error)
      // If changeLanguage fails for any reason, reload after persisting selection.
      setClientStorageItem('i18nextLng', langCode)
      setClientStorageItem('userLanguage', langCode)
      window.location.reload()
    }
  }

  const handleContinue = () => {
    // Seçimi kaydet
    setClientStorageItem('language-selected', 'true')
    setClientStorageItem('userLanguage', selectedLanguage)
    setClientStorageItem('i18nextLng', selectedLanguage)
    
    // Ana sayfaya yönlendir
    router.push('/')
  }

  const handleSkip = () => {
    // Varsayılan dil ile devam et
    setClientStorageItem('language-selected', 'true')
    setClientStorageItem('userLanguage', 'tr')
    setClientStorageItem('i18nextLng', 'tr')
    router.push('/')
  }

  if (!isFirstTime || !isI18nReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-linear-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {t('title')}
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {t('subtitle')}
        </p>

        {/* Language Options */}
        <div className="space-y-3 mb-8">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => void handleLanguageSelect(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <span className={`font-medium ${lang.rtl ? 'text-right' : ''}`}>
                  {t(`languages.${lang.code}`, { defaultValue: lang.name })}
                </span>
              </div>
              
              {selectedLanguage === lang.code && (
                <Check className="w-6 h-6" />
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {t('continue')}
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            {t('skip')}
          </button>
        </div>
      </div>
    </div>
  )
}
