'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, Shield, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DataPrivacyPage() {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExportData = async () => {
    try {
      setIsExporting(true)
      setError(null)

      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Kullanıcı bulunamadı')

      // Kullanıcının tüm verilerini topla
      const [userDataRes, itemsRes, matchesRes, messagesRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('items').select('*').eq('user_id', user.id),
        supabase.from('matches').select('*').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
        supabase.from('messages').select('*').eq('sender_id', user.id)
      ])

      const exportData = {
        export_date: new Date().toISOString(),
        user_info: userDataRes.data,
        items: itemsRes.data || [],
        matches: matchesRes.data || [],
        messages: messagesRes.data || [],
        metadata: {
          total_items: itemsRes.data?.length || 0,
          total_matches: matchesRes.data?.length || 0,
          total_messages: messagesRes.data?.length || 0
        }
      }

      // JSON olarak indir
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url_download = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url_download
      a.download = `takas-platform-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url_download)

      setShowExportModal(false)
    } catch (e: any) {
      setError(e?.message || 'Veri dışa aktarılamadı')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'SİL') {
      setError('Lütfen "SİL" yazarak onaylayın')
      return
    }

    try {
      setIsDeleting(true)
      setError(null)

      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Kullanıcı bulunamadı')

      // Delete user data function çağır
      const { error: deleteError } = await supabase.rpc('delete_user_data', {
        user_id_to_delete: user.id
      })

      if (deleteError) throw deleteError

      // Kullanıcıyı çıkış yaptır
      await supabase.auth.signOut()

      // Ana sayfaya yönlendir
      router.push('/')
    } catch (e: any) {
      setError(e?.message || 'Hesap silinemedi')
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Veri Gizliliği ve Güvenlik</h1>
          </div>
          <p className="text-white/80 text-sm">
            Verilerinizin kontrolü sizde. İstediğiniz zaman verilerinizi dışa aktarabilir veya hesabınızı kalıcı olarak silebilirsiniz.
          </p>
        </div>

        {/* Encryption Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">🔐 Veri Şifreleme</h2>
          <div className="space-y-2 text-sm text-white/80">
            <p>✅ Tüm veri aktarımları HTTPS (TLS 1.3) ile şifrelenir</p>
            <p>✅ Veriler Supabase'de güvenli bir şekilde saklanır</p>
            <p>✅ Şifreler bcrypt ile hash'lenir</p>
            <p>✅ Session token'ları güvenli şekilde yönetilir</p>
          </div>
        </div>

        {/* Export Data */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">📥 Verilerimi İndir</h2>
              <p className="text-sm text-white/70">
                Tüm verilerinizi JSON formatında indirin
              </p>
            </div>
            <Download className="w-6 h-6 text-white/70" />
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Verilerimi Dışa Aktar
          </button>
        </div>

        {/* Delete Account */}
        <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl border border-red-500/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">🗑️ Hesabımı Sil</h2>
              <p className="text-sm text-white/70">
                Hesabınızı ve tüm verilerinizi kalıcı olarak silin
              </p>
            </div>
            <Trash2 className="w-6 h-6 text-red-300" />
          </div>
          
          <div className="bg-red-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/90">
                <p className="font-semibold mb-1">Dikkat! Bu işlem geri alınamaz.</p>
                <p>Silinecek veriler:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-white/70">
                  <li>Profil bilgileriniz</li>
                  <li>Tüm ürünleriniz</li>
                  <li>Tüm mesajlarınız</li>
                  <li>Tüm eşleşmeleriniz</li>
                  <li>Tüm beğenileriniz</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Hesabımı Kalıcı Olarak Sil
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Verilerimi İndir</h3>
            <p className="text-gray-600 mb-6">
              Tüm verileriniz JSON formatında indirilecek. Bu dosyayı güvenli bir yerde saklayın.
            </p>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExportModal(false)
                  setError(null)
                }}
                disabled={isExporting}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isExporting ? 'İndiriliyor...' : 'İndir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h3 className="text-xl font-bold">Hesabı Sil</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Bu işlem <strong>geri alınamaz</strong>. Tüm verileriniz kalıcı olarak silinecek.
            </p>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onaylamak için <strong>"SİL"</strong> yazın:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="SİL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                  setError(null)
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'SİL'}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Siliniyor...' : 'Hesabı Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
