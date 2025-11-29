'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import SwipeStack from '@/components/SwipeStack'
import MatchToast from '@/components/MatchToast'
import { Item, ItemCondition } from '@/types'
import { Heart, MessageCircle, User, Settings, LogIn, Plus, Package, Shirt, Gamepad2, Smartphone, BookOpen, Dumbbell, Home, LayoutGrid } from 'lucide-react'
import { UnreadBadge } from '@/components/UnreadBadge'
import Link from 'next/link'
import Image from 'next/image'
import { getFeedItems, recordSwipe, checkForMatch, getUserLikedItems, getUserPassedItems } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'
import { useAds } from '@/hooks/useAds'
import { AdSwipeCounter } from '@/lib/adManager'

// Kategori tanımları
const CATEGORIES = [
  { id: null, label: 'Tümü', icon: LayoutGrid, color: 'from-purple-500 to-pink-500' },
  { id: 'clothing', label: 'Giyim', icon: Shirt, color: 'from-pink-500 to-rose-500' },
  { id: 'toys', label: 'Oyuncak', icon: Gamepad2, color: 'from-orange-500 to-amber-500' },
  { id: 'electronics', label: 'Elektronik', icon: Smartphone, color: 'from-blue-500 to-cyan-500' },
  { id: 'books', label: 'Kitap', icon: BookOpen, color: 'from-green-500 to-emerald-500' },
  { id: 'sports', label: 'Spor', icon: Dumbbell, color: 'from-red-500 to-orange-500' },
  { id: 'home', label: 'Ev', icon: Home, color: 'from-violet-500 to-purple-500' },
]

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  avatar_url?: string
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [passedItems, setPassedItems] = useState<Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Seçilen kategori
  const [showLikedItems, setShowLikedItems] = useState(false) // Beğenilen ürünler görünümü
  
  // Match toast state
  const [showMatchToast, setShowMatchToast] = useState(false)
  const [matchedUser, setMatchedUser] = useState<{ name: string; avatar?: string; matchId: string } | null>(null)
  
  // Unified Ads hook'u (Unity Ads öncelikli, yoksa AdMob)
  const ads = useAds()
  
  // Swipe sayacı - Her 5 swipe'da bir reklam göster
  const [swipeCounter] = useState(() => new AdSwipeCounter(5, () => {
    if (ads.isReady) {
      ads.show()
    }
  }))

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }, [])

  const loadUserSwipes = useCallback(async () => {
    if (!user?.id) return
    
    try {
      // Load liked items from database
      const liked = await getUserLikedItems(user.id)
      const likedConverted: Item[] = liked.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        title: item.title as string,
        description: (item.description as string) || '',
        images: (item.images as string[]) || [],
        category: item.category as Item['category'],
        condition: item.condition as ItemCondition,
        estimatedValue: (item.estimated_value as number) || 0,
        color: ['#FF6B6B', '#FF8E53'],
        ownerId: (item.owner_id as string) || '',
        owner: {
          id: (item.owner_id as string) || '',
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
            city: (item.location as string) || 'İstanbul',
            country: 'TR'
          }
        },
        location: {
          city: (item.location as string) || 'İstanbul',
          country: 'TR'
        },
        createdAt: new Date((item.created_at as string | number) || Date.now()),
        isActive: item.status === 'active',
        tags: []
      }))
      setLikedItems(likedConverted)

      // Load passed items (just IDs)
      const passed = await getUserPassedItems(user.id)
      // Convert to Item[] format for consistency (though we only need IDs)
      setPassedItems(passed.map(id => ({ id } as Item)))
    } catch (error) {
      console.error('Error loading user swipes:', error)
    }
  }, [user?.id])

  const loadInitialItems = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('📡 Loading feed items for user:', user?.id || 'guest')
      // Load real items from database (skip owner filter when no user)
      const feedItems = await getFeedItems(user?.id)
      console.log('📡 Feed items received from API:', feedItems?.length || 0, feedItems)
      
            // Convert Supabase items to frontend Item type
      const convertedItems: Item[] = feedItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images,
        category: item.category as Item['category'],
        condition: item.condition as ItemCondition,
        estimatedValue: item.estimated_value || 0,
        color: ['#FF6B6B', '#FF8E53'],
        ownerId: item.owner_id,
        owner: {
          id: item.owner?.id || item.owner_id,
          name: item.owner?.name || 'Anonim Kullanıcı',
          email: item.owner?.email || '',
          avatar: item.owner?.avatar || '/icons/icon-192.png',
          rating: item.owner?.rating || 5,
          totalTrades: item.owner?.total_trades || 0,
          joinedAt: new Date(),
          preferences: {
            categories: [],
            maxDistance: 50,
            ageRange: { min: 0, max: 100 }
          },
          location: {
            city: item.owner?.location || item.location || 'İstanbul',
            country: 'TR'
          }
        },
        location: {
          city: item.location || item.owner?.location || 'İstanbul',
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
      
      itemsByCategory.forEach((items) => {
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
  }, [user?.id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  // İlk mount'ta hemen items yükle
  useEffect(() => {
    console.log('🔄 useEffect triggered - loading items...')
    loadInitialItems()
  }, []) // Sadece mount'ta çalış
  
  // User değiştiğinde tekrar yükle
  useEffect(() => {
    if (user?.id) {
      console.log('👤 User loaded, reloading items for user:', user.id)
      loadInitialItems()
      loadUserSwipes()
    }
  }, [user?.id])

  // Filtrelenmiş ürünler - useMemo ile optimize
  const filteredItems = useMemo(() => {
    console.log('🎯 Feed items:', items.length, 'Selected category:', selectedCategory)
    if (!selectedCategory) return items
    return items.filter(item => {
      const cat = String(item.category).toLowerCase()
      return cat.includes(selectedCategory.toLowerCase())
    })
  }, [items, selectedCategory])

  const handleSwipe = async (direction: 'left' | 'right', item: Item) => {
    try {
      // Swipe sayacını artır - her 5 swipe'da interstitial reklam gösterir
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
            
            // 🎉 MATCH! Show toast and redirect directly to chat with that user
            setMatchedUser({
              name: otherUser.name,
              avatar: otherUser.avatar_url,
              matchId: match.id
            })
            setShowMatchToast(true)
            
            // Redirect directly to chat with matched user
            setTimeout(() => {
              router.push(`/chat/${match.id}`)
            }, 3000) // 3 seconds to show toast
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
    // Ürün detay sayfasına git (ileride)
    console.log('Item clicked:', item)
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col">
      {/* Header - Kompakt */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe flex-shrink-0">
        <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 pt-10 md:pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/logo.svg"
              alt="Takas Logo"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Takas
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!!user ? (
              <>
                <Link href="/upload" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Plus className="w-5 h-5 text-gray-600" />
                </Link>
                <Link href="/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <UnreadBadge userId={user?.id || null} />
                </Link>
                <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </Link>
                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Link>
              </>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm"
              >
                <LogIn size={14} />
                Giriş
              </Link>
            )}
          </div>
        </div>

        {/* Kategori Filtreleri - Yatay Scroll */}
        <div className="px-2 pb-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id || 'all'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md scale-105`
                      : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow */}
      <main className="flex-1 flex flex-col max-w-md lg:max-w-lg xl:max-w-xl mx-auto w-full px-3 py-3 overflow-hidden">
        {/* Swipe Stack - Ana alan */}
        <div className="flex-1 relative">
          <SwipeStack
            items={filteredItems}
            onSwipe={handleSwipe}
            onItemClick={handleItemClick}
            isLoading={isLoading}
            className="w-full"
          />
        </div>

        {/* Stats - Kompakt */}
        <div className="flex gap-3 py-3 flex-shrink-0">
          <button 
            onClick={() => setShowLikedItems(!showLikedItems)}
            className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl py-2.5 px-4 text-center border border-white/20 hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg font-bold text-green-600">{likedItems.length}</span>
            <span className="text-xs text-gray-600">Beğenilen</span>
          </button>
          <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl py-2.5 px-4 text-center border border-white/20 flex items-center justify-center gap-2">
            <span className="text-lg font-bold text-red-600">{passedItems.length}</span>
            <span className="text-xs text-gray-600">Geçilen</span>
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
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.images[0] || '/placeholder.png'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold shadow-sm">
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
                    <h3 className="font-bold text-sm text-gray-900 truncate">{item.title}</h3>
                    <p className="text-xs font-medium text-gray-700 mt-1">📍 {item.location?.city}</p>
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
          <div className="text-center bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex-shrink-0">
            <p className="text-gray-600 mb-3 text-sm">Takas yapmak için giriş yap</p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg text-sm"
            >
              <LogIn size={16} />
              Giriş Yap
            </Link>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Kompakt */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 pb-safe flex-shrink-0">
        <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto flex justify-around items-center pb-2">
          <button className="flex flex-col items-center py-1 px-3 text-purple-600">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-[10px] mt-0.5 font-medium">Keşfet</span>
          </button>
          {!!user ? (
            <>
              <Link href="/my-items" className="flex flex-col items-center py-1 px-3 text-gray-400">
                <Package className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Ürünlerim</span>
              </Link>
              <Link href="/upload" className="flex flex-col items-center py-1 px-3 text-gray-400">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full -mt-4 shadow-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] mt-0.5">Yükle</span>
              </Link>
              <Link href="/messages" className="flex flex-col items-center py-1 px-3 text-gray-400 relative">
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Mesajlar</span>
                <UnreadBadge userId={user?.id || null} />
              </Link>
              <Link href="/profile" className="flex flex-col items-center py-1 px-3 text-gray-400">
                <User className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Profil</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex flex-col items-center py-1 px-3 text-gray-400">
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Giriş</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Match Toast Notification */}
      {matchedUser && (
        <MatchToast
          isVisible={showMatchToast}
          otherUserName={matchedUser.name}
          otherUserAvatar={matchedUser.avatar}
          onClose={() => {
            setShowMatchToast(false)
            router.push(`/chat/${matchedUser.matchId}`)
          }}
        />
      )}
    </div>
  )
}
