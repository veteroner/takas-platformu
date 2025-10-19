'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Chat from "@/components/Chat"
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [matchData, setMatchData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const matchId = searchParams.get('match_id')

  useEffect(() => {
    loadChatData()
  }, [matchId])

  const loadChatData = async () => {
    try {
      setIsLoading(true)
      
      // Get current user
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // If match_id provided, load match data
      if (matchId) {
        const { data: match, error } = await supabase
          .from('matches')
          .select(`
            id,
            user1_id,
            user2_id,
            status,
            created_at
          `)
          .eq('id', matchId)
          .single()

        if (error) throw error

        // Get other user ID
        const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id

        // Fetch other user's profile
        const { data: otherUserProfile } = await supabase
          .from('users')
          .select('id, name, avatar_url')
          .eq('id', otherUserId)
          .single()
        
        setMatchData({
          matchId: match.id,
          userId: currentUser.id,
          otherUserId: otherUserId,
          otherUserName: otherUserProfile?.name || 'User',
          otherUserAvatar: otherUserProfile?.avatar_url
        })
      }
    } catch (error) {
      console.error('Error loading chat data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:to-black">
      <div className="w-full max-w-md mx-auto h-screen">
        <Chat 
          matchId={matchData?.matchId}
          userId={matchData?.userId}
          otherUserId={matchData?.otherUserId}
          otherUserName={matchData?.otherUserName}
          otherUserAvatar={matchData?.otherUserAvatar}
        />
      </div>
    </main>
  )
}
