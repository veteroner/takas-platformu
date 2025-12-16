/**
 * Engelleme ve Şikayet UI Komponentleri
 */

import { useState } from 'react'
import { AlertTriangle, Ban, Flag, X, Shield, MessageSquareOff } from 'lucide-react'
import { useBlockUser, useReportUser } from '@/hooks/useBlockAndReport'
import { REPORT_TYPE_OPTIONS, type ReportType } from '@/constants/reportTypes'

interface BlockReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetUserId: string
  targetUserName: string
  currentUserId: string
  onSuccess?: () => void
}

export function BlockReportModal({
  isOpen,
  onClose,
  targetUserId,
  targetUserName,
  currentUserId,
  onSuccess
}: BlockReportModalProps) {
  const [mode, setMode] = useState<'choose' | 'block' | 'report'>('choose')
  const [blockReason, setBlockReason] = useState('')
  const [reportType, setReportType] = useState<ReportType>('harassment')
  const [reportDescription, setReportDescription] = useState('')
  
  const { blockUser, isBlocking } = useBlockUser()
  const { reportUser, isReporting } = useReportUser()

  if (!isOpen) return null

  const handleBlock = async () => {
    const success = await blockUser(currentUserId, targetUserId, blockReason)
    if (success) {
      alert(`${targetUserName} engellendi. Artık birbirinize mesaj gönderemezsiniz.`)
      onSuccess?.()
      onClose()
    }
  }

  const handleReport = async () => {
    if (!reportDescription.trim()) {
      alert('Lütfen şikayetinizi açıklayın')
      return
    }

    const success = await reportUser(
      currentUserId,
      targetUserId,
      reportType,
      reportDescription
    )

    if (success) {
      alert('Şikayetiniz alındı. Ekibimiz en kısa sürede inceleyecek.')
      onSuccess?.()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {mode === 'choose' && '🛡️ Güvenlik Seçenekleri'}
            {mode === 'block' && '🚫 Kullanıcıyı Engelle'}
            {mode === 'report' && '📢 Şikayet Et'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'choose' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                <span className="font-semibold">{targetUserName}</span> ile ilgili ne yapmak istersiniz?
              </p>

              <button
                onClick={() => setMode('block')}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <Ban className="w-6 h-6 text-orange-600" />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-800">Engelle</h3>
                  <p className="text-sm text-gray-600">
                    Bu kullanıcıdan mesaj alamazsınız
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMode('report')}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
              >
                <Flag className="w-6 h-6 text-red-600" />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-800">Şikayet Et</h3>
                  <p className="text-sm text-gray-600">
                    Uygunsuz davranış bildir
                  </p>
                </div>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                İptal
              </button>
            </div>
          )}

          {mode === 'block' && (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">Engelleme sonuçları:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Birbirinize mesaj gönderemezsiniz</li>
                      <li>Eşleşmeleriniz silinir</li>
                      <li>Ürünlerinizi göremezsiniz</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neden engellemek istiyorsunuz? (Opsiyonel)
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Örn: Rahatsız edici mesajlar gönderiyor"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode('choose')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleBlock}
                  disabled={isBlocking}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBlocking ? 'Engelleniyor...' : 'Engelle'}
                </button>
              </div>
            </div>
          )}

          {mode === 'report' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">
                    Şikayetiniz gizli kalacak ve ekibimiz tarafından incelenecek.
                    Ciddi ihlallerde kullanıcı hesabı askıya alınabilir.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şikayet Türü *
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {REPORT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {reportType && (
                  <p className="mt-1 text-xs text-gray-500">
                    {REPORT_TYPE_OPTIONS.find(opt => opt.value === reportType)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Lütfen durumu detaylı açıklayın..."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  En az 20 karakter yazın
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode('choose')}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Geri
                </button>
                <button
                  onClick={handleReport}
                  disabled={isReporting || reportDescription.length < 20}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReporting ? 'Gönderiliyor...' : 'Şikayet Et'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Engellenmiş kullanıcı bildirimi
 */
export function BlockedUserNotice({ userName }: { userName: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
      <MessageSquareOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 className="font-semibold text-gray-800 mb-1">
        Kullanıcı Engellendi
      </h3>
      <p className="text-sm text-gray-600">
        <span className="font-medium">{userName}</span> ile mesajlaşma engellenmiştir.
      </p>
    </div>
  )
}
