/**
 * Camera Plugin Wrapper with Comprehensive Logging
 * Kamera açılma sorunlarını yakalamak için detaylı loglar
 */

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'
import { logger } from './logger'

const CATEGORY = 'CAMERA'

export interface CameraOptions {
  quality?: number
  allowEditing?: boolean
  resultType?: CameraResultType
  source?: CameraSource
  saveToGallery?: boolean
  correctOrientation?: boolean
  width?: number
  height?: number
}

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

    const permissions = await Camera.checkPermissions()
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

    const permissions = await Camera.requestPermissions({ permissions: ['camera', 'photos'] })
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
    const defaultOptions: CameraOptions = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: false,
      correctOrientation: true,
      width: 1920,
      height: 1920,
      ...options
    }
    
    logger.debug(CATEGORY, 'Final camera options', defaultOptions)
    
    // Take photo
    logger.info(CATEGORY, '📸 Calling Camera.getPhoto()...')
    const photo = await Camera.getPhoto(defaultOptions)
    
    logger.info(CATEGORY, '✅ Photo captured successfully', {
      format: photo.format,
      saved: photo.saved,
      webPath: photo.webPath ? '(exists)' : '(none)',
      path: photo.path ? '(exists)' : '(none)'
    })
    
    end()
    return photo
  } catch (error: any) {
    logger.error(CATEGORY, '❌ Error taking photo', error, {
      message: error?.message,
      code: error?.code,
      name: error?.name
    })
    
    end()
    
    // User cancelled
    if (error?.message?.includes('cancel') || error?.code === 'USER_CANCELLED') {
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
    const defaultOptions: CameraOptions = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      correctOrientation: true,
      ...options
    }
    
    logger.debug(CATEGORY, 'Final gallery options', defaultOptions)
    
    // Pick photo
    logger.info(CATEGORY, '🖼️ Calling Camera.getPhoto() with Photos source...')
    const photo = await Camera.getPhoto(defaultOptions)
    
    logger.info(CATEGORY, '✅ Photo picked successfully', {
      format: photo.format,
      webPath: photo.webPath ? '(exists)' : '(none)',
      path: photo.path ? '(exists)' : '(none)'
    })
    
    end()
    return photo
  } catch (error: any) {
    logger.error(CATEGORY, '❌ Error picking photo', error, {
      message: error?.message,
      code: error?.code,
      name: error?.name
    })
    
    end()
    
    // User cancelled
    if (error?.message?.includes('cancel') || error?.code === 'USER_CANCELLED') {
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
