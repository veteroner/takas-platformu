/**
 * React Hooks: Mesaj Bildirimleri
 */

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface UnreadByMatch {
  matchId: string
  unreadCount: number
  lastMessageAt: string
}

/**
 * Okunmamış mesaj sayısı hook'u
 */
export function useUnreadMessages(userId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) {
      setUnreadCount(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.rpc('get_unread_message_count', {
        p_user_id: userId
      })

      if (error) throw error

      setUnreadCount(data || 0)
    } catch (err: any) {
      console.error('Fetch unread count error:', err)
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    fetchUnreadCount()

    // Subscribe to new messages
    const subscription = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        () => {
          fetchUnreadCount()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, fetchUnreadCount])

  return {
    unreadCount,
    isLoading,
    refetch: fetchUnreadCount
  }
}

/**
 * Match başına okunmamış mesaj sayısı hook'u
 */
export function useUnreadByMatch(userId: string | null) {
  const [unreadByMatch, setUnreadByMatch] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchUnreadByMatch = useCallback(async () => {
    if (!userId) {
      setUnreadByMatch({})
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.rpc('get_unread_by_match', {
        p_user_id: userId
      })

      if (error) throw error

      const unreadMap: Record<string, number> = {}
      ;(data || []).forEach((item: any) => {
        unreadMap[item.match_id] = item.unread_count
      })

      setUnreadByMatch(unreadMap)
    } catch (err: any) {
      console.error('Fetch unread by match error:', err)
      setUnreadByMatch({})
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    fetchUnreadByMatch()

    // Subscribe to message changes
    const subscription = supabase
      .channel('unread-by-match')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        () => {
          fetchUnreadByMatch()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, fetchUnreadByMatch])

  return {
    unreadByMatch,
    isLoading,
    refetch: fetchUnreadByMatch
  }
}

/**
 * Mesajı okundu olarak işaretle
 */
export function useMarkAsRead() {
  const [isMarking, setIsMarking] = useState(false)

  const markAsRead = useCallback(async (messageId: string): Promise<boolean> => {
    setIsMarking(true)

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)

      if (error) throw error

      return true
    } catch (err: any) {
      console.error('Mark as read error:', err)
      return false
    } finally {
      setIsMarking(false)
    }
  }, [])

  const markMatchAsRead = useCallback(async (
    matchId: string,
    userId: string
  ): Promise<boolean> => {
    setIsMarking(true)

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('match_id', matchId)
        .eq('receiver_id', userId)
        .eq('read', false)

      if (error) throw error

      return true
    } catch (err: any) {
      console.error('Mark match as read error:', err)
      return false
    } finally {
      setIsMarking(false)
    }
  }, [])

  return {
    markAsRead,
    markMatchAsRead,
    isMarking
  }
}
