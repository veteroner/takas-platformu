/**
 * Message Filter Warning Component
 * 
 * Kullanıcılara mesaj engellendiğinde gösterilecek uyarı bileşeni
 */

'use client'

import { AlertCircle, Shield, Ban, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!bannedUntil) return

    const updateTimeRemaining = () => {
      const now = new Date()
      const banEnd = new Date(bannedUntil)
      const diff = banEnd.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining('Ban süresi doldu')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (hours > 24) {
        const days = Math.floor(hours / 24)
        setTimeRemaining(`${days} gün ${hours % 24} saat`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} saat ${minutes} dakika`)
      } else {
        setTimeRemaining(`${minutes} dakika`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [bannedUntil])

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
          {reason || 'Mesajınız uygunsuz içerik nedeniyle gönderilemedi'}
        </p>
        
        {bannedUntil && timeRemaining && (
          <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
            <Clock className="w-4 h-4" />
            <span>Kalan süre: {timeRemaining}</span>
          </div>
        )}
        
        {violationLevel && violationLevel > 0 && (
          <p className="mt-2 text-xs opacity-70">
            İhlal sayısı: {violationLevel}
          </p>
        )}
        
        <p className="mt-2 text-xs opacity-70">
          Platformumuzda saygılı bir dil kullanmanızı rica ederiz. 
          Devam eden ihlaller hesap kısıtlamasına yol açabilir.
        </p>
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Kapat"
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
        setTimeRemaining(`${days} gün ${hours % 24} saat`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} saat ${minutes} dakika`)
      } else {
        setTimeRemaining(`${minutes} dakika`)
      }
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [bannedUntil])

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Ban className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">
            Mesaj gönderme yetkiniz askıya alındı
          </p>
          <p className="text-xs opacity-90 mt-0.5">
            {reason || 'Tekrarlanan ihlaller nedeniyle geçici olarak mesaj gönderemezsiniz.'}
            {timeRemaining && ` • Kalan süre: ${timeRemaining}`}
          </p>
        </div>
        {totalViolations && totalViolations > 0 && (
          <div className="text-right">
            <p className="text-xs opacity-70">İhlal Sayısı</p>
            <p className="text-lg font-bold">{totalViolations}</p>
          </div>
        )}
      </div>
    </div>
  )
}
