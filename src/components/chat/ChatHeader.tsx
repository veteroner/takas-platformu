'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, MoreVertical, User, CheckCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { ChatHeaderProps } from '@/types/chat'
import { MATCH_STATUS } from '@/constants/chat'

export function ChatHeader({
  otherUser,
  matchStatus,
  isOtherOnline,
  userHasRated,
  isCompletingMatch,
  isBlocked,
  onCompleteMatch,
  onShowBlockReportModal,
  isMobile = false
}: ChatHeaderProps) {
  const { t } = useTranslation('messages')
  
  if (isMobile) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 pt-safe">
        <div className="px-4 py-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900">
                {otherUser?.display_name || otherUser?.first_name || otherUser?.name || t('you')}
              </h1>
              <p className="text-xs text-gray-500">
                {matchStatus === MATCH_STATUS.COMPLETED ? `✅ ${t('statusCompleted')}` : (
                  <span className={`inline-flex items-center gap-1 ${isOtherOnline ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOtherOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {isOtherOnline ? t('online') : t('offline')}
                  </span>
                )}
              </p>
            </div>
            {!isBlocked && (
              <button
                onClick={onShowBlockReportModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={t('blockAndReport')}
              >
                <MoreVertical className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Takası Tamamla Button */}
          {!isBlocked && matchStatus === MATCH_STATUS.ACTIVE && (
            <button
              onClick={onCompleteMatch}
              disabled={isCompletingMatch}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCompletingMatch ? (
                <>
                  <LoadingSpinner size={16} strokeWidth={2} />
                  {t('completing')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t('completeExchange')}
                </>
              )}
            </button>
          )}

          {matchStatus === MATCH_STATUS.PENDING_COMPLETION && (
            <div className="w-full bg-yellow-100 border border-yellow-300 rounded-xl py-2.5 px-4 text-sm text-center text-yellow-800">
              ⏳ {t('statusPending')}
            </div>
          )}

          {matchStatus === MATCH_STATUS.COMPLETED && !userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              ✅ {t('statusCompleted')}! {t('rateUser')}.
            </div>
          )}

          {matchStatus === MATCH_STATUS.COMPLETED && userHasRated && (
            <div className="w-full bg-green-100 border border-green-300 rounded-xl py-2.5 px-4 text-sm text-center text-green-800">
              🌟 {t('statusCompleted')}!
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
        <h2 className="font-bold text-gray-800">
          {otherUser?.display_name || otherUser?.first_name || otherUser?.name || t('you')}
        </h2>
        <p className="text-xs text-gray-500">
          {matchStatus === MATCH_STATUS.COMPLETED ? `✅ ${t('statusCompleted')}` : (isOtherOnline ? t('online') : t('offline'))}
        </p>
      </div>
    </div>
  )
}
