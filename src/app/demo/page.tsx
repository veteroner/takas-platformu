'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SwipeStack from '@/components/SwipeStack'
import { Item } from '@/types'
import { ArrowLeft, Sparkles } from 'lucide-react'
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
        <div className="max-w-md mx-auto px-4 py-4 pt-12 md:pt-4">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          </div>
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
    </div>
  )
}
