/**
 * Camera Plugin Wrapper with Comprehensive Logging
 * Kamera açılma sorunlarını yakalamak için detaylı loglar
 */

import { Capacitor } from '@capacitor/core'
import { logger } from './logger'

// Type imports only (won't be included in bundle)
import type {
  CameraResultType as CameraResultTypeEnum,
  CameraSource as CameraSourceEnum,
  ImageOptions,
  Photo
} from '@capacitor/camera'

const CATEGORY = 'CAMERA'

// Re-export types for external use
export type { Photo }

// Camera plugin'i ve sabitleri dinamik olarak yükle
let CameraModule: typeof import('@capacitor/camera') | null = null
let CameraResultType: typeof CameraResultTypeEnum
let CameraSource: typeof CameraSourceEnum

async function getCameraModule() {
  if (CameraModule) return CameraModule
  
  if (!Capacitor.isNativePlatform()) {
    return null
  }
  
  try {
    CameraModule = await import('@capacitor/camera')
    CameraResultType = CameraModule.CameraResultType
    CameraSource = CameraModule.CameraSource
    return CameraModule
  } catch (error) {
    logger.warn(CATEGORY, 'Camera plugin yüklenemedi', error as Error)
    return null
  }
}

export interface CameraOptions extends Partial<ImageOptions> {}

/**
 * Check camera permissions
 */
export async function checkCameraPermissions(): Promise<boolean> {
  const end = logger.track(CATEGORY, 'checkCameraPermissions')
  
  try {
    logger.info(CATEGORY, '📸 Checking camera permissions...')
    
    if (!Capacitor.isNativePlatform()) {
      logger.info(CATEGORY, 'Not a native platform, permissions check skipped')
      end()
      return true
    }

    const cameraModule = await getCameraModule()
    if (!cameraModule) {
      logger.warn(CATEGORY, 'Camera module not available')
      end()
      return false
    }

    const permissions = await cameraModule.Camera.checkPermissions()
    logger.info(CATEGORY, 'Camera permissions status', permissions)
    
    const hasPermission = permissions.camera === 'granted' || permissions.photos === 'granted'
    
    if (hasPermission) {
      logger.info(CATEGORY, '✅ Camera permissions granted')
    } else {
      logger.warn(CATEGORY, '⚠️ Camera permissions not granted', permissions)
    }
    
    end()
    return hasPermission
  } catch (error) {
    logger.error(CATEGORY, '❌ Error checking camera permissions', error as Error)
    end()
    throw error
  }
}

/**
 * Request camera permissions
 */
export async function requestCameraPermissions(): Promise<boolean> {
  const end = logger.track(CATEGORY, 'requestCameraPermissions')
  
  try {
    logger.info(CATEGORY, '📸 Requesting camera permissions...')
    
    if (!Capacitor.isNativePlatform()) {
      logger.info(CATEGORY, 'Not a native platform, returning true')
      end()
      return true
    }

    const cameraModule = await getCameraModule()
    if (!cameraModule) {
      logger.warn(CATEGORY, 'Camera module not available')
      end()
      return false
    }

    const permissions = await cameraModule.Camera.requestPermissions({ permissions: ['camera', 'photos'] })
    logger.info(CATEGORY, 'Camera permissions request result', permissions)
    
    const granted = permissions.camera === 'granted' || permissions.photos === 'granted'
    
    if (granted) {
      logger.info(CATEGORY, '✅ Camera permissions granted by user')
    } else {
      logger.warn(CATEGORY, '❌ Camera permissions denied by user', permissions)
    }
    
    end()
    return granted
  } catch (error) {
    logger.error(CATEGORY, '❌ Error requesting camera permissions', error as Error)
    end()
    throw error
  }
}

/**
 * Take a photo with camera
 */
export async function takePhoto(options?: CameraOptions): Promise<Photo | null> {
  const end = logger.track(CATEGORY, 'takePhoto', options)
  
  try {
    logger.info(CATEGORY, '📸 Opening camera...')
    logger.debug(CATEGORY, 'Camera options', options)
    
    // Check platform
    const platform = Capacitor.getPlatform()
    logger.info(CATEGORY, `Platform: ${platform}`)
    
    if (!Capacitor.isNativePlatform()) {
      logger.warn(CATEGORY, 'Camera not available on web platform')
      end()
      return null
    }

    const cameraModule = await getCameraModule()
    if (!cameraModule) {
      logger.error(CATEGORY, 'Camera module not available')
      end()
      return null
    }

    // Check permissions first
    logger.info(CATEGORY, 'Step 1: Checking permissions...')
    const hasPermission = await checkCameraPermissions()
    
    if (!hasPermission) {
      logger.warn(CATEGORY, 'No permission, requesting...')
      const granted = await requestCameraPermissions()
      
      if (!granted) {
        logger.error(CATEGORY, '❌ Camera permission denied, cannot take photo')
        throw new Error('Kamera izni verilmedi. Lütfen ayarlardan kamera iznini açın.')
      }
    }
    
    logger.info(CATEGORY, 'Step 2: Permissions OK, opening camera...')
    
    // Default options
    const defaultOptions: ImageOptions = {
      quality: 90,
      allowEditing: false,
      resultType: cameraModule.CameraResultType.DataUrl, // DataUrl ensures webPath is always available
      source: cameraModule.CameraSource.Camera,
      saveToGallery: false,
      correctOrientation: true,
      width: 1920,
      height: 1920,
      ...options
    }
    
    logger.debug(CATEGORY, 'Final camera options', defaultOptions)
    
    // Take photo
    logger.info(CATEGORY, '📸 Calling Camera.getPhoto()...')
    const photo = await cameraModule.Camera.getPhoto(defaultOptions)
    
    logger.info(CATEGORY, '✅ Photo captured successfully', {
      format: photo.format,
      saved: photo.saved,
      webPath: photo.webPath ? '(exists)' : '(none)',
      path: photo.path ? '(exists)' : '(none)'
    })
    
    end()
    return photo
  } catch (error: unknown) {
    const err = error as Error & { code?: string }
    logger.error(CATEGORY, '❌ Error taking photo', err, {
      message: err?.message,
      code: err?.code,
      name: err?.name
    })
    
    end()
    
    // User cancelled
    if (err?.message?.includes('cancel') || err?.code === 'USER_CANCELLED') {
      logger.info(CATEGORY, 'User cancelled camera')
      return null
    }
    
    throw error
  }
}

/**
 * Pick image from gallery
 */
export async function pickImage(options?: CameraOptions): Promise<Photo | null> {
  const end = logger.track(CATEGORY, 'pickImage', options)
  
  try {
    logger.info(CATEGORY, '🖼️ Opening gallery...')
    logger.debug(CATEGORY, 'Gallery options', options)
    
    // Check platform
    const platform = Capacitor.getPlatform()
    logger.info(CATEGORY, `Platform: ${platform}`)
    
    if (!Capacitor.isNativePlatform()) {
      logger.warn(CATEGORY, 'Gallery not available on web platform')
      end()
      return null
    }

    const cameraModule = await getCameraModule()
    if (!cameraModule) {
      logger.error(CATEGORY, 'Camera module not available')
      end()
      return null
    }

    // Check permissions
    logger.info(CATEGORY, 'Step 1: Checking permissions...')
    const hasPermission = await checkCameraPermissions()
    
    if (!hasPermission) {
      logger.warn(CATEGORY, 'No permission, requesting...')
      const granted = await requestCameraPermissions()
      
      if (!granted) {
        logger.error(CATEGORY, '❌ Gallery permission denied')
        throw new Error('Galeri izni verilmedi. Lütfen ayarlardan galeri iznini açın.')
      }
    }
    
    logger.info(CATEGORY, 'Step 2: Permissions OK, opening gallery...')
    
    // Default options
    const defaultOptions: ImageOptions = {
      quality: 90,
      allowEditing: false,
      resultType: cameraModule.CameraResultType.DataUrl, // DataUrl ensures webPath is always available
      source: cameraModule.CameraSource.Photos,
      correctOrientation: true,
      ...options
    }
    
    logger.debug(CATEGORY, 'Final gallery options', defaultOptions)
    
    // Pick photo
    logger.info(CATEGORY, '🖼️ Calling Camera.getPhoto() with Photos source...')
    const photo = await cameraModule.Camera.getPhoto(defaultOptions)
    
    logger.info(CATEGORY, '✅ Photo picked successfully', {
      format: photo.format,
      webPath: photo.webPath ? '(exists)' : '(none)',
      path: photo.path ? '(exists)' : '(none)'
    })
    
    end()
    return photo
  } catch (error: unknown) {
    const err = error as Error & { code?: string }
    logger.error(CATEGORY, '❌ Error picking photo', err, {
      message: err?.message,
      code: err?.code,
      name: err?.name
    })
    
    end()
    
    // User cancelled
    if (err?.message?.includes('cancel') || err?.code === 'USER_CANCELLED') {
      logger.info(CATEGORY, 'User cancelled gallery')
      return null
    }
    
    throw error
  }
}

/**
 * Pick multiple images (iOS 14+)
 */
export async function pickMultipleImages(options?: CameraOptions): Promise<Photo[]> {
  const end = logger.track(CATEGORY, 'pickMultipleImages', options)
  
  try {
    logger.info(CATEGORY, '🖼️📚 Opening gallery for multiple selection...')
    
    // For now, pick one image (Capacitor Camera doesn't support multiple yet)
    // Can be extended with custom plugin
    const photo = await pickImage(options)
    
    end()
    return photo ? [photo] : []
  } catch (error) {
    logger.error(CATEGORY, '❌ Error picking multiple photos', error as Error)
    end()
    throw error
  }
}
