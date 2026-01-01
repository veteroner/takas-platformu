'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { User, MessageCircle, CheckCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { UserInfoSidebarProps } from '@/types/chat'
import { MATCH_STATUS, STATUS_BADGE_CLASSES } from '@/constants/chat'

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
  const { t } = useTranslation('messages')
  
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
        <h3 className="text-xl font-bold text-gray-800">{otherUser?.name || t('you')}</h3>
        <p className="text-sm text-gray-500">{otherUser?.email}</p>
      </div>

      {/* Match Status */}
      <div className="space-y-3 mb-6">
        <div className={`w-full rounded-xl py-3 px-4 text-sm text-center font-medium ${
          matchStatus === MATCH_STATUS.COMPLETED 
            ? STATUS_BADGE_CLASSES.completed
            : matchStatus === MATCH_STATUS.PENDING_COMPLETION
            ? STATUS_BADGE_CLASSES.pending_completion
            : STATUS_BADGE_CLASSES.active
        }`}>
          {matchStatus === MATCH_STATUS.COMPLETED && `✅ ${t('statusCompleted')}`}
          {matchStatus === MATCH_STATUS.PENDING_COMPLETION && `⏳ ${t('statusPending')}`}
          {matchStatus === MATCH_STATUS.ACTIVE && `💬 ${t('statusActive')}`}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {!isBlocked && matchStatus === MATCH_STATUS.ACTIVE && (
          <button
            onClick={onCompleteMatch}
            disabled={isCompletingMatch}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

        {matchStatus === MATCH_STATUS.COMPLETED && !userHasRated && (
          <button
            onClick={onShowRatingModal}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium text-sm hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
          >
            ⭐ {t('rateUser')}
          </button>
        )}

        {!isBlocked && (
          <button
            onClick={onShowBlockReportModal}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all"
          >
            {t('blockAndReport')}
          </button>
        )}

        <Link 
          href="/messages"
          className="w-full block text-center bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all"
        >
          ← {t('title')}
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MessageCircle className="w-4 h-4" />
          <span>{messageCount} {t('messagesCount')}</span>
        </div>
      </div>
    </div>
  )
}
