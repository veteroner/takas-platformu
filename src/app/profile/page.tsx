'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit3, MapPin, Phone, Calendar, Star, Package, Gift, Camera } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'
import { getUserItems } from '@/lib/api'
import type { Item } from '@/types'
import RewardedAdButton from '@/components/RewardedAdButton'
import { AdMobRewardItem } from '@capacitor-community/admob'

export default function ProfilePage() {
  const router = useRouter()
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
  const [extraSwipes, setExtraSwipes] = useState(0)

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
      setEditData({
        name: currentUser.name || '',
        bio: '',
        location: '',
        phone: ''
      })

      // Load user's items
      const items = await getUserItems(currentUser.id)
      setUserItems(items)
    } catch (error) {
      console.error('Error loading user data:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      await updateUserProfile(user.id, editData)
      setUser({ ...user, ...editData })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Profil güncellenirken hata oluştu')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    })
  }

  const handleRewardEarned = (reward: AdMobRewardItem) => {
    // Kullanıcıya ekstra swipe hakkı ver
    setExtraSwipes(prev => prev + 10)
    alert(`🎉 Tebrikler! ${reward.amount} ${reward.type} kazandınız! +10 ekstra swipe hakkı`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Ana Sayfa
          </Link>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors backdrop-blur-sm border border-white/20"
          >
            <Edit3 size={16} />
            {isEditing ? 'İptal' : 'Düzenle'}
          </button>
        </div>

        <div className="max-w-2xl mx-auto">
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
                  <button className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
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
                Hakkımda
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleInputChange}
                  placeholder="Kendinizden bahsedin..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                />
              ) : (
                <p className="text-white/80 bg-white/5 rounded-xl p-4">
                  {user.bio || 'Henüz bir bio eklenmemiş.'}
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
                    placeholder="Konum"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                ) : (
                  <span className="text-white/80">{user.location || 'Konum belirtilmemiş'}</span>
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
                    placeholder="Telefon"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                ) : (
                  <span className="text-white/80">{user.phone || 'Telefon belirtilmemiş'}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-white/60" size={20} />
                <span className="text-white/80">Katılım: {new Date(user.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                Değişiklikleri Kaydet
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3">
                <Package size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{userItems.length}</div>
              <div className="text-white/70 text-sm">Paylaşılan Eşya</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mx-auto mb-3">
                <Gift size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-white/70 text-sm">Alınan Eşya</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mx-auto mb-3">
                <Star size={24} className="text-white" />
              </div>
              <div className="text-2xl font-bold text-white">5.0</div>
              <div className="text-white/70 text-sm">Değerlendirme</div>
            </div>
          </div>

          {/* User's Items Grid */}
          {userItems.length > 0 && (
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold mb-4">Eşyalarım ({userItems.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userItems.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
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

          {/* Rewarded Ad Button */}
          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-3 text-center">
                Ekstra Swipe Hakkı Kazan
              </h3>
              <p className="text-white/70 text-sm text-center mb-4">
                {extraSwipes > 0 
                  ? `${extraSwipes} ekstra swipe hakkınız var! 🎉`
                  : 'Reklam izleyerek 10 ekstra swipe hakkı kazanabilirsiniz'}
              </p>
              <RewardedAdButton 
                onRewardEarned={handleRewardEarned}
                buttonText="İzle ve Kazan"
                rewardDescription="+10 Ekstra Swipe"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/settings"
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-colors border border-white/20 text-center"
            >
              <div className="text-white font-semibold">Ayarlar</div>
              <div className="text-white/70 text-sm mt-1">Hesap ve gizlilik ayarları</div>
            </Link>

            <Link
              href="/my-items"
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-colors border border-white/20 text-center"
            >
              <div className="text-white font-semibold">Eşyalarım</div>
              <div className="text-white/70 text-sm mt-1">Paylaştığım eşyaları yönet</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
