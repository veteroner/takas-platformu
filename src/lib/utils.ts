import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatRelativeTime(date: Date, locale?: string): string {
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  const seconds = Math.round(diff / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  const userLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'tr')
  const rtf = new Intl.RelativeTimeFormat(userLocale, { numeric: 'auto' })

  if (Math.abs(seconds) < 45) return rtf.format(seconds, 'second')
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  return rtf.format(days, 'day')
}

export function formatPublicName(name: string, locale: string = 'tr-TR'): string {
  const raw = (name || '').trim()
  if (!raw) return ''

  const parts = raw.split(/\s+/).filter(Boolean)
  const first = parts[0]
  const firstFormatted = first.charAt(0).toLocaleUpperCase(locale) + first.slice(1)
  if (parts.length === 1) return firstFormatted

  const lastInitial = parts[parts.length - 1].charAt(0).toLocaleUpperCase(locale)
  return `${firstFormatted} ${lastInitial}.`
}

type NameLike = {
  name?: string
  displayName?: string
  firstName?: string
  lastName?: string
  display_name?: string
  first_name?: string
  last_name?: string
}

export function getPublicUserName(user?: NameLike | null, locale: string = 'tr-TR'): string {
  if (!user) return ''

  const firstName = (user.firstName ?? user.first_name ?? '').trim()
  const lastName = (user.lastName ?? user.last_name ?? '').trim()
  const displayName = (user.displayName ?? user.display_name ?? '').trim()
  const fallbackName = (user.name ?? '').trim()

  if (firstName) {
    const firstFormatted = firstName.charAt(0).toLocaleUpperCase(locale) + firstName.slice(1)
    if (lastName) {
      const lastInitial = lastName.charAt(0).toLocaleUpperCase(locale)
      return `${firstFormatted} ${lastInitial}.`
    }
    return firstFormatted
  }

  if (displayName) return formatPublicName(displayName, locale)
  if (fallbackName) return formatPublicName(fallbackName, locale)
  return ''
}
