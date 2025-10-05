'use client'

import { useState, useRef } from 'react'
import { useSpring, animated, to } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import { Heart, X, MapPin, Star } from 'lucide-react'
import { Item, SwipeCardProps } from '@/types'

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  item, 
  onSwipe, 
  onCardClick 
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGone, setIsGone] = useState(false)

  // Animasyon için spring konfigürasyonu
  const [{ x, y, rot, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    config: { friction: 50, tension: 500 }
  }))

  // Drag gesture handler
  const bind = useDrag(({ 
    active, 
    movement: [mx, my], 
    direction: [xDir], 
    velocity: [vx], 
    cancel 
  }: any) => {
    const trigger = vx > 0.2 // Hız eşiği
    const dir = xDir < 0 ? -1 : 1
    
    if (!active && trigger) {
      // Kart swipe edildi
      setIsGone(true)
      const direction = dir === 1 ? 'right' : 'left'
      
      api.start({
        x: (200 + window.innerWidth) * dir,
        rot: mx / 100 + (dir * 10 * vx),
        scale: 1.1,
        config: { friction: 50, tension: 200 }
      })
      
      // Callback'i çağır
      setTimeout(() => onSwipe(direction, item), 150)
      
    } else {
      // Aktif drag veya geri dönüş
      api.start({
        x: active ? mx : 0,
        y: active ? my : 0,
        rot: active ? mx / 100 : 0,
        scale: active ? 1.05 : 1,
        immediate: active
      })
    }
  })

  // Programmatik swipe fonksiyonları
  const swipeLeft = () => {
    setIsGone(true)
    api.start({
      x: -(200 + window.innerWidth),
      rot: -45,
      scale: 1.1,
      config: { friction: 50, tension: 200 }
    })
    setTimeout(() => onSwipe('left', item), 150)
  }

  const swipeRight = () => {
    setIsGone(true)
    api.start({
      x: 200 + window.innerWidth,
      rot: 45,
      scale: 1.1,
      config: { friction: 50, tension: 200 }
    })
    setTimeout(() => onSwipe('right', item), 150)
  }

  if (isGone) return null

  return (
    <div className="relative w-full h-full touch-pan-y">
      {/* Swipe Indicators */}
      <animated.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: to([x], (x: any) => Math.abs(x) / 100),
        }}
      >
        {/* Like Indicator (Right) */}
        <animated.div
          className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2"
          style={{
            opacity: to([x], (x: any) => (x > 0 ? x / 100 : 0)),
            transform: to([x], (x: any) => `scale(${1 + Math.max(0, x / 200)})`),
          }}
        >
          <Heart className="w-5 h-5 fill-current" />
          BEĞENDİM
        </animated.div>

        {/* Pass Indicator (Left) */}
        <animated.div
          className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2"
          style={{
            opacity: to([x], (x: any) => (x < 0 ? Math.abs(x) / 100 : 0)),
            transform: to([x], (x: any) => `scale(${1 + Math.max(0, Math.abs(x) / 200)})`),
          }}
        >
          <X className="w-5 h-5" />
          GEÇ
        </animated.div>
      </animated.div>

      {/* Main Card */}
      <animated.div
        ref={cardRef}
  className="absolute inset-0 bg-white rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden touch-pan-y"
        {...bind()}
        style={{
          x,
          y,
          rotate: to([rot], (r: any) => `${r}deg`),
          scale: to([scale], (s: any) => s),
        }}
        onClick={() => onCardClick?.(item)}
      >
        {/* Image Container */}
  <div className="relative h-[65%] overflow-hidden">
          <Image
            src={item.images[0] || '/placeholder-item.jpg'}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800">
            {item.category.replace('_', ' ').toUpperCase()}
          </div>

          {/* Condition Badge */}
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {item.condition.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Content */}
  <div className="p-6 h-[35%] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{item.location.city}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{item.owner.rating.toFixed(1)}</span>
            </div>

            <div className="text-green-600 font-bold">
              ~₺{item.estimatedValue}
            </div>
          </div>
        </div>
      </animated.div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        <button
          onClick={swipeLeft}
          className="bg-white shadow-lg hover:shadow-xl p-4 rounded-full transition-all duration-200 hover:scale-110 border-2 border-red-200 hover:border-red-300"
        >
          <X className="w-6 h-6 text-red-500" />
        </button>
        
        <button
          onClick={swipeRight}
          className="bg-white shadow-lg hover:shadow-xl p-4 rounded-full transition-all duration-200 hover:scale-110 border-2 border-green-200 hover:border-green-300"
        >
          <Heart className="w-6 h-6 text-green-500" />
        </button>
      </div>
    </div>
  )
}

export default SwipeCard
