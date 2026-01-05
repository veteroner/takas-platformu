// Chat Types
export interface ChatUser {
  id: string
  name: string // DEPRECATED: Geriye uyumluluk için
  first_name?: string
  last_name?: string
  display_name?: string
  avatar_url?: string
  // email alanı KALDIRILDI - KVKK uyumluluğu için
}

export interface ChatMessage {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
  read_at?: string
}

export interface MatchStatus {
  id: string
  status: 'active' | 'pending_completion' | 'completed'
  user1_id: string
  user2_id: string
  user1_confirmed: boolean
  user2_confirmed: boolean
  item1_id: string
  item2_id: string
  created_at: string
  updated_at: string
}

export interface BanDetails {
  banned: boolean
  bannedUntil?: string
  reason?: string
  totalViolations?: number
}

export type MatchStatusType = 'active' | 'pending_completion' | 'completed'

// Component Props Types
export interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
  isSending?: boolean
  filterWarning?: string | null
  onClearWarning?: () => void
  isBlocked?: boolean
  isBanned?: boolean
}

export interface MessageBubbleProps {
  content: string
  senderId: string
  currentUserId: string
  createdAt: string
  read?: boolean
  readAt?: string
  senderAvatar?: string
  senderName?: string
}

export interface UserInfoSidebarProps {
  otherUser: ChatUser
  matchStatus: MatchStatusType
  isOtherOnline?: boolean
  messageCount: number
  isBlocked: boolean
  userHasRated: boolean
  isCompletingMatch: boolean
  onCompleteMatch: () => void
  onShowRatingModal: () => void
  onShowBlockReportModal: () => void
}

export interface ChatHeaderProps {
  otherUser: ChatUser
  matchStatus: MatchStatusType
  isOtherOnline?: boolean
  userHasRated: boolean
  isCompletingMatch: boolean
  isBlocked: boolean
  onCompleteMatch: () => void
  onShowBlockReportModal: () => void
  isMobile?: boolean
}

// API Response Types
export interface FilterResponse {
  allowed: boolean
  reason?: string
  message?: string
  bannedUntil?: string
}

export interface MatchCompletionResult {
  success: boolean
  message: string
  showRatingModal: boolean
  bothConfirmed: boolean
}

export interface RatingSubmission {
  raterId: string
  ratedUserId: string
  matchId: string
  rating: number
  comment?: string
}
