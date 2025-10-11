'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { ArrowLeft, Bell, Shield, Globe, Moon, Sun, Monitor, LogOut, Trash2, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, updatePreferences, logout } = useAuthStore()
  const [settings, setSettings] = useState({
    notifications: true,
    privacy: 'public' as 'public' | 'private',
    language: 'tr' as 'tr' | 'en',
    theme: 'system' as 'light' | 'dark' | 'system'
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (user?.preferences) {
      setSettings(user.preferences)
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    updatePreferences(settings)
    // Persist notif prefs to Supabase
    if (user) {
      supabase.from('notification_prefs').upsert({
        user_id: user.id,
        enabled: settings.notifications,
        frequency: 'daily'
      })
    }
    // Show success message or toast
    alert('Ayarlar kaydedildi!')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    alert('Hesap silme işlemi gerçek uygulamada API çağrısı yapacak')
    setShowDeleteConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Profil
          </Link>
          
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Ayarlar</h1>

          {/* Notification Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Bell size={24} />
              Bildirimler
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Push Bildirimleri</div>
                  <div className="text-white/70 text-sm">Yeni mesajlar ve eşleşmeler için bildirim al</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Shield size={24} />
              Gizlilik
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Profil Görünürlüğü</label>
                <select
                  value={settings.privacy}
                  onChange={(e) => setSettings({...settings, privacy: e.target.value as 'public' | 'private'})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="public" className="bg-purple-600">Herkese Açık</option>
                  <option value="private" className="bg-purple-600">Gizli</option>
                </select>
                <p className="text-white/70 text-sm mt-1">
                  {settings.privacy === 'public' 
                    ? 'Profilin tüm kullanıcılar tarafından görülebilir' 
                    : 'Profilin sadece etkileşimde bulunduğun kişiler tarafından görülebilir'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Globe size={24} />
              Dil
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Uygulama Dili</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value as 'tr' | 'en'})}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <option value="tr" className="bg-purple-600">Türkçe</option>
                  <option value="en" className="bg-purple-600">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Monitor size={24} />
              Tema
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Açık', icon: Sun },
                { value: 'dark', label: 'Koyu', icon: Moon },
                { value: 'system', label: 'Sistem', icon: Monitor }
              ].map((theme) => {
                const Icon = theme.icon
                return (
                  <button
                    key={theme.value}
                    onClick={() => setSettings({...settings, theme: theme.value as any})}
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
            <h2 className="text-xl font-semibold text-white mb-4">Hesap İşlemleri</h2>
            
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-100 px-6 py-3 rounded-xl transition-colors"
              >
                <LogOut size={20} />
                Çıkış Yap
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-100 px-6 py-3 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
                Hesabı Sil
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Hesabı Sil</h3>
              <p className="text-white/80 mb-6">
                Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecek. Emin misiniz?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/20"
                >
                  İptal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
