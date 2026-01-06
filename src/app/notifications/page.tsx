'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Bell, Heart, MessageCircle, Package, CheckCircle, Trash2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'match' | 'message' | 'like' | 'system' | 'trade_complete' | 'trade_request'
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: {
    itemId?: string
    itemImage?: string
    userId?: string
    userName?: string
    userAvatar?: string
    matchId?: string
    chatId?: string
  }
}

export default function NotificationsPage() {
  const { t } = useTranslation('notifications');
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        // Gerçek bildirimler için: supabase'den çek
        // Şimdilik mock data kullanalım
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'match',
            title: t('newMatch'),
            message: t('matchMessage', { name: 'Ahmet', item: 'Nike Spor Ayakkabı' }),
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            data: {
              userName: 'Ahmet',
              userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmet',
              matchId: 'match-1'
            }
          },
          {
            id: '2',
            type: 'message',
            title: t('newMessage'),
            message: t('messagePreview', { name: 'Zeynep', message: 'Merhaba, ürün hala mevcut mu?' }),
            read: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
            data: {
              userName: 'Zeynep',
              userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zeynep',
              chatId: 'chat-1'
            }
          },
          {
            id: '3',
            type: 'like',
            title: t('itemLiked'),
            message: t('itemLikedMessage', { item: 'Vintage Deri Ceket', count: 5 }),
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            data: {
              itemId: 'item-1',
              itemImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100'
            }
          },
          {
            id: '4',
            type: 'trade_complete',
            title: t('tradeCompleted'),
            message: t('tradeCompletedMessage', { name: 'Mehmet' }),
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            data: {
              userName: 'Mehmet',
              matchId: 'match-2'
            }
          },
          {
            id: '5',
            type: 'system',
            title: t('welcome'),
            message: t('welcomeMessage'),
            read: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          }
        ]

        setNotifications(mockNotifications)
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [router])

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match': return <Heart className="w-5 h-5 text-pink-500" />
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'like': return <Heart className="w-5 h-5 text-red-500" />
      case 'trade_complete': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'trade_request': return <Package className="w-5 h-5 text-purple-500" />
      case 'system': return <Bell className="w-5 h-5 text-gray-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getLink = (notification: Notification): string => {
    switch (notification.type) {
      case 'match':
      case 'trade_complete':
      case 'trade_request':
        return '/matches'
      case 'message':
        return notification.data?.chatId ? `/chat/${notification.data.chatId}` : '/messages'
      case 'like':
        return notification.data?.itemId ? `/item/${notification.data.itemId}` : '/my-items'
      default:
        return '#'
    }
  }

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const NotificationsContent = () => (
    <>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={'px-4 py-2 rounded-full text-sm font-medium transition-colors ' + (filter === 'all' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15')}
          >
            {t('all')} ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={'px-4 py-2 rounded-full text-sm font-medium transition-colors ' + (filter === 'unread' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/15')}
          >
            {t('unread')} ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <Check className="w-4 h-4" />
            {t('markAllRead')}
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-16 h-16 mx-auto text-white/30 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter === 'unread' ? t('noUnread') : t('noNotifications')}
          </h3>
          <p className="text-white/60">
            {filter === 'unread' ? t('allRead') : t('newNotificationsWillAppear')}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const baseClass = 'block bg-white/10 backdrop-blur-lg rounded-2xl p-4 border transition-all hover:bg-white/15';
            const borderClass = notification.read ? 'border-white/10' : 'border-pink-500/50 bg-white/15';
            const linkClass = baseClass + ' ' + borderClass;
            
            const iconBaseClass = 'p-3 rounded-xl';
            const iconBgClass = notification.read ? 'bg-white/10' : 'bg-white/20';
            const iconClass = iconBaseClass + ' ' + iconBgClass;
            
            return (
            <Link
              key={notification.id}
              href={getLink(notification)}
              onClick={() => markAsRead(notification.id)}
              className={linkClass}
            >
              <div className="flex items-start gap-4">
                {/* Icon or Avatar */}
                <div className={iconClass}>
                  {notification.data?.userAvatar ? (
                    <Image
                      src={notification.data.userAvatar}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : notification.data?.itemImage ? (
                    <Image
                      src={notification.data.itemImage}
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded object-cover"
                    />
                  ) : (
                    getIcon(notification.type)
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={'font-semibold ' + (notification.read ? 'text-white/80' : 'text-white')}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-pink-500 rounded-full shrink-0 mt-2"></span>
                    )}
                  </div>
                  <p className={'text-sm mt-1 ' + (notification.read ? 'text-white/50' : 'text-white/70')}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    {formatDistanceToNow(notification.createdAt, { 
                      addSuffix: true, 
                      locale: tr 
                    })}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                  className="p-2 text-white/30 hover:text-white/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </>
  )

  // Desktop Layout
  if (!isMobile) {
    return (
      <DesktopLayout title={t('title')} maxWidth="2xl">
        <NotificationsContent />
      </DesktopLayout>
    )
  }

  // Mobile Layout
  return (
    <div className="h-svh overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      {/* Header */}
      <header className="shrink-0 bg-black/20 backdrop-blur-lg border-b border-white/10 pt-safe">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">{t('title')}</h1>
              {unreadCount > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4">
        <NotificationsContent />
      </div>
    </div>
  )
}
