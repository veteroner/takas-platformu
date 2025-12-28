'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, X, MapPin, Star, ChevronLeft, ChevronRight, Eye, Clock } from 'lucide-react'
import { Item } from '@/types'
import { useTranslation } from 'react-i18next'

interface DesktopGridViewProps {
  items: Item[]
  likedItems: string[]
  passedItems: string[]
  onLike: (item: Item) => void
  onPass: (item: Item) => void
  onRetry?: () => void
  isLoading: boolean
}

export default function DesktopGridView({ 
  items, 
  likedItems, 
  passedItems, 
  onLike, 
  onPass,
  isLoading 
}: DesktopGridViewProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Filtrelenmemiş ürünler (beğenilmemiş ve geçilmemiş)
  const availableItems = items.filter(
    item => !likedItems.includes(item.id) && !passedItems.includes(item.id)
  )

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setCurrentImageIndex(0)
  }

  const handleNextImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handlePrevImage = () => {
    if (selectedItem && selectedItem.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      )
    }
  }

  const handleLikeSelected = () => {
    if (selectedItem) {
      onLike(selectedItem)
      setSelectedItem(null)
    }
  }

  const handlePassSelected = () => {
    if (selectedItem) {
      onPass(selectedItem)
      setSelectedItem(null)
    }
  }

  const conditionLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'Sıfır', color: 'bg-green-100 text-green-700' },
    like_new: { label: 'Az Kullanılmış', color: 'bg-blue-100 text-blue-700' },
    good: { label: 'İyi', color: 'bg-yellow-100 text-yellow-700' },
    fair: { label: 'Orta', color: 'bg-orange-100 text-orange-700' },
    poor: { label: 'Yıpranmış', color: 'bg-red-100 text-red-700' }
  }

  const categoryLabels: Record<string, string> = {
    clothing: 'Giyim',
    toys: 'Oyuncak',
    electronics: 'Elektronik',
    books: 'Kitap',
    sports: 'Spor',
    home: 'Ev',
    other: 'Diğer'
  }

  const { t } = useTranslation('common')

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sol: Ürün Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {availableItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                <div className="text-3xl">🔁</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('noMoreItems')}</h3>
              <p className="text-gray-400 mb-6">{t('noMoreItemsDesc')}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => { if (typeof onRetry === 'function') onRetry(); else window.location.reload() }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-full shadow-md hover:opacity-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 1 0-3.16 6.18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t('retry')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {availableItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
                  selectedItem?.id === item.id 
                    ? 'border-pink-500 ring-2 ring-pink-200' 
                    : 'border-transparent hover:border-pink-200'
                }`}
              >
                {/* Ürün Resmi */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.images[0] || '/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Kategori Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                      {categoryLabels[item.category] || item.category}
                    </span>
                  </div>

                  {/* Fotoğraf Sayısı */}
                  {item.images.length > 1 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full">
                      📷 {item.images.length}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onPass(item)
                      }}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onLike(item)
                      }}
                      className="p-3 bg-linear-to-r from-pink-500 to-rose-500 rounded-full shadow-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-white" fill="white" />
                    </button>
                  </div>
                </div>

                {/* Ürün Bilgileri */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                  
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{item.location?.city || 'Konum yok'}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${conditionLabels[item.condition]?.color || 'bg-gray-100'}`}>
                      {conditionLabels[item.condition]?.label || item.condition}
                    </span>
                    
                    {item.estimatedValue && (
                      <span className="text-sm font-semibold text-green-600">
                        ~₺{item.estimatedValue.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Kullanıcı Bilgisi */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-linear-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                      {item.owner?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-xs text-gray-600 truncate flex-1">{item.owner?.name || 'Anonim'}</span>
                    {item.owner?.rating && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        <span className="text-xs text-gray-600">{item.owner.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sağ: Seçili Ürün Detay Paneli */}
      <div className={`w-96 bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
        selectedItem ? 'translate-x-0' : 'translate-x-full hidden'
      }`}>
        {selectedItem && (
          <>
            {/* Resim Galerisi */}
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={selectedItem.images[currentImageIndex] || '/placeholder.jpg'}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
              
              {/* Resim Navigasyonu */}
              {selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedItem.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Kapat Butonu */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Detaylar */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
                <span className={`shrink-0 text-xs px-2 py-1 rounded-full ${conditionLabels[selectedItem.condition]?.color}`}>
                  {conditionLabels[selectedItem.condition]?.label}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{selectedItem.location?.city || 'Konum yok'}</span>
                {selectedItem.estimatedValue && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-green-600">~₺{selectedItem.estimatedValue.toLocaleString()}</span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedItem.description || 'Açıklama yok.'}
              </p>

              {/* Kullanıcı Kartı */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-lg font-bold">
                    {selectedItem.owner?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{selectedItem.owner?.name || 'Anonim'}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {selectedItem.owner?.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          <span>{selectedItem.owner.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/user/${selectedItem.ownerId}`}
                    className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Kategori & Tarih */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {categoryLabels[selectedItem.category] || selectedItem.category}
                </span>
                {selectedItem.createdAt && (
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(selectedItem.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                )}
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="p-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={handlePassSelected}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
                Geç
              </button>
              <button
                onClick={handleLikeSelected}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:from-pink-600 hover:to-rose-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                Beğen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
