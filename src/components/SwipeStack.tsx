'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SwipeCard from './SwipeCard'
import { Item } from '@/types'
import { Loader2, RotateCcw, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface SwipeStackProps {
  items: Item[]
  onSwipe: (direction: 'left' | 'right', item: Item) => void
  onItemClick?: (item: Item) => void
  isLoading?: boolean
  onLoadMore?: () => void
  className?: string
}

const SwipeStack: React.FC<SwipeStackProps> = ({
  items,
  onSwipe,
  onItemClick,
  isLoading = false,
  onLoadMore,
  className = ''
}) => {
  const { t } = useTranslation('common')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stack, setStack] = useState<Item[]>([])

  // Initialize stack with first few items
  // Reset currentIndex and stack whenever items change (e.g., page reload)
  useEffect(() => {
    console.log('🔄 SwipeStack RESET - items received:', items.length)
    
    // Always reset currentIndex to 0 when items change
    setCurrentIndex(0)
    
    if (items.length > 0) {
      const initialStack = items.slice(0, Math.min(3, items.length))
      setStack(initialStack)
      console.log('✅ Stack initialized with', initialStack.length, 'items, currentIndex reset to 0')
    } else {
      setStack([])
      console.log('📦 No items, stack cleared')
    }
  }, [items])

  const handleSwipe = (direction: 'left' | 'right', item: Item) => {
    onSwipe(direction, item)
    
    // Move to next item
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)

    // Update stack - remove swiped item and add new one if available
    setStack(prev => {
      const newStack = prev.slice(1)
      
      if (newIndex + 2 < items.length) {
        newStack.push(items[newIndex + 2])
      }
      
      return newStack
    })

    // Load more items if running low
    if (newIndex >= items.length - 5 && onLoadMore) {
      onLoadMore()
    }
  }

  const resetStack = () => {
    setCurrentIndex(0)
    setStack(items.slice(0, Math.min(3, items.length)))
  }

  // Loading state
  if (isLoading && stack.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <div className="text-center p-8">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-600">{t('loadingItems')}</p>
        </div>
      </div>
    )
  }

  // No items
  if (items.length === 0 && !isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg max-w-xs mx-auto"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('noItems')}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {t('addFirstItem')}
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <Plus size={18} />
            {t('addItem')}
          </Link>
        </motion.div>
      </div>
    )
  }

  // No more items to swipe
  if (currentIndex >= items.length) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg max-w-xs mx-auto"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('noMoreItems')} 🎉
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {t('noMoreItemsDesc')}
          </p>
          <button
            onClick={resetStack}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            <RotateCcw size={18} />
            {t('retry')}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`relative w-full ${className}`} style={{ height: 'calc(100svh - 280px)', minHeight: '400px', maxHeight: '700px' }}>
      {/* Card Stack */}
      <div className="w-full h-full relative">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute inset-0 w-full h-full"
              initial={{
                scale: 1 - index * 0.03,
                y: index * 6,
                opacity: 1 - index * 0.15,
                zIndex: stack.length - index
              }}
              animate={{
                scale: 1 - index * 0.03,
                y: index * 6,
                opacity: 1 - index * 0.15,
                zIndex: stack.length - index
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.2 }
              }}
              style={{
                zIndex: stack.length - index
              }}
            >
              {index === 0 ? (
                <SwipeCard
                  item={item}
                  onSwipe={handleSwipe}
                  onCardClick={onItemClick}
                />
              ) : (
                // Background cards (non-interactive)
                <div 
                  className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div 
                    className="swipe-card-media w-full h-[70%] bg-gray-200"
                    style={{
                      backgroundImage: `url(${item.images[0] || '/placeholder-item.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="swipe-card-content p-3 h-[30%] bg-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Indicator - Üst köşede */}
      {items.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/40 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-20">
          {Math.min(currentIndex + 1, items.length)} / {items.length}
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoading && stack.length > 0 && (
        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 z-20">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('loading')}
        </div>
      )}
    </div>
  )
}

export default SwipeStack
