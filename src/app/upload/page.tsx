'use client'

import { useState, useEffect } from 'react'
import { Camera, X, Upload, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createItem, uploadImage } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { saveSeekingPreferencesAsync } from '@/lib/preferences'
import { useProductFilter } from '@/hooks/useProductFilter'
import { ProductFilterWarning, InlineProductWarning } from '@/components/ProductFilterWarning'
import { optimizeImage, validateImage, createPreviewURL, revokePreviewURL } from '@/lib/imageOptimizer'
import { takePhoto, pickImage } from '@/lib/cameraWrapper'
import { logger, trackUserAction } from '@/lib/logger'
import { Capacitor } from '@capacitor/core'
import { CameraResultType, CameraSource } from '@capacitor/camera'

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

// Türkiye'nin en popüler 81 ili
const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik',
  'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum',
  'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye',
  'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Şırnak', 'Sivas',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
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
    estimatedValue: '',
    city: '' // Ürünün bulunduğu şehir
  })
  // Seeking preferences local state (simple v1)
  const [seekCategories, setSeekCategories] = useState<Array<'clothing'|'toys'|'electronics'|'books'|'sports'|'home'|'other'>>([])
  const [seekValueMin, setSeekValueMin] = useState<string>('')
  const [seekValueMax, setSeekValueMax] = useState<string>('')
  const [seekCity, setSeekCity] = useState<string>('')
  const [seekClothingSize, setSeekClothingSize] = useState<'XS'|'S'|'M'|'L'|'XL'|'XXL'|''>('')
  const [seekClothingColor, setSeekClothingColor] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState<string>('')
  const [showCameraOptions, setShowCameraOptions] = useState(false)
  
  // Product filter hook
  const { checkProduct, lastResult, clearResult } = useProductFilter()

  // Log component mount
  useEffect(() => {
    logger.info('UPLOAD_PAGE', '📱 Upload page mounted', {
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform()
    })
    
    return () => {
      logger.info('UPLOAD_PAGE', '📱 Upload page unmounted')
    }
  }, [])

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      logger.info('UPLOAD_PAGE', '🔐 Checking user authentication...')
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          // For now, create a guest user ID
          const guestId = `guest-${Date.now()}`
          logger.warn('UPLOAD_PAGE', '⚠️ No authenticated user, using guest ID', { guestId })
          setUserId(guestId)
        } else {
          logger.info('UPLOAD_PAGE', '✅ User authenticated', { userId: user.id })
          setUserId(user.id)
        }
      } catch (error) {
        logger.error('UPLOAD_PAGE', '❌ Error checking authentication', error as Error)
      }
    }
    checkUser()
  }, [])

  const handleCameraCapture = async () => {
    trackUserAction('CAMERA_BUTTON_CLICKED', 'UploadPage')
    
    try {
      logger.info('UPLOAD_PAGE', '📸 User clicked camera button')
      setShowCameraOptions(false)
      setIsOptimizing(true)
      setOptimizationProgress('Kamera açılıyor...')
      setError(null)

      logger.info('UPLOAD_PAGE', '📸 Taking photo...')
      const photo = await takePhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      })

      if (!photo) {
        logger.info('UPLOAD_PAGE', 'User cancelled camera')
        setIsOptimizing(false)
        setOptimizationProgress('')
        return
      }

      logger.info('UPLOAD_PAGE', '✅ Photo captured, processing...', {
        format: photo.format,
        webPath: photo.webPath,
        path: photo.path,
        saved: photo.saved
      })

      setOptimizationProgress('Resim optimize ediliyor...')

      // Convert to File
      logger.debug('UPLOAD_PAGE', 'Fetching photo from webPath', { webPath: photo.webPath })
      
      if (!photo.webPath) {
        const error = new Error('Photo webPath is null or undefined - Camera returned invalid photo')
        logger.error('UPLOAD_PAGE', '❌ WebPath is null!', error, { photo })
        throw error
      }

      const response = await fetch(photo.webPath)
      
      if (!response.ok) {
        const error = new Error(`Failed to fetch photo: ${response.status} ${response.statusText}`)
        logger.error('UPLOAD_PAGE', '❌ Fetch failed!', error, { 
          status: response.status,
          statusText: response.statusText,
          url: photo.webPath
        })
        throw error
      }
      
      const blob = await response.blob()
      logger.debug('UPLOAD_PAGE', 'Blob created', {
        size: blob.size,
        type: blob.type
      })
      
      if (!blob || blob.size === 0) {
        const error = new Error('Blob is empty or null - Photo conversion failed')
        logger.error('UPLOAD_PAGE', '❌ Empty blob!', error, { blob })
        throw error
      }
      
      const file = new File([blob], `photo-${Date.now()}.${photo.format}`, {
        type: `image/${photo.format}`
      })

      logger.info('UPLOAD_PAGE', '✅ Photo converted to File', {
        size: file.size,
        type: file.type,
        name: file.name
      })

      // Validate
      const validation = validateImage(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Optimize
      const optimizedFile = await optimizeImage(file)
      const previewUrl = createPreviewURL(optimizedFile)

      logger.info('UPLOAD_PAGE', '✅ Photo optimized successfully')

      setImages([...images, previewUrl])
      setImageFiles([...imageFiles, optimizedFile])
      setOptimizationProgress('')
    } catch (error: any) {
      logger.error('UPLOAD_PAGE', '❌ Camera capture failed', error, {
        message: error?.message,
        code: error?.code
      })
      
      const userMessage = error?.message || 'Kamera açılırken hata oluştu'
      const errorDetails = `
📸 KAMERA HATASI

Hata: ${error?.message || 'Bilinmeyen hata'}

Kod: ${error?.code || 'N/A'}

Tip: ${error?.name || 'Error'}

Platform: ${Capacitor.getPlatform()}

Native: ${Capacitor.isNativePlatform() ? 'Evet' : 'Hayır'}

WebPath: ${error?.webPath || 'N/A'}

Stack: ${error?.stack?.substring(0, 200) || 'N/A'}
      `.trim()
      
      setError(`📸 Kamera Hatası: ${userMessage}`)
      
      // Show detailed alert on native
      if (Capacitor.isNativePlatform()) {
        alert(errorDetails)
      }
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleGalleryPick = async () => {
    trackUserAction('GALLERY_BUTTON_CLICKED', 'UploadPage')
    
    try {
      logger.info('UPLOAD_PAGE', '🖼️ User clicked gallery button')
      setShowCameraOptions(false)
      setIsOptimizing(true)
      setOptimizationProgress('Galeri açılıyor...')
      setError(null)

      logger.info('UPLOAD_PAGE', '🖼️ Picking from gallery...')
      const photo = await pickImage({
        quality: 90,
        allowEditing: false
      })

      if (!photo) {
        logger.info('UPLOAD_PAGE', 'User cancelled gallery')
        setIsOptimizing(false)
        setOptimizationProgress('')
        return
      }

      logger.info('UPLOAD_PAGE', '✅ Photo picked, processing...', {
        format: photo.format,
        webPath: photo.webPath,
        path: photo.path
      })

      setOptimizationProgress('Resim optimize ediliyor...')

      // Convert to File
      logger.debug('UPLOAD_PAGE', 'Fetching photo from webPath', { webPath: photo.webPath })
      
      if (!photo.webPath) {
        const error = new Error('Photo webPath is null or undefined - Gallery returned invalid photo')
        logger.error('UPLOAD_PAGE', '❌ WebPath is null!', error, { photo })
        throw error
      }

      const response = await fetch(photo.webPath)
      
      if (!response.ok) {
        const error = new Error(`Failed to fetch photo: ${response.status} ${response.statusText}`)
        logger.error('UPLOAD_PAGE', '❌ Fetch failed!', error, { 
          status: response.status,
          statusText: response.statusText,
          url: photo.webPath
        })
        throw error
      }
      
      const blob = await response.blob()
      logger.debug('UPLOAD_PAGE', 'Blob created', {
        size: blob.size,
        type: blob.type
      })
      
      if (!blob || blob.size === 0) {
        const error = new Error('Blob is empty or null - Photo conversion failed')
        logger.error('UPLOAD_PAGE', '❌ Empty blob!', error, { blob })
        throw error
      }
      
      const file = new File([blob], `photo-${Date.now()}.${photo.format}`, {
        type: `image/${photo.format}`
      })

      logger.info('UPLOAD_PAGE', '✅ Photo converted to File', {
        size: file.size,
        type: file.type,
        name: file.name
      })

      // Validate
      const validation = validateImage(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Optimize
      const optimizedFile = await optimizeImage(file)
      const previewUrl = createPreviewURL(optimizedFile)

      logger.info('UPLOAD_PAGE', '✅ Photo optimized successfully')

      setImages([...images, previewUrl])
      setImageFiles([...imageFiles, optimizedFile])
      setOptimizationProgress('')
    } catch (error: any) {
      logger.error('UPLOAD_PAGE', '❌ Gallery pick failed', error, {
        message: error?.message,
        code: error?.code
      })
      
      const userMessage = error?.message || 'Galeri açılırken hata oluştu'
      const errorDetails = `
🖼️ GALERİ HATASI

Hata: ${error?.message || 'Bilinmeyen hata'}

Kod: ${error?.code || 'N/A'}

Tip: ${error?.name || 'Error'}

Platform: ${Capacitor.getPlatform()}

Native: ${Capacitor.isNativePlatform() ? 'Evet' : 'Hayır'}

WebPath: ${error?.webPath || 'N/A'}

Stack: ${error?.stack?.substring(0, 200) || 'N/A'}
      `.trim()
      
      setError(`🖼️ Galeri Hatası: ${userMessage}`)
      
      // Show detailed alert on native
      if (Capacitor.isNativePlatform()) {
        alert(errorDetails)
      }
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    trackUserAction('FILE_INPUT_CHANGED', 'UploadPage')
    
    const files = e.target.files
    if (!files || files.length === 0) return

    logger.info('UPLOAD_PAGE', `📁 File input: ${files.length} files selected`)
    
    setIsOptimizing(true)
    setError(null)

    try {
      const newImages: string[] = []
      const newFiles: File[] = []
      
      const filesToProcess = Array.from(files).slice(0, 5 - images.length)
      logger.info('UPLOAD_PAGE', `Processing ${filesToProcess.length} files...`)
      
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i]
        
        logger.debug('UPLOAD_PAGE', `Processing file ${i + 1}/${filesToProcess.length}`, {
          name: file.name,
          size: file.size,
          type: file.type
        })
        
        setOptimizationProgress(`Resim ${i + 1}/${filesToProcess.length} optimize ediliyor...`)
        
        // Validate image
        const validation = validateImage(file)
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // Optimize image (300 KB max, WebP format)
        const optimizedFile = await optimizeImage(file)
        
        // Create preview URL
        const previewUrl = createPreviewURL(optimizedFile)
        
        newFiles.push(optimizedFile)
        newImages.push(previewUrl)
      }

      logger.info('UPLOAD_PAGE', '✅ All files processed successfully')

      setImages([...images, ...newImages])
      setImageFiles([...imageFiles, ...newFiles])
      setOptimizationProgress('')
      
    } catch (err: any) {
      logger.error('UPLOAD_PAGE', '❌ Image upload error', err)
      setError(err.message || 'Resim yüklenirken hata oluştu')
    } finally {
      setIsOptimizing(false)
    }
  }

  const removeImage = (index: number) => {
    // Revoke preview URL to prevent memory leak
    revokePreviewURL(images[index])
    
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

      // 1. Yasadışı içerik kontrolü
      const filterResult = checkProduct(formData.title, formData.description)
      
      if (filterResult.shouldBlock) {
        setError(filterResult.message || 'Ürün yasadışı içerik nedeniyle yüklenemedi')
        setIsUploading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      // Persist seeking preferences (non-blocking)
      try {
        const filters: any = {}
        if (seekClothingSize || seekClothingColor) {
          filters.clothing = {
            sizeText: seekClothingSize || undefined,
            color: seekClothingColor
              ? seekClothingColor.split(',').map(s => s.trim()).filter(Boolean)
              : undefined,
          }
        }
        await saveSeekingPreferencesAsync({
          categories: seekCategories,
          valueMin: seekValueMin ? Number(seekValueMin) : undefined,
          valueMax: seekValueMax ? Number(seekValueMax) : undefined,
          locationCity: seekCity || undefined,
          filters,
        } as any)
      } catch {}

      // 1. Upload images to Supabase Storage
      logger.info('UPLOAD_PAGE', `📤 Uploading ${imageFiles.length} images to Supabase...`)
      
      const imageUrls: string[] = []
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        logger.info('UPLOAD_PAGE', `Uploading image ${i + 1}/${imageFiles.length}`, {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type
        })
        
        const imageUrl = await uploadImage(file, userId)
        
        if (imageUrl) {
          logger.info('UPLOAD_PAGE', `✅ Image ${i + 1} uploaded successfully`)
          imageUrls.push(imageUrl)
        } else {
          logger.error('UPLOAD_PAGE', `❌ Image ${i + 1} upload failed - returned null`)
        }
      }
      
      logger.info('UPLOAD_PAGE', `Upload complete: ${imageUrls.length}/${imageFiles.length} images uploaded`)
      
      if (imageUrls.length === 0) {
        throw new Error('Hiçbir resim yüklenemedi. Lütfen tekrar deneyin.')
      }

      // 2. Create item in database
      logger.info('UPLOAD_PAGE', '💾 Creating item in database...', {
        title: formData.title,
        category: formData.category,
        imageCount: imageUrls.length
      })
      
      const item = await createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        condition: formData.condition as any,
        estimated_value: formData.estimatedValue ? parseFloat(formData.estimatedValue) : undefined,
        images: imageUrls,
        owner_id: userId,
        location: formData.city // Ürünün bulunduğu şehir
      })

      logger.info('UPLOAD_PAGE', '✅ Item created successfully', { itemId: item?.id })
      
      setIsUploading(false)
      setUploadSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        logger.info('UPLOAD_PAGE', '🔄 Redirecting to home...')
        router.push('/')
      }, 2000)
    } catch (err: any) {
      logger.error('UPLOAD_PAGE', '❌ Upload error', err, {
        message: err?.message,
        stack: err?.stack
      })
      setError(err.message || 'Bir hata oluştu')
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    
    // Clear previous filter result when user edits
    if (lastResult && !lastResult.isClean) {
      clearResult()
      setError(null)
    }
  }

  const toggleSeekCategory = (ct: 'clothing'|'toys'|'electronics'|'books'|'sports'|'home'|'other') => {
    setSeekCategories(prev => prev.includes(ct) ? prev.filter(c => c !== ct) : [...prev, ct])
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
        {/* Illegal Content Warning */}
        {lastResult && !lastResult.isClean && (
          <ProductFilterWarning result={lastResult} className="mb-4" />
        )}

        {/* Error Message */}
        {error && !lastResult && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">📸 Fotoğraflar (En fazla 5)</h3>
              {imageFiles.length > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  ✅ Optimize edildi
                </span>
              )}
            </div>
            
            {/* Optimization Progress */}
            {isOptimizing && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-700 font-medium">{optimizationProgress}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <Image
                    src={image}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* Optimized badge */}
                  <div className="absolute bottom-1 left-1 bg-green-500/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                    WebP
                  </div>
                </div>
              ))}
              
              {images.length < 5 && !showCameraOptions && (
                <button
                  type="button"
                  onClick={() => {
                    trackUserAction('ADD_PHOTO_BUTTON_CLICKED', 'UploadPage')
                    if (Capacitor.isNativePlatform()) {
                      setShowCameraOptions(true)
                    }
                  }}
                  disabled={isOptimizing}
                  className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors ${
                    isOptimizing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Ekle</span>
                  {/* Hidden file input for web fallback */}
                  {!Capacitor.isNativePlatform() && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isOptimizing}
                      className="hidden"
                      onClick={(e) => {
                        // Allow file input on web
                        const target = e.target as HTMLInputElement
                        target.click = () => {}
                      }}
                    />
                  )}
                </button>
              )}
              
              {/* Camera Options Modal (Native only) */}
              {showCameraOptions && Capacitor.isNativePlatform() && images.length < 5 && (
                <div className="aspect-square border-2 border-purple-500 bg-purple-50 rounded-lg p-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={isOptimizing}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex flex-col items-center justify-center text-xs font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    Kamera
                  </button>
                  <button
                    type="button"
                    onClick={handleGalleryPick}
                    disabled={isOptimizing}
                    className="flex-1 bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center text-xs font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    Galeri
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCameraOptions(false)
                      trackUserAction('CAMERA_OPTIONS_CANCELLED', 'UploadPage')
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center text-xs font-semibold"
                  >
                    İptal
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              İlk fotoğraf kapak resmi olacaktır
            </p>
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-[11px] text-green-700 font-medium">
                🚀 Resimler otomatik optimize ediliyor:
              </p>
              <ul className="text-[10px] text-green-600 mt-1 ml-4 list-disc space-y-0.5">
                <li>300 KB maksimum boyut</li>
                <li>Modern WebP formatı</li>
                <li>%90+ daha hızlı yükleme</li>
              </ul>
            </div>
          </div>

          {/* Title */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Ürün Adı *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Örn: Vintage Jean Ceket"
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                lastResult && !lastResult.isClean ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            {lastResult && !lastResult.isClean && (
              <InlineProductWarning result={lastResult} />
            )}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Ürünün detaylarını yazın..."
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                lastResult && !lastResult.isClean ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              }`}
            />
            <p className="text-xs text-gray-600 mt-2">
              ⚠️ Yasadışı içerik (uyuşturucu, silah, vs.) tespit edilirse ürün reddedilir
            </p>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Kategori *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value })}
                  className={`py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                    formData.category === category.value
                      ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Durumu *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {conditions.map(condition => (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: condition.value })}
                  className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.condition === condition.value
                      ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400'
                  }`}
                >
                  {condition.name}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Value */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tahmini Değer (₺)
            </label>
            <input
              type="number"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              placeholder="Örn: 500"
              className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <p className="text-xs text-gray-600 mt-2">Opsiyonel: Ürünün yaklaşık değeri</p>
          </div>

          {/* Location/City */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              📍 Ürünün Bulunduğu Şehir *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Şehir seçin</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-2">Ürününüzün bulunduğu şehri seçin</p>
          </div>

          {/* Seeking Preferences */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">🎯 Ne Arıyorsun?</h3>

            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">Kategoriler (çoklu seçim)</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => toggleSeekCategory(category.value as any)}
                    className={`py-2 px-3 rounded-lg border-2 text-sm transition-all font-medium ${
                      seekCategories.includes(category.value as any)
                        ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-400'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Min Değer (₺)</label>
                <input
                  type="number"
                  value={seekValueMin}
                  onChange={(e) => setSeekValueMin(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Örn: 300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">Max Değer (₺)</label>
                <input
                  type="number"
                  value={seekValueMax}
                  onChange={(e) => setSeekValueMax(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Örn: 1500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Şehir</label>
              <select
                value={seekCity}
                onChange={(e) => setSeekCity(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Şehir seçin</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Clothing filters (simple) */}
            <div className="mt-4 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
              <div className="text-sm font-semibold text-gray-800 mb-2">Giyim Tercihleri (opsiyonel)</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Beden (Text)</label>
                  <select
                    value={seekClothingSize}
                    onChange={(e) => setSeekClothingSize(e.target.value as any)}
                    className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">—</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Renk(ler) virgülle</label>
                  <input
                    type="text"
                    value={seekClothingColor}
                    onChange={(e) => setSeekClothingColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Kırmızı, Siyah"
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Abiye için uygun beden/renkleri girersen eşleşmeler öne çıkar.</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || images.length === 0 || (lastResult !== null && !lastResult.isClean)}
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
          
          {images.length === 0 && (
            <p className="text-center text-sm text-gray-500 -mt-2">
              Ürün yüklemek için en az 1 fotoğraf eklemelisiniz
            </p>
          )}
          
          {lastResult && !lastResult.isClean && (
            <p className="text-center text-sm text-red-600 -mt-2">
              ⚠️ Yasadışı içerik nedeniyle yükleme engellendi
            </p>
          )}
        </form>
      </main>
    </div>
  )
}
