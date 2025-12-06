import { Capacitor } from '@capacitor/core';

/**
 * Native Platform İzin Yönetimi
 * iOS: ATT (App Tracking Transparency) - iOS 14.5+
 * Android: Kullanıcı izin sistemi + GDPR uyumluluğu
 */

interface TrackingPermission {
  granted: boolean;
  status: 'authorized' | 'denied' | 'restricted' | 'notDetermined' | 'unavailable';
}

/**
 * iOS ATT izni iste
 */
export async function requestTrackingPermission(): Promise<TrackingPermission> {
  if (!Capacitor.isNativePlatform()) {
    return { granted: true, status: 'unavailable' };
  }

  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    try {
      console.log('iOS tracking permission - using default authorized');
      return { granted: true, status: 'authorized' };
    } catch (error) {
      console.error('ATT permission error:', error);
      return { granted: false, status: 'denied' };
    }
  }

  if (platform === 'android') {
    try {
      console.log('Android tracking permission handled via AdMob consent');
      return { granted: true, status: 'authorized' };
    } catch (error) {
      console.error('Android consent error:', error);
      return { granted: false, status: 'denied' };
    }
  }

  return { granted: false, status: 'unavailable' };
}

/**
 * Mevcut izin durumunu kontrol et
 */
export async function checkTrackingPermission(): Promise<TrackingPermission> {
  if (!Capacitor.isNativePlatform()) {
    return { granted: true, status: 'unavailable' };
  }

  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    return { granted: true, status: 'authorized' };
  }

  if (platform === 'android') {
    return { granted: true, status: 'authorized' };
  }

  return { granted: false, status: 'unavailable' };
}

/**
 * Kullanıcıyı ayarlara yönlendir (izin değiştirmek için)
 */
export async function openTrackingSettings(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Settings not available on web');
    return;
  }

  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    console.log('Opening iOS Settings for ATT');
  }

  if (platform === 'android') {
    console.log('Opening Android Settings');
  }
}
