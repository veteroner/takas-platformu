import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ensure a single client instance across HMR and multiple imports
const globalForSupabase = globalThis as unknown as { __supabaseClient?: SupabaseClient }

export const supabase: SupabaseClient =
  globalForSupabase.__supabaseClient ?? createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.__supabaseClient = supabase
}

// Database Types
export type Item = {
  id: string
  title: string
  description: string
  category: string
  condition: string
  estimated_value?: number
  images: string[]
  owner_id: string
  owner?: User
  created_at: string
  updated_at: string
  status: 'active' | 'traded' | 'deleted'
  location?: string
  views: number
  likes: number
}

export type User = {
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  created_at: string
  rating?: number
  total_trades?: number
}

export type Match = {
  id: string
  user1_id: string
  user2_id: string
  item1_id: string
  item2_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
}

export type Message = {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

export type Swipe = {
  id: string
  user_id: string
  item_id: string
  direction: 'left' | 'right'
  created_at: string
}
