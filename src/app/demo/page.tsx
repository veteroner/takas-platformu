'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SwipeStack from '@/components/SwipeStack'
import { Item } from '@/types'
import { ArrowLeft, Heart, Package, Plus, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { mockItems } from '@/lib/mockData'

export default function DemoPage() {
  const router = useRouter()
  const [items] = useState<Item[]>(mockItems)
  const [likedItems, setLikedItems] = useState<Item[]>([])
  const [passedItems, setPassedItems] = useState<Item[]>([])

  const handleSwipe = async (direction: 'left' | 'right', item: Item) => {
    // Demo modda sadece UI güncellemesi, veritabanı kaydı yok
    if (direction === 'right') {
      setLikedItems(prev => [...prev, item])
    } else {
      setPassedItems(prev => [...prev, item])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-md mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo.svg"
              alt="Takas Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Takas
            </h1>
          </div>
          
          <Link 
            href="/"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pb-24">
        <SwipeStack
          items={items}
          onSwipe={handleSwipe}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-600">{likedItems.length}</div>
            <div className="text-sm text-gray-600">Beğenilen</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-red-600">{passedItems.length}</div>
            <div className="text-sm text-gray-600">Geçilen</div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-2 py-2 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center pb-4 md:pb-2">
          <div className="flex flex-col items-center py-1 px-2 text-purple-600 min-w-[60px]">
            <Heart className="w-6 h-6 fill-current" />
            <span className="text-[10px] mt-1 font-medium">Keşfet</span>
          </div>
          <Link href="/" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
            <Package className="w-6 h-6" />
            <span className="text-[10px] mt-1">Ürünlerim</span>
          </Link>
          <Link href="/" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
            <Plus className="w-6 h-6" />
            <span className="text-[10px] mt-1">Yükle</span>
          </Link>
          <Link href="/" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] mt-1">Mesajlar</span>
          </Link>
          <Link href="/" className="flex flex-col items-center py-1 px-2 text-gray-400 min-w-[60px]">
            <User className="w-6 h-6" />
            <span className="text-[10px] mt-1">Profil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
