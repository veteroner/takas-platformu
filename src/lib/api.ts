import { supabase } from './supabase'
import { logger, trackApiCall } from './logger'
import type { Item } from './supabase'
import type { SeekingPreferences, DbCategory } from '@/types'

// Get items for feed (excluding user's own items)
// NOT excluding swiped items - user can see them again
export async function getFeedItems(userId?: string, limit: number = 500): Promise<Item[]> {
  try {
    // Validate UUID (to avoid passing non-uuid like 'guest' to neq filter)
    const isValidUuid = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

    let query = supabase
      .from('items')
      .select(`
        *,
        owner:users!owner_id (
          id,
          name,
          first_name,
          last_name,
          display_name,
          avatar,
          rating,
          total_trades,
          location
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filter out user's own items from feed
    if (isValidUuid(userId)) {
      query = query.neq('owner_id', userId as string)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching feed items:', error)
    return []
  }
}

// Create new item
export async function createItem(itemData: {
  title: string
  description: string
  category: string
  condition: string
  estimated_value?: number
  images: string[]
  owner_id: string
  location?: string
}): Promise<Item | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating item:', error)
    return null
  }
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, userId: string): Promise<string | null> {
  const end = trackApiCall('POST', 'supabase.storage.upload', { 
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    userId
  })
  
  try {
    logger.info('API', '📤 Starting image upload...', {
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type,
      userId
    })
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    logger.debug('API', 'Generated storage path', { fileName, bucket: 'item-images' })
    
    logger.info('API', '☁️ Uploading to Supabase Storage...')
    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      const errorObj = error as { code?: string; details?: string }
      logger.error('API', '❌ Supabase Storage upload error', error as Error, {
        fileName,
        bucket: 'item-images',
        errorMessage: error.message,
        errorCode: errorObj?.code,
        errorDetails: errorObj?.details
      })
      
      // Show detailed alert on native platform
      if (typeof window !== 'undefined') {
        const w = (window as unknown) as { Capacitor?: { isNativePlatform?: () => boolean } }
        if (w.Capacitor?.isNativePlatform?.()) {
        const errorDetails = `
☁️ SUPABASE UPLOAD HATASI

Hata: ${error.message || 'Bilinmeyen hata'}

Bucket: item-images

Dosya: ${fileName}

Boyut: ${(file.size / 1024).toFixed(2)} KB

Kod: ${errorObj?.code || 'N/A'}

Detay: ${errorObj?.details || 'N/A'}

Çözüm:
1. Supabase Storage'da 'item-images' bucket var mı?
2. Bucket public olarak işaretli mi?
3. Upload policy'ler aktif mi?

Dashboard: app.supabase.com
        `.trim()
        
        alert(errorDetails)
      }
      }

      throw error
    }

    logger.info('API', '✅ Upload successful, getting public URL...', { path: data?.path })

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName)

    logger.info('API', '✅ Image uploaded successfully', {
      publicUrl: publicUrl.substring(0, 50) + '...',
      fullPath: fileName
    })
    
    end()
    return publicUrl
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string }
    const errForLog = new Error(err?.message ?? 'Unknown upload error')
    logger.error('API', '❌ Upload image failed', errForLog, {
      fileName: file.name,
      fileSize: file.size,
      userId,
      errorMessage: err?.message,
      errorCode: err?.code
    })
    end()
    return null
  }
}

// Get user's items
export async function getUserItems(userId: string): Promise<Item[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user items:', error)
    return []
  }
}

// Get seeking preferences (from DB)
export async function getSeekingPreferences(userId: string): Promise<SeekingPreferences | null> {
  try {
    const { data, error } = await supabase
      .from('seeking_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // not found code varies
    if (!data) return null
    return {
      categories: (data.categories || []).map((c: string) => c as DbCategory),
      valueMin: data.value_min ?? undefined,
      valueMax: data.value_max ?? undefined,
      locationCity: data.location_city ?? undefined,
      filters: data.filters ?? undefined,
    }
  } catch (error) {
    console.error('Error fetching seeking preferences:', error)
    return null
  }
}

// Upsert seeking preferences (to DB)
export async function upsertSeekingPreferences(userId: string, prefs: SeekingPreferences): Promise<boolean> {
  try {
    const payload = {
      user_id: userId,
      categories: prefs.categories || [],
      value_min: prefs.valueMin ?? null,
      value_max: prefs.valueMax ?? null,
      location_city: prefs.locationCity ?? null,
      filters: prefs.filters ?? null,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase
      .from('seeking_preferences')
      .upsert(payload, { onConflict: 'user_id' })
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error upserting seeking preferences:', error)
    return false
  }
}

// Record swipe (like, pass, super_like)
export async function recordSwipe(
  userId: string,
  itemId: string,
  direction: 'left' | 'right' | 'up'
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return false

    const response = await fetch('/api/swipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        user_id: userId,
        item_id: itemId,
        direction
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('Swipe API error:', err)
      return false
    }

    return true
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string }
    console.error('Error recording swipe:', err)
    return false
  }
}

// Get user's liked items from database
export async function getUserLikedItems(userId: string): Promise<Item[]> {
  try {
    // Get user's liked swipes with item details via JOIN
    const { data, error } = await supabase
      .from('user_swipes')
      .select(`
        item_id,
        created_at,
        items:item_id (
          id,
          title,
          description,
          images,
          category,
          condition,
          estimated_value,
          location,
          status,
          owner_id,
          created_at
        )
      `)
      .eq('user_id', userId)
      .eq('action', 'like')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching liked items:', error)
      return []
    }
    
    // Filter out deleted/inactive items and flatten structure
    return (data || [])
      .filter(swipe => swipe.items && (swipe.items as unknown as { status: string }).status === 'active')
      .map(swipe => ({
        ...(swipe.items as unknown as Omit<Item, 'isActive'> & { status: string }),
        isActive: (swipe.items as unknown as { status: string }).status === 'active',
        swipedAt: swipe.created_at
      }))
  } catch (error) {
    console.error('Error fetching liked items:', error)
    return []
  }
}

// Get user's passed items from database
export async function getUserPassedItems(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_swipes')
      .select('item_id')
      .eq('user_id', userId)
      .eq('action', 'pass')

    if (error) {
      console.error('Error fetching passed items:', error)
      return []
    }
    
    return (data || []).map(swipe => swipe.item_id)
  } catch (error) {
    console.error('Error fetching passed items:', error)
    return []
  }
}

// Check if swipe created a match
export async function checkForMatch(userId: string, itemId: string): Promise<Record<string, unknown> | null> {
  try {
    // Get the item owner
    const { data: item } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', itemId)
      .single()

    if (!item) return null

    const ownerId = item.owner_id

    // Check if owner swiped right on any of current user's items
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, first_name, last_name, display_name, avatar),
        user2:users!matches_user2_id_fkey(id, name, first_name, last_name, display_name, avatar),
        item1:items!matches_item1_id_fkey(id, title, images),
        item2:items!matches_item2_id_fkey(id, title, images)
      `)
      .or(`and(user1_id.eq.${userId},user2_id.eq.${ownerId}),and(user1_id.eq.${ownerId},user2_id.eq.${userId})`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)

    return matches && matches.length > 0 ? matches[0] : null
  } catch (error) {
    console.error('Error checking for match:', error)
    return null
  }
}

// Create a match between two users
export async function createMatch(user1Id: string, user2Id: string, item1Id: string, item2Id: string): Promise<Record<string, unknown> | null> {
  try {
    // Insert new match
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        user1_id: user1Id,
        user2_id: user2Id,
        item1_id: item1Id,
        item2_id: item2Id,
        status: 'pending'
      }])
      .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, first_name, last_name, display_name, avatar),
        user2:users!matches_user2_id_fkey(id, name, first_name, last_name, display_name, avatar),
        item1:items!matches_item1_id_fkey(id, title, images),
        item2:items!matches_item2_id_fkey(id, title, images)
      `)
      .single()

    if (error) {
      console.error('Error creating match:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating match:', error)
    return null
  }
}

// Enhanced checkForMatch that creates match if mutual like exists
export async function checkAndCreateMatch(userId: string, itemId: string): Promise<Record<string, unknown> | null> {
  try {
    // Check if match already exists between these two users
    // Note: The trigger check_for_match_user_swipes() automatically creates matches
    // when there's a mutual like, so we just need to check if a match exists
    const existingMatch = await checkForMatch(userId, itemId)
    if (existingMatch) {
      return existingMatch
    }

    // No match found yet - trigger will create it automatically if there's a mutual like
    return null
  } catch (error) {
    console.error('Error checking for match:', error)
    return null
  }
}

// Get user matches
export async function getUserMatches(userId: string) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, first_name, last_name, display_name, avatar),
        user2:users!matches_user2_id_fkey(id, name, first_name, last_name, display_name, avatar),
        item1:items!matches_item1_id_fkey(*),
        item2:items!matches_item2_id_fkey(*),
        messages(
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          read
        )
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Her match için en son mesajı al
    const matchesWithLastMessage = (data || []).map(match => {
      const messages = match.messages || []
      // Mesajları tarihe göre sırala (en yeni en üstte)
      const sortedMessages = messages.sort((a: { created_at: string }, b: { created_at: string }) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      return {
        ...match,
        messages: sortedMessages
      }
    })
    
    return matchesWithLastMessage
  } catch (error) {
    console.error('Error fetching matches:', error)
    return []
  }
}

// Get messages for a match
export async function getMatchMessages(matchId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

// Send message - Uses API endpoint to trigger push notifications
export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  content: string
) {
  try {
    // Use API endpoint instead of direct DB insert to trigger push notifications
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      console.error('No session token for sending message')
      return null
    }

    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        match_id: matchId,
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error from message API:', error)
      return null
    }

    const result = await response.json()
    console.log('📨 Mesaj gönderildi, bildirim durumu:', result.notification_sent ? '✅' : '❌')
    return result.message
  } catch (error) {
    console.error('Error sending message:', error)
    return null
  }
}

// Mark messages as read
export async function markMessagesAsRead(matchId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('match_id', matchId)
      .eq('receiver_id', userId)
      .eq('read', false)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return false
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    name: string
    avatar: string
    bio: string
    location: string
  }>
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

// ==========================================
// RATING SYSTEM - Karşılıklı Değerlendirme
// ==========================================

// Match'i tamamla (kullanıcı "Takası Tamamla" butonuna bastığında)
export async function confirmMatchCompletion(matchId: string, userId: string): Promise<{
  success: boolean
  message: string
  showRatingModal: boolean
  bothConfirmed: boolean
}> {
  try {
    const { data, error } = await supabase.rpc('complete_match', {
      p_match_id: matchId,
      p_user_id: userId
    })

    if (error) throw error

    return {
      success: data.success,
      message: data.message,
      showRatingModal: data.show_rating_modal || false,
      bothConfirmed: data.both_confirmed || false
    }
  } catch (error) {
    console.error('Error confirming match completion:', error)
    return {
      success: false,
      message: 'Bir hata oluştu',
      showRatingModal: false,
      bothConfirmed: false
    }
  }
}

// Kullanıcıya puan ver
export async function rateUser(params: {
  raterId: string
  ratedUserId: string
  matchId: string
  rating: number
  comment?: string
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_ratings')
      .insert([{
        rater_id: params.raterId,
        rated_user_id: params.ratedUserId,
        match_id: params.matchId,
        rating: params.rating,
        comment: params.comment || null
      }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error rating user:', error)
    return false
  }
}

// Kullanıcının ortalama puanını al
export async function getUserAverageRating(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_user_average_rating', {
      p_user_id: userId
    })

    if (error) throw error
    return data || 5.0
  } catch (error) {
    console.error('Error getting user average rating:', error)
    return 5.0
  }
}

// Kullanıcının aldığı puan sayısını al
export async function getUserRatingCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_user_rating_count', {
      p_user_id: userId
    })

    if (error) throw error
    return data || 0
  } catch (error) {
    console.error('Error getting user rating count:', error)
    return 0
  }
}

// Kullanıcı bu match'i puanladı mı?
export async function hasUserRatedMatch(userId: string, matchId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('user_has_rated_match', {
      p_user_id: userId,
      p_match_id: matchId
    })

    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Error checking if user rated match:', error)
    return false
  }
}

// Match'te her iki taraf da puanladı mı?
export async function hasMatchBeenFullyRated(matchId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_match_both_rated', {
      p_match_id: matchId
    })

    if (error) throw error
    return data || false
  } catch (error) {
    console.error('Error checking if match fully rated:', error)
    return false
  }
}

// Kullanıcıya verilen puanları al (yorumlarla birlikte)
export async function getUserRatings(userId: string): Promise<Record<string, unknown>[]> {
  try {
    const { data, error } = await supabase
      .from('user_ratings')
      .select(`
        id,
        rating,
        comment,
        created_at,
        rater:rater_id (
          id,
          name,
          avatar_url
        ),
        match:match_id (
          id,
          created_at
        )
      `)
      .eq('rated_user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting user ratings:', error)
    return []
  }
}
