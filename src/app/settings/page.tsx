'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Bell, Shield, Globe, Moon, Sun, Monitor, LogOut, Trash2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentUser, type AuthUser } from '@/lib/auth'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useTranslation } from 'react-i18next'
import { 
  getUserSettings, 
  saveUserSettings, 
  getProfileVisibility, 
  updateProfileVisibility,
  updateNotificationPrefs
} from '@/lib/userSettings'
import { applyTheme, useThemeListener } from '@/lib/theme'

export default function SettingsPage() {
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const { t, i18n } = useTranslation(['settings', 'common'])
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    notifications: true,
    privacy: 'public' as 'public' | 'private',
    language: i18n.language as 'tr' | 'en' | 'de' | 'ar' | 'da',
    theme: 'system' as 'light' | 'dark' | 'system'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)
      
      // Supabase'den ayarları yükle
      const [userSettings, visibility] = await Promise.all([
        getUserSettings(currentUser.id),
        getProfileVisibility(currentUser.id)
      ])

      if (userSettings) {
        const loadedSettings = {
          notifications: userSettings.notifications_enabled,
          privacy: visibility,
          language: userSettings.language,
          theme: userSettings.theme
        }
        setSettings(loadedSettings)
        
        // i18n dilini ayarla
        await i18n.changeLanguage(userSettings.language)
        
        // Temayı uygula
        applyTheme(userSettings.theme)
        
        // localStorage'a da kaydet (offline cache)
        localStorage.setItem('userPreferences', JSON.stringify(loadedSettings))
      } else {
        // Ayarlar yoksa localStorage'dan dene
        const savedPrefs = localStorage.getItem('userPreferences')
        if (savedPrefs) {
          try {
            const prefs = JSON.parse(savedPrefs)
            setSettings(prefs)
            await i18n.changeLanguage(prefs.language)
            applyTheme(prefs.theme)
          } catch {
            // Use default settings
          }
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router, i18n])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // Tema değişikliklerini dinle
  useThemeListener(settings.theme)

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('common:loading')}</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    if (!user) return
    
    try {
      // Change i18n language
      await i18n.changeLanguage(settings.language)
      
      // Temayı uygula
      applyTheme(settings.theme)
      
      // Save to localStorage (cache)
      localStorage.setItem('userPreferences', JSON.stringify(settings))
      
      // Supabase'e kaydet
      const [settingsSaved, visibilitySaved, notifSaved] = await Promise.all([
        saveUserSettings({
          user_id: user.id,
          language: settings.language,
          theme: settings.theme,
          notifications_enabled: settings.notifications
        }),
        updateProfileVisibility(user.id, settings.privacy),
        updateNotificationPrefs(user.id, settings.notifications)
      ])

      if (settingsSaved && visibilitySaved && notifSaved) {
        alert(t('settings:success'))
      } else {
        throw new Error('Some settings failed to save')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert(t('settings:error'))
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    alert('Hesap silme işlemi gerçek uygulamada API çağrısı yapacak')
    setShowDeleteConfirm(false)
  }

  // Settings Content Component
  const SettingsContent = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Bell size={24} />
          {t('settings:notifications.title')}
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{t('settings:notifications.push')}</div>
              <div className="text-white/70 text-sm">{t('settings:notifications.pushDesc')}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-green-500 peer-checked:to-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Shield size={24} />
          {t('settings:privacy.title')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">{t('settings:privacy.visibility')}</label>
            <select
              value={settings.privacy}
              onChange={(e) => setSettings({...settings, privacy: e.target.value as 'public' | 'private'})}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="public" className="bg-purple-600">{t('settings:privacy.public')}</option>
              <option value="private" className="bg-purple-600">{t('settings:privacy.private')}</option>
            </select>
            <p className="text-white/70 text-sm mt-1">
              {settings.privacy === 'public' 
                ? t('settings:privacy.publicDesc')
                : t('settings:privacy.privateDesc')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Globe size={24} />
          {t('settings:language.title')}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">{t('settings:language.appLanguage')}</label>
            <select
              value={settings.language}
              onChange={async (e) => {
                const newLang = e.target.value as 'tr' | 'en' | 'de' | 'ar' | 'da'
                setSettings({...settings, language: newLang})
                await i18n.changeLanguage(newLang)
                localStorage.setItem('i18nextLng', newLang)
              }}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="tr" className="bg-purple-600">{t('settings:language.turkish')}</option>
              <option value="en" className="bg-purple-600">{t('settings:language.english')}</option>
              <option value="de" className="bg-purple-600">{t('settings:language.german')}</option>
              <option value="ar" className="bg-purple-600">{t('settings:language.arabic')}</option>
              <option value="da" className="bg-purple-600">{t('settings:language.danish')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
          <Monitor size={24} />
          {t('settings:theme.title')}
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: t('settings:theme.light'), icon: Sun },
            { value: 'dark', label: t('settings:theme.dark'), icon: Moon },
            { value: 'system', label: t('settings:theme.system'), icon: Monitor }
          ].map((theme) => {
            const Icon = theme.icon
            return (
              <button
                key={theme.value}
                onClick={() => {
                  const newTheme = theme.value as 'light' | 'dark' | 'system'
                  setSettings({...settings, theme: newTheme})
                  applyTheme(newTheme)
                  localStorage.setItem('userPreferences', JSON.stringify({...settings, theme: newTheme}))
                }}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  settings.theme === theme.value
                    ? 'border-white bg-white/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon size={24} className="text-white mx-auto mb-2" />
                <div className="text-white text-sm font-medium">{theme.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">{t('settings:account.title')}</h2>
        
        <div className="space-y-3">
          <Link
            href="/data-privacy"
            className="w-full flex items-center justify-center gap-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-100 px-6 py-3 rounded-xl transition-colors"
          >
            <Shield size={20} />
            {t('settings:account.dataPrivacy')}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-100 px-6 py-3 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            {t('settings:account.logout')}
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-100 px-6 py-3 rounded-xl transition-colors"
          >
            <Trash2 size={20} />
            {t('settings:account.deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  )

  // Delete Modal
  const DeleteModal = () => (
    showDeleteConfirm && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">{t('settings:account.deleteAccount')}</h3>
          <p className="text-white/80 mb-6">
            {t('settings:account.deleteConfirm')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
            >
              {t('common:cancel')}
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              {t('common:delete')}
            </button>
          </div>
        </div>
      </div>
    )
  )

  // Desktop görünüm
  if (!isMobile) {
    return (
      <DesktopLayout title={t('settings:title')} maxWidth="2xl" centerContent>
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">{t('settings:title')}</h1>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg"
            >
              <Save size={20} />
              {t('common:save')}
            </button>
          </div>
          <SettingsContent />
        </div>
        <DeleteModal />
      </DesktopLayout>
    )
  }

  // Mobil görünüm

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            {t('profile:title')}
          </Link>
          
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg"
          >
            <Save size={16} />
            {t('common:save')}
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-center mb-8">{t('settings:title')}</h1>
          <SettingsContent />
        </div>

        <DeleteModal />
      </div>
    </div>
  )
}
