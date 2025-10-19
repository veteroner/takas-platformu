'use client'

import { useState, useEffect } from 'react'
import SwipeStack from '@/components/SwipeStack'
import { Item, ItemCondition } from '@/types'
import { Heart, MessageCircle, User, Settings, LogIn, Plus, Package } from 'lucide-react'
import { UnreadBadge } from '@/components/UnreadBadge'
import Link from 'next/link'
import Image from 'next/image'
import { getFeedItems, recordSwipe, checkForMatch } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import BannerAd from '@/components/BannerAd'
import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { SwipeCounter } from '@/lib/admob'
import { loadSeekingPreferencesAsync } from '@/lib/preferences'
import { filterAndRank } from '@/lib/matching'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [passedItems, setPassedItems] = useState<Item[]>([])
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('grid') // Varsayılan: Grid
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Seçilen kategori
  const [showLikedItems, setShowLikedItems] = useState(false) // Beğenilen ürünler görünümü
  
  // Interstitial reklam hook'u
  const interstitialAd = useInterstitialAd()
  
  // Swipe sayacı - Her 5 swipe'da bir reklam göster
  const [swipeCounter] = useState(() => new SwipeCounter(5, () => {
    if (interstitialAd.isReady) {
      interstitialAd.show()
    }
  }))

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    loadInitialItems()
  }, [user?.id])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadInitialItems = async () => {
    try {
      setIsLoading(true)
      // Load real items from database (skip owner filter when no user)
      const feedItems = await getFeedItems(user?.id)
      
            // Convert Supabase items to frontend Item type
      const convertedItems: Item[] = feedItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images,
        category: item.category as any,
        condition: item.condition as any,
        estimatedValue: item.estimated_value || 0,
        color: ['#FF6B6B', '#FF8E53'],
        ownerId: item.owner_id,
        owner: {
          id: item.owner_id,
          name: 'User',
          email: 'user@example.com',
          avatar: '/icons/icon-192.png',
          rating: 5,
          totalTrades: 0,
          joinedAt: new Date(),
          preferences: {
            categories: [],
            maxDistance: 50,
            ageRange: { min: 0, max: 100 }
          },
          location: {
            city: 'İstanbul',
            country: 'TR'
          }
        },
        location: {
          city: 'İstanbul',
          country: 'TR'
        },
        createdAt: new Date(item.created_at),
        isActive: item.status === 'active',
        tags: []
      }))
      
      // 🎯 Her kategoriden en az 1 ürün göster (Grid için optimize)
      const itemsByCategory = new Map<string, Item[]>()
      convertedItems.forEach(item => {
        const category = item.category
        if (!itemsByCategory.has(category)) {
          itemsByCategory.set(category, [])
        }
        itemsByCategory.get(category)!.push(item)
      })
      
      // Her kategoriden 1'er ürün al, sonra geri kalanları ekle
      const diverseItems: Item[] = []
      const remainingItems: Item[] = []
      
      itemsByCategory.forEach((items, category) => {
        if (items.length > 0) {
          diverseItems.push(items[0]) // İlk ürünü al
          remainingItems.push(...items.slice(1)) // Geri kalanlar
        }
      })
      
      // Önce her kategoriden 1'er, sonra geri kalanlar (en az 8 ürün garantisi)
      const finalItems = [...diverseItems, ...remainingItems].slice(0, Math.max(8, diverseItems.length + remainingItems.length))
      
      setItems(finalItems)
    } catch (error) {
      console.error('Error loading items:', error)
      setItems([]) // Empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right', item: Item) => {
    try {
      // Swipe sayacını artır - her 5 swipe'da reklam gösterir
      swipeCounter.increment()
      
      // Record swipe in database
      if (user) {
        await recordSwipe(
          user.id,
          item.id,
          direction
        )

        // Check for match if user swiped right
        if (direction === 'right') {
          setLikedItems(prev => [...prev, item])
          
          // Check if this created a match
          const match = await checkForMatch(user.id, item.id)
          
          if (match) {
            const otherUser = match.user1_id === user.id ? match.user2 : match.user1
            setTimeout(() => {
              alert(`🎉 ${otherUser.name} ile eşleştiniz! Mesajlaşmaya başlayabilirsiniz.`)
            }, 500)
          }
        } else {
          setPassedItems(prev => [...prev, item])
        }
      }
    } catch (error) {
      console.error('Error recording swipe:', error)
    }
  }

  const handleItemClick = (item: Item) => {
    // Kategoriye göre filtrele ve swipe moduna geç
    console.log('Item clicked:', item)
    setSelectedCategory(item.category)
    setViewMode('swipe')
    
    // İlk sırada tıklanan ürün, sonra aynı kategoriden diğerleri
    const categoryItems = items.filter(i => i.category === item.category)
    const clickedIndex = categoryItems.findIndex(i => i.id === item.id)
    
    if (clickedIndex !== -1) {
      // Tıklanan ürünü başa al
      const reordered = [
        categoryItems[clickedIndex],
        ...categoryItems.slice(0, clickedIndex),
        ...categoryItems.slice(clickedIndex + 1)
      ]
      setItems(reordered)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-md mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/app-icon.svg"
              alt="Takas App Icon"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Takas
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!!user ? (
              <>
                <Link href="/upload" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus className="w-6 h-6 text-gray-600" />
                </Link>
                <Link href="/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                  {/* Okunmamış mesaj badge'i */}
                  <UnreadBadge userId={user?.id || null} />
                </Link>
                <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600" />
                  )}
                </Link>
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Settings className="w-6 h-6 text-gray-600" />
                </Link>
              </>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <LogIn size={16} />
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 pt-6">
        {/* Instructions & View Toggle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {viewMode === 'grid' ? 'İlgilendiğin kategoriyi seç' : 'Takas yapmaya hazır mısın?'}
          </h2>
          <p className="text-gray-600 mb-4">
            {viewMode === 'swipe' 
              ? selectedCategory 
                ? `${selectedCategory} kategorisinde geziniyorsun - Beğen veya geç!`
                : 'Beğendiğin ürünleri sağa, beğenmediklerini sola kaydır'
              : 'İlgini çeken ürüne tıkla, benzer ürünleri keşfet!'
            }
          </p>
          
          {/* View Mode Toggle - Sadece swipe modundayken geri butonu göster */}
          {viewMode === 'swipe' ? (
            <button
              onClick={() => {
                setViewMode('grid')
                setSelectedCategory(null)
                loadInitialItems() // Tüm ürünleri tekrar yükle
              }}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-gray-700 hover:bg-white/90 transition-all"
            >
              ← Tüm Kategorilere Dön
            </button>
          ) : null}
        </div>

        {/* Swipe Stack View */}
        {viewMode === 'swipe' && (
          <div className="h-[500px] md:h-[600px] mb-6">
            <SwipeStack
              items={selectedCategory ? items.filter(i => i.category === selectedCategory) : items}
              onSwipe={handleSwipe}
              onItemClick={handleItemClick}
              isLoading={isLoading}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="mb-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Ürünler yükleniyor...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Henüz ürün yok</p>
                {user && (
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus size={20} />
                    İlk Ürünü Ekle
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleItemClick(item)}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="w-16 h-16 text-pink-300" />
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full text-gray-700 border border-white/20">
                          {item.category}
                        </span>
                      </div>
                      {/* Condition Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                          item.condition === ItemCondition.LIKE_NEW 
                            ? 'bg-blue-500/90 text-white border-blue-400'
                            : item.condition === ItemCondition.GOOD
                            ? 'bg-green-500/90 text-white border-green-400'
                            : 'bg-gray-500/90 text-white border-gray-400'
                        }`}>
                          {item.condition === ItemCondition.LIKE_NEW ? 'Sıfır Gibi' : 
                           item.condition === ItemCondition.GOOD ? 'İyi' : 
                           item.condition === ItemCondition.FAIR ? 'Normal' : 'Kullanılmış'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          📍 {item.location.city}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          ≈₺{item.estimatedValue}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      {user && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSwipe('left', item)
                            }}
                            className="flex-1 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                          >
                            <span className="text-2xl">✕</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSwipe('right', item)
                            }}
                            className="flex-1 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
                          >
                            <span className="text-2xl">♥</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Banner Reklam */}
        <BannerAd />

        {/* Stats - Tıklanabilir */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            onClick={() => setShowLikedItems(!showLikedItems)}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="text-2xl font-bold text-green-600">{likedItems.length}</div>
            <div className="text-sm text-gray-600">Beğenilen</div>
            {showLikedItems && <div className="text-xs text-purple-600 mt-1">👇 Aşağıda gösteriliyor</div>}
          </button>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-red-600">{passedItems.length}</div>
            <div className="text-sm text-gray-600">Geçilen</div>
          </div>
        </div>

        {/* Beğenilen Ürünler Grid */}
        {showLikedItems && likedItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">💚 Beğendiğin Ürünler</h2>
              <button 
                onClick={() => setShowLikedItems(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Gizle ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {likedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.images[0] || '/placeholder.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                      {(() => {
                        const cat = String(item.category).toLowerCase()
                        if (cat.includes('clothing')) return '👕'
                        if (cat.includes('toys')) return '🧸'
                        if (cat.includes('electronics')) return '📱'
                        if (cat.includes('books')) return '📚'
                        if (cat.includes('accessories')) return '👜'
                        if (cat.includes('shoes')) return '👟'
                        return '📦'
                      })()}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-800 truncate">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">📍 {item.location?.city}</p>
                    <p className="text-sm font-bold text-green-600 mt-1">≈₺{item.estimatedValue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beğenilen Ürün Yoksa */}
        {showLikedItems && likedItems.length === 0 && (
          <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Henüz beğeni yok</h3>
            <p className="text-sm text-gray-600">Ürünleri kaydırıp beğenmeye başla! 💚</p>
            <button 
              onClick={() => setShowLikedItems(false)}
              className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              Kapat
            </button>
          </div>
        )}

        {/* Login CTA (sadece giriş yapmamış kullanıcılar için) */}
        {!user && (
          <div className="text-center bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Hoş Geldin!</h3>
            <p className="text-gray-600 mb-4">Takas yapmaya başlamak için giriş yap veya hesap oluştur.</p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <LogIn size={20} />
              Başla
            </Link>
          </div>
        )}
        
        {/* Bottom padding for fixed navigation */}
        <div className="h-24 md:h-16"></div>
      </main>

      {/* Bottom Navigation (Mobile) - 5 Buton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-2 py-2 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center pb-4 md:pb-2">
          <button className="flex flex-col items-center py-1 px-2 text-purple-600 min-w-[60px]">
            <Heart className="w-6 h-6 fill-current" />
            <span className="text-[10px] mt-1 font-medium">Keşfet</span>
          </button>
          {!!user ? (
            <>
              <Link href="/my-items" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
                <Package className="w-6 h-6" />
                <span className="text-[10px] mt-1">Ürünlerim</span>
              </Link>
              <Link href="/upload" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
                <Plus className="w-6 h-6" />
                <span className="text-[10px] mt-1">Yükle</span>
              </Link>
              <Link href="/messages" className="flex flex-col items-center py-1 px-2 text-gray-400 relative min-w-[60px]">
                <MessageCircle className="w-6 h-6" />
                <span className="text-[10px] mt-1">Mesajlar</span>
                <UnreadBadge userId={user?.id || null} />
              </Link>
              <Link href="/profile" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
                <User className="w-6 h-6" />
                <span className="text-[10px] mt-1">Profil</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
              <LogIn className="w-6 h-6" />
              <span className="text-[10px] mt-1">Giriş</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
