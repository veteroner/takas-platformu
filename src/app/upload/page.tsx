'use client'

import { useState, useEffect } from 'react'
import { Camera, X, Upload, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createItem, uploadImage } from '@/lib/api'
import { supabase } from '@/lib/supabase'

const categories = [
  { id: 'clothing', name: '👕 Giyim', value: 'clothing' },
  { id: 'toys', name: '🧸 Oyuncak', value: 'toys' },
  { id: 'electronics', name: '📱 Elektronik', value: 'electronics' },
  { id: 'books', name: '📚 Kitap', value: 'books' },
  { id: 'sports', name: '⚽ Spor', value: 'sports' },
  { id: 'home', name: '🏠 Ev Eşyası', value: 'home' },
  { id: 'other', name: '🔧 Diğer', value: 'other' }
]

const conditions = [
  { id: 'new', name: 'Sıfır', value: 'new' },
  { id: 'like-new', name: 'Sıfır Gibi', value: 'like-new' },
  { id: 'good', name: 'İyi', value: 'good' },
  { id: 'fair', name: 'Orta', value: 'fair' },
  { id: 'poor', name: 'Kötü', value: 'poor' }
]

export default function UploadPage() {
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    estimatedValue: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // For now, create a guest user ID
        const guestId = `guest-${Date.now()}`
        setUserId(guestId)
      } else {
        setUserId(user.id)
      }
    }
    checkUser()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []
      const newFiles: File[] = []
      
      Array.from(files).forEach(file => {
        newFiles.push(file)
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
            if (newImages.length === files.length) {
              setImages([...images, ...newImages].slice(0, 5))
              setImageFiles([...imageFiles, ...newFiles].slice(0, 5))
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setError(null)

    try {
      if (!userId) {
        throw new Error('Kullanıcı oturumu bulunamadı')
      }

      // 1. Upload images to Supabase Storage
      const imageUrls: string[] = []
      for (const file of imageFiles) {
        const imageUrl = await uploadImage(file, userId)
        if (imageUrl) {
          imageUrls.push(imageUrl)
        }
      }

      // 2. Create item in database
      const item = await createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        condition: formData.condition as any,
        estimated_value: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
        images: imageUrls,
        owner_id: userId
      })

      console.log('✅ Ürün başarıyla oluşturuldu:', item)
      setIsUploading(false)
      setUploadSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err: any) {
      console.error('❌ Upload hatası:', err)
      setError(err.message || 'Bir hata oluştu')
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ürün Yüklendi! 🎉</h2>
          <p className="text-gray-600">Ana sayfaya yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-md mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Ürün Yükle
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-24">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📸 Fotoğraflar (En fazla 5)</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {images.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Ekle</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">İlk fotoğraf kapak resmi olacaktır</p>
          </div>

          {/* Title */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Adı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Örn: Vintage Jean Ceket"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Ürünün detaylarını yazın..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Category */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kategori *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value })}
                  className={`py-3 px-4 rounded-lg border-2 transition-all ${
                    formData.category === category.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Durumu *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {conditions.map(condition => (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: condition.value })}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                    formData.condition === condition.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {condition.name}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Value */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahmini Değer (₺)
            </label>
            <input
              type="number"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              placeholder="Örn: 500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">Opsiyonel: Ürünün yaklaşık değeri</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || images.length === 0}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Ürünü Yükle
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
