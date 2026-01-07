/**
 * Message Filter Warning Component
 * 
 * Kullanıcılara mesaj engellendiğinde gösterilecek uyarı bileşeni
 */

'use client'

import { AlertCircle, Shield, Ban, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface MessageFilterWarningProps {
  reason?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  bannedUntil?: Date | string
  violationLevel?: number
  onClose?: () => void
}

export function MessageFilterWarning({
  reason,
  severity = 'medium',
  bannedUntil,
  violationLevel = 0,
  onClose
}: MessageFilterWarningProps) {
  const { t } = useTranslation('common')
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!bannedUntil) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const banEnd = new Date(bannedUntil)
      const diff = banEnd.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining(t('messageFilter.banExpired'))
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeRemaining(`${days} ${t('messageFilter.days')} ${hours % 24} ${t('messageFilter.hours')}`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} ${t('messageFilter.hours')} ${minutes} ${t('messageFilter.minutes')}`)
      } else {
        setTimeRemaining(`${minutes} ${t('messageFilter.minutes')}`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [bannedUntil, t])

  const getIcon = () => {
    if (bannedUntil) return <Ban className="w-5 h-5" />
    if (severity === 'critical') return <Shield className="w-5 h-5" />
    return <AlertCircle className="w-5 h-5" />
  }

  const getStyles = () => {
    const baseStyles = "rounded-lg p-4 border-l-4 flex items-start gap-3 animate-in fade-in duration-300"
    
    switch (severity) {
      case 'critical':
        return `${baseStyles} bg-red-50 border-red-500 text-red-900`
      case 'high':
        return `${baseStyles} bg-orange-50 border-orange-500 text-orange-900`
      case 'medium':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-900`
      default:
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-900`
    }
  }

  return (
    <div className={getStyles()}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <p className="font-medium text-sm">
          {reason || t('messageFilter.defaultReason')}
        </p>
        
        {bannedUntil && timeRemaining && (
          <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
            <Clock className="w-4 h-4" />
            <span>{t('messageFilter.remaining')}: {timeRemaining}</span>
          </div>
        )}
        
        {violationLevel && violationLevel > 0 && (
          <p className="mt-2 text-xs opacity-70">
            {t('messageFilter.violationCount')}: {violationLevel}
          </p>
        )}
        
        <p className="mt-2 text-xs opacity-70">
          {t('messageFilter.respectfulNote')}
        </p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

/**
 * Ban Status Banner - Kullanıcı banlıysa sayfa üstünde göster
 */
interface BanStatusBannerProps {
  bannedUntil: Date | string
  reason?: string
  totalViolations?: number
}

export function BanStatusBanner({ 
  bannedUntil, 
  reason, 
  totalViolations 
}: BanStatusBannerProps) {
  const { t } = useTranslation('common')
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date()
      const banEnd = new Date(bannedUntil)
      const diff = banEnd.getTime() - now.getTime()

        if (diff <= 0) {
        window.location.reload() // Ban süresi doldu, sayfayı yenile
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeRemaining(`${days} ${t('messageFilter.days')} ${hours % 24} ${t('messageFilter.hours')}`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} ${t('messageFilter.hours')} ${minutes} ${t('messageFilter.minutes')}`)
      } else {
        setTimeRemaining(`${minutes} ${t('messageFilter.minutes')}`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [bannedUntil, t])

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Ban className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {t('messageFilter.bannedTitle')}
          </p>
          <p className="text-xs opacity-90 mt-0.5">
            {reason || t('messageFilter.bannedDescription')}
            {timeRemaining && ` • ${t('messageFilter.remaining')}: ${timeRemaining}`}
          </p>
        </div>
        {totalViolations && totalViolations > 0 && (
          <div className="text-right">
            <p className="text-xs opacity-70">{t('messageFilter.violationCount')}</p>
            <p className="text-lg font-bold">{totalViolations}</p>
          </div>
        )}
      </div>
    </div>
  )
}
