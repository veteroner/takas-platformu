'use client'

import { useState, useRef } from 'react'
import { useSpring, animated, to } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import Image from 'next/image'
import { Heart, X, MapPin } from 'lucide-react'
import { SwipeCardProps } from '@/types'
import { useTranslation } from 'react-i18next'
import { getPublicUserName } from '@/lib/utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpringValue = any

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  item, 
  onSwipe, 
  onCardClick 
}) => {
  const { t } = useTranslation('common')
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGone, setIsGone] = useState(false)
  
  // Debug log
  console.log('🃏 SwipeCard rendering:', item.title, item.images?.[0]?.substring(0, 50))

  // Animasyon için spring konfigürasyonu
  const [{ x, y, rot, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    config: { friction: 50, tension: 500 }
  }))

  // Drag gesture handler with smooth horizontal swipe
  const bind = useDrag(({ 
    active, 
    movement: [mx, my], 
    direction: [xDir], 
    velocity: [vx], 
    first,
    memo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) => {
    // İlk harekette yönü belirle ve memo'da sakla
    if (first) {
      const isHorizontal = Math.abs(mx) > Math.abs(my)
      return isHorizontal ? 'horizontal' : 'vertical'
    }
    
    // Dikey hareket ise swipe'ı iptal et
    if (memo === 'vertical') {
      return memo
    }
    
    // Yatay swipe trigger kontrolü
    const trigger = Math.abs(vx) > 0.3 || Math.abs(mx) > 100
    const dir = xDir < 0 ? -1 : 1
    
    if (!active && trigger && Math.abs(mx) > 50) {
      setIsGone(true)
      const direction = dir === 1 ? 'right' : 'left'
      
      api.start({
        x: (200 + window.innerWidth) * dir,
        rot: mx / 100 + (dir * 10 * Math.abs(vx)),
        scale: 1.1,
        config: { friction: 50, tension: 200 }
      })
      
      setTimeout(() => onSwipe(direction, item), 150)
      
    } else if (active) {
      api.start({
        x: mx,
        y: 0, // Dikey hareketi engelle
        rot: mx / 100,
        scale: 1.05,
        immediate: true
      })
    } else {
      // Geri dön
      api.start({
        x: 0,
        y: 0,
        rot: 0,
        scale: 1,
        config: { friction: 50, tension: 400 }
      })
    }
    
    return memo
  }, {
    axis: 'x', // Sadece yatay eksende çalış
    filterTaps: true,
    threshold: 5,
    rubberband: false,
    pointer: { touch: true }
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

  const ownerPublicName = getPublicUserName(item.owner) || item.owner.displayName || item.owner.firstName || item.owner.name

  // Kategori emojisi
  const getCategoryEmoji = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('clothing')) return '👕'
    if (cat.includes('toys')) return '🧸'
    if (cat.includes('electronics')) return '📱'
    if (cat.includes('books')) return '📚'
    if (cat.includes('sports')) return '⚽'
    if (cat.includes('home')) return '🏠'
    return '📦'
  }

  // Kategori Türkçe çevirisi
  const getCategoryLabel = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('clothing')) return t('categories.clothing')
    if (cat.includes('toys')) return t('categories.toys')
    if (cat.includes('electronics')) return t('categories.electronics')
    if (cat.includes('books')) return t('categories.books')
    if (cat.includes('sports')) return t('categories.sports')
    if (cat.includes('home')) return t('categories.home')
    return t('categories.other')
  }

  // Durum badge rengi
  const getConditionStyle = (condition: string) => {
    const cond = condition.toLowerCase()
    if (cond.includes('new') || cond.includes('like_new')) return 'bg-emerald-500'
    if (cond.includes('good')) return 'bg-blue-500'
    if (cond.includes('fair')) return 'bg-amber-500'
    return 'bg-gray-500'
  }

  const getConditionLabel = (condition: string) => {
    const cond = condition.toLowerCase()
    if (cond.includes('like_new')) return t('conditions.like_new')
    if (cond.includes('new')) return t('conditions.new')
    if (cond.includes('good')) return t('conditions.good')
    if (cond.includes('fair')) return t('conditions.fair')
    return t('conditions.poor')
  }

  return (
    <div className="w-full h-full">
      {/* Swipe Indicators */}
      <animated.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          opacity: to([x], (xVal: SpringValue) => Math.min(Math.abs(xVal) / 100, 1)),
        }}
      >
        {/* Like Indicator (Right) */}
        <animated.div
          className="absolute top-6 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-lg"
          style={{
            opacity: to([x], (xVal: SpringValue) => (xVal > 0 ? Math.min(xVal / 80, 1) : 0)),
            transform: to([x], (xVal: SpringValue) => `scale(${1 + Math.max(0, Math.min(xVal / 300, 0.3))})`),
          }}
        >
          <Heart className="w-4 h-4 fill-current" />
          {t('like').toUpperCase()}
        </animated.div>

        {/* Pass Indicator (Left) */}
        <animated.div
          className="absolute top-6 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full font-bold text-sm flex items-center gap-1.5 shadow-lg"
          style={{
            opacity: to([x], (xVal: SpringValue) => (xVal < 0 ? Math.min(Math.abs(xVal) / 80, 1) : 0)),
            transform: to([x], (xVal: SpringValue) => `scale(${1 + Math.max(0, Math.min(Math.abs(xVal) / 300, 0.3))})`),
          }}
        >
          <X className="w-4 h-4" />
          {t('pass').toUpperCase()}
        </animated.div>
      </animated.div>

      {/* Main Card */}
      <animated.div
        ref={cardRef}
        className="w-full h-[calc(100%-70px)] bg-white rounded-2xl shadow-xl cursor-grab active:cursor-grabbing overflow-hidden border border-gray-100 select-none"
        {...bind()}
        style={{
          x,
          y,
          rotate: to([rot], (r: SpringValue) => `${r}deg`),
          scale: to([scale], (s: SpringValue) => s),
          touchAction: 'pan-y', // Dikey scroll'a izin ver
        }}
        onClick={() => onCardClick?.(item)}
      >
        {/* Image - Büyük alan */}
        <div className="relative h-[70%] overflow-hidden bg-gray-100">
          <Image
            src={item.images[0] || '/placeholder-item.jpg'}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
          
          {/* Gradient Overlay - Sadece alt kısım */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm flex items-center gap-1">
              {getCategoryEmoji(item.category)}
              <span className="hidden sm:inline">{getCategoryLabel(item.category)}</span>
            </div>
            <div className={`${getConditionStyle(item.condition)} text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm`}>
              {getConditionLabel(item.condition)}
            </div>
          </div>

          {/* Bottom Info on Image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-lg">
              {item.title}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/90 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {item.location.city}
              </span>
              <span className="text-green-400 font-bold text-sm">
                ≈₺{item.estimatedValue}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Kompakt */}
        <div className="p-2.5 h-[30%] flex flex-col">
          <p className="text-gray-600 text-sm line-clamp-1 leading-snug">
            {item.description || t('noDescription')}
          </p>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 mt-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {ownerPublicName.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 text-sm font-medium truncate max-w-[100px]">
                {ownerPublicName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="text-sm">⭐</span>
              <span className="text-gray-600 text-sm font-medium">{item.owner.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </animated.div>

      {/* Action Buttons - Kart altında */}
      <div className="flex justify-center items-center gap-6 py-2 h-[70px]">
        <button
          onClick={(e) => {
            e.stopPropagation()
            swipeLeft()
          }}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-red-200 hover:border-red-400 hover:shadow-xl"
        >
          <X className="w-7 h-7 text-red-500" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            swipeRight()
          }}
          className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </button>
      </div>
    </div>
  )
}

export default SwipeCard
