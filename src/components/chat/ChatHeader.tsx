'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MoreVertical, User, CheckCircle } from 'lucide-react'

interface ChatHeaderProps {
  otherUser: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  matchStatus: 'active' | 'pending_completion' | 'completed'
  userHasRated: boolean
  isCompletingMatch: boolean
  isBlocked: boolean
  onCompleteMatch: () => void
  onShowBlockReportModal: () => void
  isMobile?: boolean
}

export function ChatHeader({
  otherUser,
  matchStatus,
  userHasRated,
  isCompletingMatch,
  isBlocked,
  onCompleteMatch,
  onShowBlockReportModal,
  isMobile = false
}: ChatHeaderProps) {
  if (isMobile) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 pt-safe">
        <div className="px-4 py-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">{otherUser?.name || 'Kullanıcı'}</h1>
              <p className="text-xs text-gray-500">
                {matchStatus === 'completed' ? '✅ Takas Tamamlandı' : otherUser?.email}
              </p>
            </div>
            {!isBlocked && (
              <button
                onClick={onShowBlockReportModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Seçenekler"
              >
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Takası Tamamla Button */}
          {!isBlocked && matchStatus === 'active' && (
            <button
              onClick={onCompleteMatch}
              disabled={isCompletingMatch}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

          {matchStatus === 'pending_completion' && (
            <div className="w-full bg-yellow-100 border border-yellow-300 rounded-xl py-2.5 px-4 text-sm text-center text-yellow-800">
              ⏳ Diğer tarafın onayı bekleniyor...
            </div>
          )}

          {matchStatus === 'completed' && !userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              ✅ Takas tamamlandı! Lütfen puanlayın.
            </div>
          )}

          {matchStatus === 'completed' && userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              🌟 Takas tamamlandı ve puanlandı!
            </div>
          )}
        </div>
      </header>
    )
  }

  // Desktop Header
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
        {otherUser?.avatar_url ? (
          <Image 
            src={otherUser.avatar_url} 
            alt={otherUser.name} 
            width={48} 
            height={48} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <User className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="flex-1">
        <h2 className="font-bold text-gray-800">{otherUser?.name || 'Kullanıcı'}</h2>
        <p className="text-xs text-gray-500">
          {matchStatus === 'completed' ? '✅ Takas Tamamlandı' : 'Çevrimiçi'}
        </p>
      </div>
    </div>
  )
}
