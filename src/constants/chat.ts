// Chat UI Constants
export const MESSAGE_BUBBLE_MAX_WIDTH = 384 // max-w-96 = 24rem = 384px
export const AVATAR_SIZE = 32 // w-8 h-8 = 32px
export const SIDEBAR_WIDTH = 384 // w-96 = 384px

// Message Status
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
} as const

// Match Status
export const MATCH_STATUS = {
  ACTIVE: 'active',
  PENDING_COMPLETION: 'pending_completion',
  COMPLETED: 'completed'
} as const

// Badge Styles
export const STATUS_BADGE_CLASSES = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending_completion: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
} as const

// Time Formatting
export const TIME_THRESHOLDS = {
  JUST_NOW: 60, // 1 minute in seconds
  MINUTES: 3600, // 1 hour in seconds
  HOURS: 86400, // 24 hours in seconds
  DAYS: 604800 // 7 days in seconds
} as const

// Message Limits
export const MESSAGE_MAX_LENGTH = 1000
export const MESSAGE_MIN_LENGTH = 1

// Auto-scroll behavior
export const SCROLL_BEHAVIOR = 'smooth' as const
export const SCROLL_TO_BOTTOM_OFFSET = 100 // pixels from bottom to trigger auto-scroll

// Real-time subscription
export const SUBSCRIPTION_CHANNEL_PREFIX = 'messages:'
export const SUBSCRIPTION_EVENTS = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
} as const

// Loading states
export const LOADING_SPINNER_SIZE = 24
export const LOADING_SPINNER_STROKE = 2

// Desktop breakpoint (matches Tailwind's md breakpoint)
export const DESKTOP_BREAKPOINT = 768 // pixels
