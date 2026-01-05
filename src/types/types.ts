// Types for the exchange platform

export interface User {
  id: string
  email: string
  name: string // DEPRECATED: Geriye uyumluluk için tutuldu, kullanmayın
  firstName?: string // YENİ: Kullanıcının adı
  lastName?: string // YENİ: Kullanıcının soyadı (özel, gösterilmez)
  displayName?: string // YENİ: Gösterim adı (firstName veya kullanıcı tanımlı)
  avatar?: string
  location?: {
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  rating: number
  totalTrades: number
  joinedAt: Date
  preferences: {
    categories: CategoryType[]
    maxDistance: number
    ageRange: {
      min: number
      max: number
    }
  }
  metadata?: {
    bio?: string
    location?: string
    phone?: string
  }
}

export enum CategoryType {
  CLOTHING_WOMEN = 'clothing_women',
  CLOTHING_MEN = 'clothing_men',
  CLOTHING_KIDS = 'clothing_kids',
  TOYS_BABY = 'toys_baby',
  TOYS_KIDS = 'toys_kids',
  TOYS_EDUCATIONAL = 'toys_educational',
  ACCESSORIES = 'accessories',
  SHOES = 'shoes',
  BOOKS = 'books',
  ELECTRONICS = 'electronics'
}

export enum ItemCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export interface Item {
  id: string
  title: string
  description: string
  category: CategoryType
  condition: ItemCondition
  size?: string
  brand?: string
  color: string[]
  images: string[]
  ownerId: string
  owner: User
  estimatedValue: number
  createdAt: Date
  isActive: boolean
  location: {
    city: string
    country: string
  }
  tags: string[]
}

export interface SwipeAction {
  itemId: string
  userId: string
  action: 'like' | 'pass'
  timestamp: Date
}

export interface Match {
  id: string
  user1Id: string
  user2Id: string
  item1Id: string
  item2Id: string
  createdAt: Date
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  messages: Message[]
}

export interface Message {
  id: string
  matchId: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'trade_offer' | 'system'
}

export interface TradeOffer {
  id: string
  matchId: string
  offeredItemId: string
  requestedItemId: string
  offererId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  message?: string
  createdAt: Date
  expiresAt: Date
}

// Component Props Types
export interface SwipeCardProps {
  item: Item
  onSwipe: (direction: 'left' | 'right', item: Item) => void
  onCardClick?: (item: Item) => void
}

export interface ItemCardProps {
  item: Item
  variant?: 'swipe' | 'grid' | 'list'
  showOwner?: boolean
  className?: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form Types
export interface CreateItemForm {
  title: string
  description: string
  category: CategoryType
  condition: ItemCondition
  size?: string
  brand?: string
  colors: string[]
  images: File[]
  tags: string[]
  estimatedValue: number
}

export interface UserPreferencesForm {
  categories: CategoryType[]
  maxDistance: number
  ageRange: {
    min: number
    max: number
  }
}

// Store Types
export interface SwipeStore {
  currentItems: Item[]
  currentIndex: number
  matches: Match[]
  likedItems: Item[]
  passedItems: Item[]
  isLoading: boolean
  error: string | null
  
  // Actions
  loadItems: () => Promise<void>
  swipeItem: (direction: 'left' | 'right', item: Item) => void
  nextItem: () => void
  resetStack: () => void
}
