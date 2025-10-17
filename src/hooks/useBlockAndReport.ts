/**
 * React Hooks: Kullanıcı Engelleme ve Şikayet
 */

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { type ReportType } from '@/constants/reportTypes'

interface BlockedUser {
  blockId: string
  userId: string
  name: string
  avatar?: string
  reason?: string
  blockedAt: string
}

/**
 * Kullanıcı engelleme hook'u
 */
export function useBlockUser() {
  const [isBlocking, setIsBlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const blockUser = useCallback(async (
    blockerId: string,
    blockedId: string,
    reason?: string
  ): Promise<boolean> => {
    setIsBlocking(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc('block_user', {
        p_blocker_id: blockerId,
        p_blocked_id: blockedId,
        p_reason: reason || null
      })

      if (error) throw error

      return true
    } catch (err: any) {
      console.error('Block user error:', err)
      setError(err.message || 'Kullanıcı engellenemedi')
      return false
    } finally {
      setIsBlocking(false)
    }
  }, [])

  const unblockUser = useCallback(async (
    blockerId: string,
    blockedId: string
  ): Promise<boolean> => {
    setIsBlocking(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('user_blocks')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', blockedId)

      if (error) throw error

      return true
    } catch (err: any) {
      console.error('Unblock user error:', err)
      setError(err.message || 'Engel kaldırılamadı')
      return false
    } finally {
      setIsBlocking(false)
    }
  }, [])

  const isUserBlocked = useCallback(async (
    user1Id: string,
    user2Id: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_user_blocked', {
        p_user1_id: user1Id,
        p_user2_id: user2Id
      })

      if (error) throw error

      return data || false
    } catch (err: any) {
      console.error('Check block status error:', err)
      return false
    }
  }, [])

  return {
    blockUser,
    unblockUser,
    isUserBlocked,
    isBlocking,
    error
  }
}

/**
 * Engellenmiş kullanıcıları listeleme hook'u
 */
export function useBlockedUsers(userId: string | null) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlockedUsers = useCallback(async () => {
    if (!userId) {
      setBlockedUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc('get_blocked_users', {
        p_user_id: userId
      })

      if (error) throw error

      const formatted: BlockedUser[] = (data || []).map((item: any) => ({
        blockId: item.block_id,
        userId: item.blocked_user_id,
        name: item.blocked_user_name,
        avatar: item.blocked_user_avatar,
        reason: item.reason,
        blockedAt: item.blocked_at
      }))

      setBlockedUsers(formatted)
    } catch (err: any) {
      console.error('Fetch blocked users error:', err)
      setError(err.message || 'Engellenen kullanıcılar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchBlockedUsers()
  }, [fetchBlockedUsers])

  return {
    blockedUsers,
    isLoading,
    error,
    refetch: fetchBlockedUsers
  }
}

/**
 * Kullanıcı şikayet etme hook'u
 */
export function useReportUser() {
  const [isReporting, setIsReporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reportUser = useCallback(async (
    reporterId: string,
    reportedId: string,
    reportType: ReportType,
    description: string,
    evidence?: any
  ): Promise<boolean> => {
    setIsReporting(true)
    setError(null)

    try {
      const { data, error } = await supabase.rpc('create_user_report', {
        p_reporter_id: reporterId,
        p_reported_id: reportedId,
        p_report_type: reportType,
        p_description: description,
        p_evidence: evidence || null
      })

      if (error) throw error

      return true
    } catch (err: any) {
      console.error('Report user error:', err)
      setError(err.message || 'Şikayet gönderilemedi')
      return false
    } finally {
      setIsReporting(false)
    }
  }, [])

  return {
    reportUser,
    isReporting,
    error
  }
}
