import { supabase } from './supabase'
import type { Item } from './supabase'
import type { SeekingPreferences } from '@/types'

// Get items for feed (excluding user's own items)
// NOT excluding swiped items - user can see them again
export async function getFeedItems(userId?: string, limit: number = 20): Promise<any[]> {
  try {
    // Validate UUID (to avoid passing non-uuid like 'guest' to neq filter)
    const isValidUuid = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

    let query = supabase
      .from('items')
      .select('*')
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
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('item-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('item-images')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
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
      categories: (data.categories || []).map((c: string) => c as any),
      valueMin: data.value_min ?? undefined,
      valueMax: data.value_max ?? undefined,
      locationCity: data.location_city ?? undefined,
      filters: data.filters ?? undefined,
    } as any
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
    // Map direction to action
    const action = direction === 'right' ? 'like' : direction === 'up' ? 'super_like' : 'pass'
    
    // Save to user_swipes table
    const { error } = await supabase
      .from('user_swipes')
      .insert([{ 
        user_id: userId, 
        item_id: itemId, 
        action 
      }])

    // Ignore duplicate entry errors (23505 = unique violation) - user already swiped this item
    if (error && error.code !== '23505') {
      console.error('Error recording swipe:', error)
      return false
    }
    
    return true
  } catch (error: any) {
    // Silently ignore duplicate swipes
    if (error?.code === '23505' || error?.message?.includes('duplicate')) {
      return true
    }
    console.error('Error recording swipe:', error)
    return false
  }
}

// Get user's liked items from database
export async function getUserLikedItems(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_swipes')
      .select(`
        item_id,
        created_at,
        items (
          id,
          title,
          description,
          images,
          category,
          estimated_value,
          city,
          status
        )
      `)
      .eq('user_id', userId)
      .eq('action', 'like')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    // Filter out deleted/inactive items and flatten structure
    return (data || [])
      .filter(swipe => swipe.items && (swipe.items as any).status === 'active')
      .map(swipe => ({
        ...(swipe.items as any),
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

    if (error) throw error
    return (data || []).map(swipe => swipe.item_id)
  } catch (error) {
    console.error('Error fetching passed items:', error)
    return []
  }
}

// Check if swipe created a match
export async function checkForMatch(userId: string, itemId: string): Promise<any | null> {
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
        user1:users!matches_user1_id_fkey(id, name, email),
        user2:users!matches_user2_id_fkey(id, name, email),
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

// Get user matches
export async function getUserMatches(userId: string) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user1:users!matches_user1_id_fkey(id, name, avatar),
        user2:users!matches_user2_id_fkey(id, name, avatar),
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
      const sortedMessages = messages.sort((a: any, b: any) => 
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

// Send message
export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  content: string
) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        match_id: matchId,
        sender_id: senderId,
        receiver_id: receiverId,
        content
      }])
      .select()
      .single()

    if (error) throw error
    return data
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
