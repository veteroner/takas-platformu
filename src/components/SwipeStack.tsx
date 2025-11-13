'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SwipeCard from './SwipeCard'
import { Item } from '@/types'
import { Loader2, RotateCcw } from 'lucide-react'

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [stack, setStack] = useState<Item[]>([])

  // Initialize stack with first few items
  useEffect(() => {
    if (items.length > 0) {
      setStack(items.slice(0, Math.min(3, items.length)))
    }
  }, [items])

  const handleSwipe = (direction: 'left' | 'right', item: Item) => {
    onSwipe(direction, item)
    
    // Move to next item
    const newIndex = currentIndex + 1
    setCurrentIndex(newIndex)

    // Update stack - remove swiped item and add new one if available
    setStack(prev => {
      const newStack = prev.slice(1) // Remove first item
      
      // Add new item to the end if available
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

  // No more items
  if (currentIndex >= items.length && !isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Tüm ürünleri gördün!
          </h3>
          <p className="text-gray-600 mb-6">
            Yeni ürünler için daha sonra tekrar dene
          </p>
          <button
            onClick={resetStack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Baştan Başla
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`relative w-full max-w-md mx-auto h-[600px] md:h-[700px] ${className}`}>
      {/* Loading State */}
      {isLoading && stack.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-600">Ürünler yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Card Stack */}
  <div className="relative w-full h-full">
        <AnimatePresence>
          {stack.map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={{
                scale: 0.95 - index * 0.05,
                y: index * 4,
                opacity: 1 - index * 0.1,
                zIndex: stack.length - index
              }}
              animate={{
                scale: 0.95 - index * 0.05,
                y: index * 4,
                opacity: 1 - index * 0.1,
                zIndex: stack.length - index
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
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
                  className="w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100"
                  style={{
                    backgroundImage: `url(${item.images[0] || '/placeholder-item.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-white/80 rounded-2xl" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Loading More Indicator */}
      {isLoading && stack.length > 0 && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Yükleniyor...
        </div>
      )}
  {/* Alt boşluk - scroll serbestliği için */}
  <div className="w-full h-24" />
    </div>
  )
}

export default SwipeStack
