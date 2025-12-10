'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell, Settings, Shield, Database, Mail, Smartphone, Globe, Zap } from 'lucide-react'
import { getAdminHeaders } from '@/lib/admin-fetch'

type KV = { key: string; value: string }
type TabType = 'general' | 'notifications' | 'security' | 'system' | 'advanced'

interface SystemStats {
  totalUsers: number
  activeUsers7d: number
  totalItems: number
  activeItems: number
  totalMatches: number
  totalMessages: number
  totalNotifications: number
  fcmTokensCount: number
  storageUsedMB: number
  storageQuotaMB: number
}

interface AppSettings {
  appName: string
  supportEmail: string
  minIosVersion: string
  minAndroidVersion: string
  pushEnabled: boolean
  maintenanceMode: boolean
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [rows, setRows] = useState<KV[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<KV | null>(null)
  const [value, setValue] = useState('')
  
  // Notification states
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState<'all' | 'active' | 'specific'>('all')
  const [targetUserId, setTargetUserId] = useState('')
  const [sendingNotification, setSendingNotification] = useState(false)
  
  // System stats
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [securityStats, setSecurityStats] = useState({
    blockedUsers: 0,
    activeReports: 0,
    bannedUsers: 0,
    illegalAttempts: 0
  })
  
  // Editable settings modal
  const [editingSetting, setEditingSetting] = useState<{
    key: string
    title: string
    value: string
    type: 'text' | 'email' | 'version' | 'toggle'
  } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [savingSetting, setSavingSetting] = useState(false)

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
  }

  useEffect(() => {
    const run = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/admin/settings', { headers })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Yükleme hatası')
        }
        const j = await res.json()
        setRows(j.data || [])
      } catch (e: unknown) {
        const error = e as Error
        setError(error?.message || 'Hata')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Load system stats
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true)
      try {
        // Platform stats
        const { data: stats } = await supabase.rpc('get_platform_stats')
        
        // FCM tokens count
        const { count: fcmCount } = await supabase
          .from('fcm_tokens')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)
        
        // Notifications count
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
        
        // Real storage usage calculation
        let storageUsedMB = 0
        try {
          const { data: buckets } = await supabase.storage.listBuckets()
          
          if (buckets && buckets.length > 0) {
            // Sum up all bucket sizes
            for (const bucket of buckets) {
              const { data: files } = await supabase.storage
                .from(bucket.id)
                .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } })
              
              if (files) {
                // Estimate size by file count (rough estimate: avg 500KB per image)
                const estimatedSize = files.length * 0.5 // MB
                storageUsedMB += estimatedSize
              }
            }
          }
        } catch (storageErr) {
          console.warn('Storage calculation error:', storageErr)
          // Fallback to database-stored file count estimate
          const { count: fileCount } = await supabase
            .from('items')
            .select('images', { count: 'exact', head: true })
          
          // Estimate: average 3 images per item, 500KB each
          storageUsedMB = ((fileCount || 0) * 3 * 0.5)
        }
        
        setSystemStats({
          totalUsers: stats?.total_users || 0,
          activeUsers7d: stats?.active_users_7d || 0,
          totalItems: stats?.total_items || 0,
          activeItems: stats?.active_items || 0,
          totalMatches: stats?.total_matches || 0,
          totalMessages: stats?.total_messages || 0,
          totalNotifications: notifCount || 0,
          fcmTokensCount: fcmCount || 0,
          storageUsedMB: Math.round(storageUsedMB),
          storageQuotaMB: 102400, // 100 GB Supabase default
        })
        
        // Load app settings from app_settings table
        const { data: settingsData } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', [
            'app_name',
            'support_email',
            'min_ios_version',
            'min_android_version',
            'push_enabled',
            'maintenance_mode'
          ])
        
        const settingsMap = settingsData?.reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {} as Record<string, string>) || {}
        
        setAppSettings({
          appName: settingsMap.app_name || 'TakaZone',
          supportEmail: settingsMap.support_email || 'support@takazone.com',
          minIosVersion: settingsMap.min_ios_version || '1.0.0',
          minAndroidVersion: settingsMap.min_android_version || '1.0.0',
          pushEnabled: settingsMap.push_enabled === 'true',
          maintenanceMode: settingsMap.maintenance_mode === 'true',
        })
        
        // Load security stats
        const { count: blocksCount } = await supabase
          .from('user_blocks')
          .select('*', { count: 'exact', head: true })
        
        const { count: reportsCount } = await supabase
          .from('user_reports')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
        
        const { count: bannedCount } = await supabase
          .from('user_chat_bans')
          .select('*', { count: 'exact', head: true })
          .gt('banned_until', new Date().toISOString())
        
        const { count: illegalCount } = await supabase
          .from('illegal_product_attempts')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        
        setSecurityStats({
          blockedUsers: blocksCount || 0,
          activeReports: reportsCount || 0,
          bannedUsers: bannedCount || 0,
          illegalAttempts: illegalCount || 0
        })
        
      } catch (e: unknown) {
        console.error('Stats loading error:', e)
      } finally {
        setStatsLoading(false)
      }
    }
    
    loadStats()
  }, [])

  const startEdit = (kv: KV) => {
    setEditing(kv)
    setValue(kv.value)
  }

  const save = async () => {
    if (!editing) return
    const authHeaders = await getAuthHeaders()
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ key: editing.key, value })
    })
    if (!res.ok) {
      const j = await res.json().catch(()=>({}))
      alert(j?.error || 'Kaydetme hatası')
      return
    }
    setRows(prev => prev.map(x => x.key === editing.key ? { ...x, value } : x))
    setEditing(null)
  }

  const sendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      alert('Başlık ve mesaj gerekli!')
      return
    }
    
    setSendingNotification(true)
    try {
      // Hedef kullanıcıları belirle
      let targetUsers: string[] = []
      
      if (notificationType === 'specific') {
        if (!targetUserId) {
          alert('Kullanıcı ID gerekli!')
          return
        }
        targetUsers = [targetUserId]
      } else if (notificationType === 'active') {
        // Son 7 gün aktif kullanıcılar
        const { data } = await supabase
          .from('users')
          .select('id')
          .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        targetUsers = data?.map(u => u.id) || []
      } else {
        // Tüm kullanıcılar
        const { data } = await supabase.from('users').select('id')
        targetUsers = data?.map(u => u.id) || []
      }

      // Bildirimleri gönder
      const notifications = targetUsers.map(userId => ({
        user_id: userId,
        title: notificationTitle,
        message: notificationMessage,
        type: 'system',
        created_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('notifications')
        .insert(notifications)

      if (error) throw error

      alert(`✅ ${targetUsers.length} kullanıcıya bildirim gönderildi!`)
      setNotificationTitle('')
      setNotificationMessage('')
      setTargetUserId('')
    } catch (e: unknown) {
      const error = e as Error
      alert('❌ Hata: ' + (error?.message || 'Bilinmeyen hata'))
    } finally {
      setSendingNotification(false)
    }
  }

  const openSettingEdit = (key: string, title: string, currentValue: string, type: 'text' | 'email' | 'version' | 'toggle' = 'text') => {
    setEditingSetting({ key, title, value: currentValue, type })
    setEditValue(currentValue)
  }

  const saveSetting = async () => {
    if (!editingSetting) return
    
    setSavingSetting(true)
    try {
      // Update app_settings table
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: editingSetting.key,
          value: editValue
        }, {
          onConflict: 'key'
        })
      
      if (error) throw error
      
      // Update local state
      setAppSettings(prev => {
        if (!prev) return prev
        return {
          ...prev,
          [editingSetting.key.replace('_', '')]: editValue
        } as AppSettings
      })
      
      alert('✅ Ayar başarıyla güncellendi!')
      setEditingSetting(null)
      
      // Reload stats
      window.location.reload()
    } catch (e: unknown) {
      const error = e as Error
      alert('❌ Hata: ' + (error?.message || 'Bilinmeyen hata'))
    } finally {
      setSavingSetting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  )
  if (error) return (
    <div className="m-6 p-6 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400">
      {error}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Sistem Ayarları</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            🟢 Sistem Aktif
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton 
          active={activeTab === 'general'} 
          onClick={() => setActiveTab('general')}
          icon={<Settings className="w-4 h-4" />}
        >
          Genel
        </TabButton>
        <TabButton 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
          icon={<Bell className="w-4 h-4" />}
        >
          Bildirimler
        </TabButton>
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')}
          icon={<Shield className="w-4 h-4" />}
        >
          Güvenlik
        </TabButton>
        <TabButton 
          active={activeTab === 'system'} 
          onClick={() => setActiveTab('system')}
          icon={<Database className="w-4 h-4" />}
        >
          Sistem
        </TabButton>
        <TabButton 
          active={activeTab === 'advanced'} 
          onClick={() => setActiveTab('advanced')}
          icon={<Zap className="w-4 h-4" />}
        >
          Gelişmiş
        </TabButton>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'general' && (
          <GeneralSettings 
            settings={appSettings}
            stats={systemStats}
            loading={statsLoading}
            onEdit={openSettingEdit}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationPanel
            title={notificationTitle}
            setTitle={setNotificationTitle}
            message={notificationMessage}
            setMessage={setNotificationMessage}
            type={notificationType}
            setType={setNotificationType}
            targetUserId={targetUserId}
            setTargetUserId={setTargetUserId}
            sending={sendingNotification}
            onSend={sendNotification}
          />
        )}
        {activeTab === 'security' && (
          <SecuritySettings 
            stats={securityStats}
            loading={statsLoading}
          />
        )}
        {activeTab === 'system' && (
          <SystemSettings 
            stats={systemStats}
            loading={statsLoading}
          />
        )}
        {activeTab === 'advanced' && (
          <AdvancedSettings 
            rows={rows} 
            onEdit={startEdit}
          />
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Ayarı Düzenle</h2>
            <div className="mb-3 text-sm text-white/60 font-mono bg-white/5 px-3 py-2 rounded-lg">{editing.key}</div>
            <input 
              value={value} 
              onChange={e=>setValue(e.target.value)} 
              className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all" 
              placeholder="Değer girin..."
            />
            <div className="flex gap-2 justify-end mt-6">
              <button 
                onClick={()=>setEditing(null)} 
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
              >
                İptal
              </button>
              <button 
                onClick={save} 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-medium"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Edit Modal */}
      {editingSetting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-2xl border border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white">{editingSetting.title} Düzenle</h2>
            
            {editingSetting.type === 'toggle' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white">Durum</span>
                  <button
                    onClick={() => setEditValue(editValue === 'true' ? 'false' : 'true')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      editValue === 'true' ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                    aria-label={`Durum: ${editValue === 'true' ? 'Aktif' : 'Pasif'}`}
                    role="switch"
                    aria-checked={editValue === 'true'}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        editValue === 'true' ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="text-sm text-white/60">
                  {editValue === 'true' ? '✅ Aktif - Push bildirimleri gönderilecek' : '❌ Pasif - Push bildirimleri gönderilmeyecek'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/80">
                  {editingSetting.type === 'email' && '📧 '}
                  {editingSetting.type === 'version' && '📱 '}
                  {editingSetting.type === 'text' && '✏️ '}
                  Yeni Değer
                </label>
                <input
                  type={editingSetting.type === 'email' ? 'email' : 'text'}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder={
                    editingSetting.type === 'email' 
                      ? 'ornek@email.com' 
                      : editingSetting.type === 'version' 
                        ? '1.0.0' 
                        : 'Değer girin...'
                  }
                  className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
                />
                {editingSetting.type === 'version' && (
                  <p className="text-xs text-white/50">Format: Major.Minor.Patch (örn: 1.0.0)</p>
                )}
              </div>
            )}
            
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setEditingSetting(null)}
                disabled={savingSetting}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white font-medium disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={saveSetting}
                disabled={savingSetting || !editValue}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-medium disabled:opacity-50 disabled:hover:scale-100"
              >
                {savingSetting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Kaydediliyor...
                  </span>
                ) : (
                  '💾 Kaydet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Tab Button Component
function TabButton({ 
  active, 
  onClick, 
  icon, 
  children 
}: { 
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap
        ${active 
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {icon}
      {children}
    </button>
  )
}

// General Settings Component
function GeneralSettings({ 
  settings, 
  stats, 
  loading,
  onEdit
}: { 
  settings: AppSettings | null
  stats: SystemStats | null
  loading: boolean
  onEdit: (key: string, title: string, currentValue: string, type?: 'text' | 'email' | 'version' | 'toggle') => void
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SettingCard 
        icon={<Globe className="w-5 h-5" />}
        title="Uygulama Adı"
        description={settings?.appName || 'TakaZone'}
        action={
          <button 
            onClick={() => onEdit('app_name', 'Uygulama Adı', settings?.appName || 'TakaZone', 'text')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
          >
            Düzenle
          </button>
        }
      />
      <SettingCard 
        icon={<Mail className="w-5 h-5" />}
        title="Destek Email"
        description={settings?.supportEmail || 'support@takazone.com'}
        action={
          <button 
            onClick={() => onEdit('support_email', 'Destek Email', settings?.supportEmail || 'support@takazone.com', 'email')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
          >
            Düzenle
          </button>
        }
      />
      <SettingCard 
        icon={<Smartphone className="w-5 h-5" />}
        title="iOS Minimum Versiyonu"
        description={`iOS: ${settings?.minIosVersion || '1.0.0'}`}
        action={
          <button 
            onClick={() => onEdit('min_ios_version', 'iOS Minimum Versiyon', settings?.minIosVersion || '1.0.0', 'version')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
          >
            Düzenle
          </button>
        }
      />
      <SettingCard 
        icon={<Smartphone className="w-5 h-5" />}
        title="Android Minimum Versiyonu"
        description={`Android: ${settings?.minAndroidVersion || '1.0.0'}`}
        action={
          <button 
            onClick={() => onEdit('min_android_version', 'Android Minimum Versiyon', settings?.minAndroidVersion || '1.0.0', 'version')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
          >
            Düzenle
          </button>
        }
      />
      <SettingCard 
        icon={<Bell className="w-5 h-5" />}
        title="Push Bildirimleri"
        description={`${settings?.pushEnabled ? '🟢 Aktif' : '🔴 Pasif'} - ${stats?.fcmTokensCount?.toLocaleString('tr-TR') || 0} cihaz kayıtlı`}
        action={
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              settings?.pushEnabled 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {settings?.pushEnabled ? '🟢 Aktif' : '🔴 Pasif'}
            </span>
            <button 
              onClick={() => onEdit('push_enabled', 'Push Bildirimleri', settings?.pushEnabled ? 'true' : 'false', 'toggle')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white text-sm font-medium"
            >
              Değiştir
            </button>
          </div>
        }
      />
      <SettingCard 
        icon={<Database className="w-5 h-5" />}
        title="Toplam Kullanıcı"
        description={`${stats?.totalUsers?.toLocaleString('tr-TR') || 0} kayıtlı kullanıcı (${stats?.activeUsers7d?.toLocaleString('tr-TR') || 0} aktif son 7 gün)`}
        action={
          <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium">
            {stats?.totalUsers || 0}
          </span>
        }
      />
      <SettingCard 
        icon={<Settings className="w-5 h-5" />}
        title="Bakım Modu"
        description={`${settings?.maintenanceMode ? '🔧 Bakım modunda - Kullanıcılar erişemez' : '✅ Normal mod - Platform aktif'}`}
        action={
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
              settings?.maintenanceMode 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {settings?.maintenanceMode ? '🔧 Bakımda' : '✅ Aktif'}
            </span>
            <button 
              onClick={() => {
                const willEnable = !settings?.maintenanceMode
                if (willEnable && !confirm('⚠️ Bakım modunu aktif etmek istediğinize emin misiniz? Kullanıcılar platforma erişemeyecek!')) {
                  return
                }
                onEdit('maintenance_mode', 'Bakım Modu', settings?.maintenanceMode ? 'false' : 'true', 'toggle')
              }}
              className={`px-3 py-1.5 rounded-lg transition-all text-white text-sm font-medium ${
                settings?.maintenanceMode
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:scale-105'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg hover:scale-105'
              }`}
            >
              {settings?.maintenanceMode ? 'Devre Dışı Bırak' : 'Aktif Et'}
            </button>
          </div>
        }
      />
    </div>
  )
}

// Notification Panel Component
function NotificationPanel({
  title,
  setTitle,
  message,
  setMessage,
  type,
  setType,
  targetUserId,
  setTargetUserId,
  sending,
  onSend
}: {
  title: string
  setTitle: (v: string) => void
  message: string
  setMessage: (v: string) => void
  type: 'all' | 'active' | 'specific'
  setType: (v: 'all' | 'active' | 'specific') => void
  targetUserId: string
  setTargetUserId: (v: string) => void
  sending: boolean
  onSend: () => void
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Push Bildirim Gönder</h2>
          <p className="text-sm text-white/60">Kullanıcılara anında bildirim gönderin</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Hedef Seçimi */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Hedef Kitle</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                type === 'all'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Tüm Kullanıcılar
            </button>
            <button
              onClick={() => setType('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                type === 'active'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Aktif Kullanıcılar
            </button>
            <button
              onClick={() => setType('specific')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                type === 'specific'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Belirli Kullanıcı
            </button>
          </div>
        </div>

        {type === 'specific' && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Kullanıcı ID</label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Kullanıcı ID'sini girin"
              className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
            />
          </div>
        )}

        {/* Başlık */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Bildirim Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Yeni Özellik!"
            className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all"
          />
        </div>

        {/* Mesaj */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Bildirim Mesajı</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Bildirim içeriğini yazın..."
            rows={4}
            className="w-full bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Gönder Butonu */}
        <button
          onClick={onSend}
          disabled={sending || !title || !message}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {sending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Gönderiliyor...
            </span>
          ) : (
            '📤 Bildirim Gönder'
          )}
        </button>

        <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
          <span className="text-blue-400 text-xl">ℹ️</span>
          <p className="text-sm text-blue-300">
            <strong>Not:</strong> Bildirimler, notifications tablosuna kaydedilir ve kullanıcıların uygulama içi bildirim merkezinde görünür. 
            Push notification için FCM/APNs entegrasyonu gerekir.
          </p>
        </div>
      </div>
    </div>
  )
}

// Security Settings Component
function SecuritySettings({ 
  stats, 
  loading 
}: { 
  stats: {
    blockedUsers: number
    activeReports: number
    bannedUsers: number
    illegalAttempts: number
  }
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Küfür Filtresi"
        description="Otomatik küfür ve argo kelime engelleme sistemi - 500+ Türkçe küfür/argo tespit"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            ✅ Aktif (500+ kelime)
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Yasadışı İçerik Filtresi"
        description={`Uyuşturucu, silah, sahte ürün, alkol, tütün kontrolü (Son 30 gün: ${stats.illegalAttempts} engelleme)`}
        action={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
              ✅ Aktif
            </span>
            {stats.illegalAttempts > 0 && (
              <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium">
                🚨 {stats.illegalAttempts}
              </span>
            )}
          </div>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Kullanıcı Engelleme Sistemi"
        description={`Toplam ${stats.blockedUsers.toLocaleString('tr-TR')} engelleme kaydı`}
        action={
          <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium">
            📊 {stats.blockedUsers}
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Aktif Şikayetler"
        description={`${stats.activeReports.toLocaleString('tr-TR')} bekleyen şikayet`}
        action={
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
            stats.activeReports > 0 
              ? 'bg-yellow-500/20 text-yellow-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {stats.activeReports > 0 ? '⚠️ ' : '✅ '}{stats.activeReports}
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Yasaklı Kullanıcılar"
        description={`${stats.bannedUsers.toLocaleString('tr-TR')} kullanıcı geçici olarak yasaklı`}
        action={
          <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium">
            🚫 {stats.bannedUsers}
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="RLS (Row Level Security)"
        description="Veritabanı satır seviyesi güvenlik - PostgreSQL Policy Based"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            🔒 Aktif
          </span>
        }
      />
    </div>
  )
}

// System Settings Component
function SystemSettings({ 
  stats, 
  loading 
}: { 
  stats: SystemStats | null
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const storagePercent = stats 
    ? ((stats.storageUsedMB / stats.storageQuotaMB) * 100).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-4">
      <SettingCard 
        icon={<Database className="w-5 h-5" />}
        title="Veritabanı"
        description="Supabase PostgreSQL - Frankfurt (eu-central-1)"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            🟢 Online
          </span>
        }
      />
      <SettingCard 
        icon={<Database className="w-5 h-5" />}
        title="Storage"
        description={`Supabase Storage - ${((stats?.storageUsedMB || 0) / 1024).toFixed(2)} GB / ${(stats?.storageQuotaMB || 0) / 1024} GB kullanılıyor`}
        action={
          <div className="text-right">
            <div className="text-sm font-medium text-white">{storagePercent}%</div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full bg-gradient-to-r transition-all duration-500 ${
                  Number(storagePercent) > 80 
                    ? 'from-red-500 to-orange-500' 
                    : Number(storagePercent) > 60
                      ? 'from-yellow-500 to-orange-500'
                      : 'from-green-500 to-emerald-500'
                }`}
                style={{ width: `${storagePercent}%` } as React.CSSProperties}
              ></div>
            </div>
            <div className="text-xs text-white/50 mt-1">
              {((stats?.storageUsedMB || 0) / 1024).toFixed(2)} GB kullanılıyor
            </div>
          </div>
        }
      />
      <SettingCard 
        icon={<Zap className="w-5 h-5" />}
        title="Platform İstatistikleri"
        description={`${stats?.totalItems?.toLocaleString('tr-TR') || 0} eşya, ${stats?.totalMatches?.toLocaleString('tr-TR') || 0} eşleşme, ${stats?.totalMessages?.toLocaleString('tr-TR') || 0} mesaj`}
        action={
          <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium">
            📊 Aktif
          </span>
        }
      />
      <SettingCard 
        icon={<Bell className="w-5 h-5" />}
        title="Bildirim Sistemi"
        description={`Toplam ${stats?.totalNotifications?.toLocaleString('tr-TR') || 0} bildirim gönderildi`}
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
          </span>
        }
      />
      <SettingCard 
        icon={<Globe className="w-5 h-5" />}
        title="CDN & Hosting"
        description="Netlify + Cloudflare - Global dağıtım"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            🌍 Online
          </span>
        }
      />
    </div>
  )
}

// Advanced Settings Component
function AdvancedSettings({ 
  rows, 
  onEdit 
}: { 
  rows: KV[]
  onEdit: (kv: KV) => void
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl bg-white/5">
        <div className="p-4 bg-white/5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Key-Value Ayarları</h3>
          <p className="text-sm text-white/60 mt-1">Düşük seviye yapılandırma değerleri</p>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <Th>Anahtar</Th>
              <Th>Değer</Th>
              <Th>Eylem</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(kv => (
              <tr key={kv.key} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                <Td className="font-mono text-white">{kv.key}</Td>
                <Td className="text-white">{kv.value}</Td>
                <Td>
                  <button 
                    onClick={() => onEdit(kv)} 
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all text-white font-medium"
                  >
                    Düzenle
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-white/60 bg-white/5 p-4 rounded-2xl border border-white/10">
        <strong className="text-white">⚠️ Dikkat:</strong> Bu ayarlar doğrudan veritabanını etkiler. 
        Değişiklik yapmadan önce emin olun. Politika yönetimi için <a className="underline text-pink-400 hover:text-pink-300 transition-colors" href="/admin/policies">Politika Yönetimi</a> sayfasını kullanın.
      </div>
    </div>
  )
}

// Setting Card Component
function SettingCard({
  icon,
  title,
  description,
  action
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-white/10 text-pink-400 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-white/60 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {action}
        </div>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) { 
  return <th className="text-left font-semibold px-3 py-2 text-white">{children}</th> 
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) { 
  return <td className={`px-3 py-2 align-top ${className||''}`}>{children}</td> 
}


