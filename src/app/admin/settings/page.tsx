'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Bell, Settings, Shield, Database, Mail, Smartphone, Globe, Zap } from 'lucide-react'

type KV = { key: string; value: string }
type TabType = 'general' | 'notifications' | 'security' | 'system' | 'advanced'

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

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    return token ? { Authorization: `Bearer ${token}` } : {}
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
      } catch (e: any) {
        setError(e?.message || 'Hata')
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const authHeaders = await getAuthHeaders()
      
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
    } catch (e: any) {
      alert('❌ Hata: ' + (e?.message || 'Bilinmeyen hata'))
    } finally {
      setSendingNotification(false)
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
        {activeTab === 'general' && <GeneralSettings />}
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
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'system' && <SystemSettings />}
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
function GeneralSettings() {
  return (
    <div className="space-y-4">
      <SettingCard 
        icon={<Globe className="w-5 h-5" />}
        title="Uygulama Adı"
        description="TakasYap"
        action={<EditButton />}
      />
      <SettingCard 
        icon={<Mail className="w-5 h-5" />}
        title="Destek Email"
        description="support@takasyap.com"
        action={<EditButton />}
      />
      <SettingCard 
        icon={<Smartphone className="w-5 h-5" />}
        title="Minimum App Versiyonu"
        description="iOS: 1.0.0 / Android: 1.0.0"
        action={<EditButton />}
      />
      <SettingCard 
        icon={<Bell className="w-5 h-5" />}
        title="Push Bildirimleri"
        description="Aktif - 2,458 cihaz kayıtlı"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
          </span>
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
function SecuritySettings() {
  return (
    <div className="space-y-4">
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Küfür Filtresi"
        description="Otomatik küfür ve argo kelime engelleme"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Yasadışı İçerik Filtresi"
        description="Uyuşturucu, silah, sahte ürün kontrolü"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="Otomatik Engelleme"
        description="5+ şikayet alan kullanıcılar otomatik engellenir"
        action={
          <span className="px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm font-medium">
            Yapılandırılmamış
          </span>
        }
      />
      <SettingCard 
        icon={<Shield className="w-5 h-5" />}
        title="RLS (Row Level Security)"
        description="Veritabanı satır seviyesi güvenlik"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
          </span>
        }
      />
    </div>
  )
}

// System Settings Component
function SystemSettings() {
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
        description="Supabase Storage - 2.4 GB / 100 GB kullanılıyor"
        action={
          <div className="text-right">
            <div className="text-sm font-medium text-white">2.4%</div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '2.4%' }}></div>
            </div>
          </div>
        }
      />
      <SettingCard 
        icon={<Zap className="w-5 h-5" />}
        title="API Rate Limit"
        description="100 istek/dakika per kullanıcı"
        action={<EditButton />}
      />
      <SettingCard 
        icon={<Globe className="w-5 h-5" />}
        title="CDN"
        description="Cloudflare - Global dağıtım"
        action={
          <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium">
            Aktif
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

// Edit Button Component
function EditButton() {
  return (
    <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium">
      Düzenle
    </button>
  )
}

function Th({ children }: { children: React.ReactNode }) { 
  return <th className="text-left font-semibold px-3 py-2 text-white">{children}</th> 
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) { 
  return <td className={`px-3 py-2 align-top ${className||''}`}>{children}</td> 
}


