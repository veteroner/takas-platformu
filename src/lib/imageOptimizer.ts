import imageCompression from 'browser-image-compression'

export interface ImageOptimizationOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

/**
 * Agresif resim optimizasyonu (300 KB max, WebP format)
 * - %90-95 boyut azaltma
 * - Modern WebP formatı
 * - Hızlı upload
 * - 500,000+ fotoğraf kapasitesi
 */
export async function optimizeImage(
  file: File,
  options?: ImageOptimizationOptions
): Promise<File> {
  const defaultOptions: ImageOptimizationOptions = {
    maxSizeMB: 0.3, // 300 KB maximum
    maxWidthOrHeight: 1920, // Full HD max
    useWebWorker: true, // Performance boost
    fileType: 'image/webp', // Modern, efficient format
    ...options
  }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: defaultOptions.maxSizeMB!,
      maxWidthOrHeight: defaultOptions.maxWidthOrHeight!,
      useWebWorker: defaultOptions.useWebWorker!,
      fileType: defaultOptions.fileType
    })

    // Log compression stats
    const originalSizeMB = (file.size / 1024 / 1024).toFixed(2)
    const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2)
    const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1)
    
    console.log(`📷 Resim optimize edildi:
      Orjinal: ${originalSizeMB} MB
      Sıkıştırılmış: ${compressedSizeMB} MB
      Azalma: ${reduction}%
      Format: ${compressedFile.type}`)

    return compressedFile
  } catch (error) {
    console.error('❌ Resim optimizasyonu hatası:', error)
    throw new Error('Resim optimize edilemedi. Lütfen başka bir resim deneyin.')
  }
}

/**
 * Thumbnail oluşturma (300x300, liste görünümü için)
 */
export async function createThumbnail(file: File): Promise<File> {
  return optimizeImage(file, {
    maxSizeMB: 0.05, // 50 KB max
    maxWidthOrHeight: 300,
    fileType: 'image/webp'
  })
}

/**
 * Medium boyutlu resim (800x600, detay sayfası için)
 */
export async function createMediumImage(file: File): Promise<File> {
  return optimizeImage(file, {
    maxSizeMB: 0.15, // 150 KB max
    maxWidthOrHeight: 800,
    fileType: 'image/webp'
  })
}

/**
 * Çoklu resim optimizasyonu (paralel işlem)
 */
export async function optimizeImages(files: File[]): Promise<File[]> {
  const optimizationPromises = files.map(file => optimizeImage(file))
  return Promise.all(optimizationPromises)
}

/**
 * Resim doğrulama ve ön kontrol
 */
export function validateImage(file: File): {
  valid: boolean
  error?: string
} {
  // Dosya tipi kontrolü
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Sadece JPG, PNG ve WebP formatları desteklenir.'
    }
  }

  // Boyut kontrolü (max 10 MB orjinal)
  const maxSizeMB = 10
  const fileSizeMB = file.size / 1024 / 1024
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `Resim boyutu çok büyük (${fileSizeMB.toFixed(1)} MB). Maksimum ${maxSizeMB} MB olmalıdır.`
    }
  }

  return { valid: true }
}

/**
 * Resim önizleme URL'i oluşturma
 */
export function createPreviewURL(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Önizleme URL'ini temizleme (memory leak önleme)
 */
export function revokePreviewURL(url: string): void {
  URL.revokeObjectURL(url)
}
