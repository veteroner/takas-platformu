'use client'

import { useState, useEffect } from 'react'
import SwipeStack from '@/components/SwipeStack'
import { Item } from '@/types'
import { Heart, MessageCircle, User, Settings, LogIn, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getFeedItems, recordSwipe, checkForMatch } from '@/lib/api'
import { getCurrentUser } from '@/lib/auth'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [passedItems, setPassedItems] = useState<Item[]>([])

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
      
  setItems(convertedItems)
    } catch (error) {
      console.error('Error loading items:', error)
      setItems([]) // Empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right', item: Item) => {
    try {
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
    // Open item detail modal (implement later)
    console.log('Item clicked:', item)
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
                  {likedItems.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {likedItems.length}
                    </div>
                  )}
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
        {/* Instructions */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Takas yapmaya hazır mısın?
          </h2>
          <p className="text-gray-600">
            Beğendiğin ürünleri sağa, beğenmediklerini sola kaydır
          </p>
        </div>

        {/* Swipe Stack */}
        <div className="h-[500px] md:h-[600px] mb-6">
          <SwipeStack
            items={items}
            onSwipe={handleSwipe}
            onItemClick={handleItemClick}
            isLoading={isLoading}
            className="w-full h-full"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-600">{likedItems.length}</div>
            <div className="text-sm text-gray-600">Beğenilen</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-red-600">{passedItems.length}</div>
            <div className="text-sm text-gray-600">Geçilen</div>
          </div>
        </div>

        {/* Quick Actions */}
        {!!user ? (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href="/upload" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-4 text-center hover:from-pink-600 hover:to-purple-700 transition-colors shadow-lg">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Ürün Yükle</span>
            </Link>
            <button className="flex-1 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/80 transition-colors">
              <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Beğenilenler</span>
            </button>
          </div>
        ) : null}

        {!!user ? (
          <div className="flex gap-3">
            <Link href="/messages" className="flex-1 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/80 transition-colors">
              <MessageCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Mesajlar</span>
            </Link>
            <Link href="/profile" className="flex-1 bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:bg-white/80 transition-colors">
              <User className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-700">Profil</span>
            </Link>
          </div>
        ) : (
          <div className="text-center bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
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

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-4 py-2 pb-safe">
        <div className="max-w-md mx-auto flex justify-around pb-4 md:pb-2">
          <button className="flex flex-col items-center py-2 px-4 text-purple-600">
            <Heart className="w-6 h-6 fill-current" />
            <span className="text-xs mt-1 font-medium">Keşfet</span>
          </button>
          {!!user ? (
            <>
              <Link href="/upload" className="flex flex-col items-center py-2 px-4 text-gray-400">
                <Plus className="w-6 h-6" />
                <span className="text-xs mt-1">Yükle</span>
              </Link>
              <Link href="/messages" className="flex flex-col items-center py-2 px-4 text-gray-400">
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">Mesajlar</span>
              </Link>
              <Link href="/profile" className="flex flex-col items-center py-2 px-4 text-gray-400">
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profil</span>
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex flex-col items-center py-2 px-4 text-gray-400">
              <LogIn className="w-6 h-6" />
              <span className="text-xs mt-1">Giriş</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
