import { supabase } from './supabase'
import type { Item } from './supabase'

// Get items for feed (excluding user's own items and already swiped items)
export async function getFeedItems(userId: string, limit: number = 20): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        owner:users(id, name, avatar_url, rating)
      `)
      .eq('status', 'active')
      .neq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

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

// Record swipe
export async function recordSwipe(
  userId: string,
  itemId: string,
  direction: 'left' | 'right'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('swipes')
      .insert([{ user_id: userId, item_id: itemId, direction }])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error recording swipe:', error)
    return false
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
        item2:items!matches_item2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
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
