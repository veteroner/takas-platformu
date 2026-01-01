'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User, MessageCircle, CheckCircle } from 'lucide-react'

interface UserInfoSidebarProps {
  otherUser: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  matchStatus: 'active' | 'pending_completion' | 'completed'
  messageCount: number
  isBlocked: boolean
  userHasRated: boolean
  isCompletingMatch: boolean
  onCompleteMatch: () => void
  onShowRatingModal: () => void
  onShowBlockReportModal: () => void
}

export function UserInfoSidebar({
  otherUser,
  matchStatus,
  messageCount,
  isBlocked,
  userHasRated,
  isCompletingMatch,
  onCompleteMatch,
  onShowRatingModal,
  onShowBlockReportModal
}: UserInfoSidebarProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-6 sticky top-24">
      {/* User Profile */}
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          {otherUser?.avatar_url ? (
            <Image 
              src={otherUser.avatar_url} 
              alt={otherUser.name} 
              width={96} 
              height={96} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{otherUser?.name || 'Kullanıcı'}</h3>
        <p className="text-sm text-gray-500">{otherUser?.email}</p>
      </div>

      {/* Match Status */}
      <div className="space-y-3 mb-6">
        <div className={`w-full rounded-xl py-3 px-4 text-sm text-center font-medium ${
          matchStatus === 'completed' 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : matchStatus === 'pending_completion'
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {matchStatus === 'completed' && '✅ Takas Tamamlandı'}
          {matchStatus === 'pending_completion' && '⏳ Onay Bekleniyor'}
          {matchStatus === 'active' && '💬 Aktif Sohbet'}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isBlocked && matchStatus === 'active' && (
          <button
            onClick={onCompleteMatch}
            disabled={isCompletingMatch}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCompletingMatch ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İşleniyor...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Takası Tamamla
              </>
            )}
          </button>
        )}

        {matchStatus === 'completed' && !userHasRated && (
          <button
            onClick={onShowRatingModal}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
          >
            ⭐ Puanla
          </button>
        )}

        {!isBlocked && (
          <button
            onClick={onShowBlockReportModal}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all"
          >
            Engelle / Şikayet Et
          </button>
        )}

        <Link 
          href="/messages"
          className="w-full block text-center bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
        >
          ← Tüm Mesajlar
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MessageCircle className="w-4 h-4" />
          <span>{messageCount} mesaj</span>
        </div>
        <p className="text-xs text-gray-400">
          Takaslarınızı güvenle tamamlayın. Şüpheli durumları bildirin.
        </p>
      </div>
    </div>
  )
}
