'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit3, MapPin, Phone, Calendar, Star, Package, Gift, Camera, Sparkles, Heart, MessageCircle, User, Plus, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'
import { getUserItems } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import type { Item } from '@/types'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import { UnreadBadge } from '@/components/UnreadBadge'

export default function ProfilePage() {
  const { t } = useTranslation(['profile','common','home','preferences','settings']);
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const [user, setUser] = useState<any>(null)
  const [userItems, setUserItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: ''
  })
  const [stats, setStats] = useState({
    sharedItems: 0,
    receivedItems: 0,
    rating: 0
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)
      
      // Load metadata from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('metadata')
        .eq('id', currentUser.id)
        .single()
      
      const metadata = userData?.metadata || {}
      
      setEditData({
        name: currentUser.name || '',
        bio: metadata.bio || '',
        location: metadata.location || '',
        phone: metadata.phone || ''
      })

      // Load user's items
      const items = await getUserItems(currentUser.id)
      setUserItems(items)
      
      // Load stats from database
      await loadUserStats(currentUser.id)
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserStats = async (userId: string) => {
    try {
      // 1. Count shared items (items table)
      const { count: sharedCount } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId)
        .eq('status', 'active')
      
      // 2. Count received items (completed matches where user received)
      const { count: receivedCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('status', 'completed')
      
      // 3. Get REAL average rating from database
      const { data: avgRating } = await supabase
        .rpc('get_user_average_rating', { p_user_id: userId })
      
      setStats({
        sharedItems: sharedCount || 0,
        receivedItems: receivedCount || 0,
        rating: avgRating || 5.0
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
      // Keep default values on error
      setStats({
        sharedItems: 0,
        receivedItems: 0,
        rating: 5.0
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      // 1. Name'i users tablosuna kaydet
      const updates = {
        name: editData.name
      }
      await updateUserProfile(user.id, updates)
      
      // 2. Bio, location, phone'u metadata'ya kaydet
      const metadata = {
        bio: editData.bio,
        location: editData.location,
        phone: editData.phone
      }
      
      await supabase
        .from('users')
        .update({ metadata })
        .eq('id', user.id)
      
      // 3. Local state'i güncelle
      setUser({ ...user, ...editData, metadata })
      setIsEditing(false)
      alert(t('updateSuccess'))
    } catch (error) {
      console.error('Error updating profile:', error)
      alert(t('updateError'))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  // Profile Content Component - hem desktop hem mobil için
  const ProfileContent = () => (
    <>
      {/* Profile Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 mb-6">
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 mx-auto">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <Camera size={40} />
                </div>
              )}
            </div>
            
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-linear-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Name */}
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editData.name}
              onChange={handleInputChange}
              className="text-2xl font-bold text-white text-center bg-white/10 border border-white/20 rounded-xl px-4 py-2 mt-4 w-full max-w-xs mx-auto focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white mt-4">{user.name}</h1>
          )}

          <p className="text-white/70 mt-1">{user.email}</p>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Edit3 size={16} />
            {t('bio')}
          </h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleInputChange}
              placeholder={t('bioPlaceholder')}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
            />
          ) : (
            <p className="text-white/80 bg-white/5 rounded-xl p-4">
              {editData.bio || user.metadata?.bio || t('noBio')}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="text-white/60" size={20} />
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleInputChange}
                placeholder={t('location')}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            ) : (
              <span className="text-white/80">{editData.location || user.metadata?.location || t('noLocation')}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Phone className="text-white/60" size={20} />
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleInputChange}
                placeholder={t('phone')}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            ) : (
              <span className="text-white/80">{editData.phone || user.metadata?.phone || t('noPhone')}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-white/60" size={20} />
            <span className="text-white/80">{t('joinedAt')}: {new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full py-3 bg-linear-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
          >
            {t('save')}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3">
            <Package size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.sharedItems}</div>
          <div className="text-white/70 text-sm">{t('sharedItems')}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-green-500 to-teal-600 rounded-full mx-auto mb-3">
            <Gift size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.receivedItems}</div>
          <div className="text-white/70 text-sm">{t('receivedItems')}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <div className="flex items-center justify-center w-12 h-12 bg-linear-to-r from-yellow-500 to-orange-600 rounded-full mx-auto mb-3">
            <Star size={24} className="text-white" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.rating.toFixed(1)}</div>
          <div className="text-white/70 text-sm">{t('rating')}</div>
        </div>
      </div>

      {/* User's Items Grid */}
      {userItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-4">{t('myItems')} ({userItems.length})</h2>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
            {userItems.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-colors">
                <div className="aspect-square bg-white/5 relative">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      <Package size={40} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-white/60 text-xs mt-1">{item.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Ratings Section */}
      <div className="mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            {t('ratings')}
          </h3>
          
          {/* Rating Summary */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">
                {stats.rating.toFixed(1)}
              </div>
              <div className="flex gap-1 justify-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(stats.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="text-white/60 text-xs">
                {stats.receivedItems} {t('trades')}
              </div>
            </div>
            
            <div className="flex-1 text-white/70 text-sm">
              {stats.receivedItems === 0 ? (
                <p>{t('ratingMessages.none')}</p>
              ) : stats.rating >= 4.5 ? (
                <p>{t('ratingMessages.excellent')}</p>
              ) : stats.rating >= 4.0 ? (
                <p>{t('ratingMessages.great')}</p>
              ) : stats.rating >= 3.5 ? (
                <p>{t('ratingMessages.good')}</p>
              ) : (
                <p>{t('ratingMessages.improve')}</p>
              )}
            </div>
          </div>

          {/* View All Ratings Button */}
          {stats.receivedItems > 0 && (
            <button
              onClick={() => router.push('/profile/ratings')}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-colors"
            >
              {t('viewAllRatings')} ({stats.receivedItems})
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/preferences"
          className="bg-linear-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 hover:from-yellow-500/30 hover:to-orange-500/30 transition-colors border border-yellow-500/30 text-center"
        >
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-white font-semibold">{t('preferences.title')}</div>
          <div className="text-white/70 text-sm mt-1">{t('preferences.subtitle')}</div>
        </Link>

        <Link
          href="/settings"
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-colors border border-white/20 text-center"
        >
          <div className="text-white font-semibold">{t('settings.title')}</div>
          <div className="text-white/70 text-sm mt-1">{t('settings.account.title')}</div>
        </Link>

        <Link
          href="/my-items"
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-colors border border-white/20 text-center"
        >
          <div className="text-white font-semibold">{t('my-items.title')}</div>
          <div className="text-white/70 text-sm mt-1">{t('my-items.noItemsDesc')}</div>
        </Link>
      </div>
    </>
  )

  // Desktop görünüm
  if (!isMobile) {
    return (
      <DesktopLayout title={t('title')} maxWidth="4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Panel - Profil Bilgileri */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
              >
                <Edit3 size={16} />
                {isEditing ? t('cancel') : t('edit')}
              </button>
            </div>
            <ProfileContent />
          </div>
          
          {/* Sağ Panel - Hızlı Eylemler */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">{t('quickActions') || 'Hızlı Eylemler'}</h3>
              <div className="space-y-3">
                <Link
                  href="/upload"
                  className="flex items-center gap-3 p-3 bg-linear-to-r from-pink-500/20 to-purple-600/20 hover:from-pink-500/30 hover:to-purple-600/30 rounded-xl text-white transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>{t('addItem') || 'Yeni Ürün Ekle'}</span>
                </Link>
                <Link
                  href="/my-items"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <Package className="w-5 h-5" />
                  <span>{t('myItems')}</span>
                </Link>
                <Link
                  href="/matches"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <Gift className="w-5 h-5" />
                  <span>{t('matches.title') || 'Eşleşmelerim'}</span>
                </Link>
                <Link
                  href="/preferences"
                  className="flex items-center gap-3 p-3 bg-linear-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 rounded-xl text-white transition-colors"
                >
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>{t('preferences.title') || 'Eşleştirme Tercihlerim'}</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>{t('settings.title') || 'Ayarlar'}</span>
                </Link>
              </div>
            </div>
            
            {/* İstatistik Özeti */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">{t('activitySummary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-white/80">
                  <span>{t('totalItems')}</span>
                  <span className="font-semibold">{userItems.length}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{t('activeItems')}</span>
                  <span className="font-semibold">{stats.sharedItems}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{t('completedTrades')}</span>
                  <span className="font-semibold">{stats.receivedItems}</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>{t('averageRating')}</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {stats.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesktopLayout>
    )
  }

  // Mobil görünüm

  return (
    <div className="min-h-svh bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      <div className="container mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          {t('home.discover')}
        </Link>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
        >
          <Edit3 size={16} />
          {isEditing ? t('cancel') : t('edit')}
        </button>
      </div>

        <div className="max-w-2xl mx-auto">
          <ProfileContent />
        </div>
      </div>

      {/* Bottom Navigation - Sadece Mobil */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 pb-safe">
          <div className="max-w-md mx-auto flex justify-around items-center pb-2">
            <Link href="/feed" className="flex flex-col items-center py-1 px-3 text-gray-400">
              <Heart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{t('home.discover')}</span>
            </Link>
            {!!user ? (
              <>
                <Link href="/my-items" className="flex flex-col items-center py-1 px-3 text-gray-400">
                  <Package className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">{t('home.myItems') || t('my-items.title')}</span>
                </Link>
                <Link href="/upload" className="flex flex-col items-center py-1 px-3 text-gray-400">
                  <div className="bg-linear-to-r from-pink-500 to-purple-600 p-2 rounded-full -mt-4 shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] mt-0.5">{t('upload.title') || t('home.addItem')}</span>
                </Link>
                <Link href="/messages" className="flex flex-col items-center py-1 px-3 text-gray-400 relative">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">{t('home.messages')}</span>
                  <UnreadBadge userId={user?.id || null} />
                </Link>
                <button className="flex flex-col items-center py-1 px-3 text-purple-600">
                  <User className="w-5 h-5 fill-current" />
                  <span className="text-[10px] mt-0.5 font-medium">{t('home.profile')}</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="flex flex-col items-center py-1 px-3 text-gray-400">
                <LogIn className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{t('home.login')}</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}
