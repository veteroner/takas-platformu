/**
 * Okunmamış Mesaj Badge Komponenti
 */

import { useUnreadMessages } from '@/hooks/useUnreadMessages'

interface UnreadBadgeProps {
  userId: string | null
  className?: string
}

export function UnreadBadge({ userId, className = '' }: UnreadBadgeProps) {
  const { unreadCount, isLoading } = useUnreadMessages(userId)

  if (isLoading || unreadCount === 0) {
    return null
  }

  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}

/**
 * Chat listesi için match badge
 */
import { useUnreadByMatch } from '@/hooks/useUnreadMessages'

interface MatchUnreadBadgeProps {
  matchId: string
  userId: string | null
  className?: string
}

export function MatchUnreadBadge({ matchId, userId, className = '' }: MatchUnreadBadgeProps) {
  const { unreadByMatch, isLoading } = useUnreadByMatch(userId)

  const count = unreadByMatch[matchId] || 0

  if (isLoading || count === 0) {
    return null
  }

  return (
    <span className={`bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
