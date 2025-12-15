'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Globe, Check } from 'lucide-react'

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

  useEffect(() => {
    // i18n'in hazır olmasını bekle
    if (!i18n.isInitialized) return

    // İlk açılış kontrolü
    const hasSelectedLanguage = localStorage.getItem('language-selected')
    
    if (hasSelectedLanguage) {
      // Daha önce seçim yapılmış, ana sayfaya yönlendir
      router.replace('/')
    } else {
      setIsFirstTime(true)
      // Mevcut tarayıcı dilini otomatik seç
      const browserLang = navigator.language.split('-')[0]
      if (LANGUAGES.some(lang => lang.code === browserLang)) {
        setSelectedLanguage(browserLang)
        i18n.changeLanguage(browserLang)
      }
    }
  }, [router, i18n])

  const handleLanguageSelect = async (langCode: string) => {
    setSelectedLanguage(langCode)
    await i18n.changeLanguage(langCode)
    // localStorage'a hemen kaydet
    localStorage.setItem('i18nextLng', langCode)
  }

  const handleContinue = () => {
    // Seçimi kaydet
    localStorage.setItem('language-selected', 'true')
    localStorage.setItem('userLanguage', selectedLanguage)
    localStorage.setItem('i18nextLng', selectedLanguage)
    
    // Ana sayfaya yönlendir
    router.push('/')
  }

  const handleSkip = () => {
    // Varsayılan dil ile devam et
    localStorage.setItem('language-selected', 'true')
    localStorage.setItem('userLanguage', 'tr')
    router.push('/')
  }

  if (!isFirstTime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
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
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <span className={`font-medium ${lang.rtl ? 'text-right' : ''}`}>
                  {lang.name}
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
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
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
