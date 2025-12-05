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
 * App plugin'i dinamik olarak yükle (sadece native platformda)
 */
async function getAppPlugin() {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const { App } = await import('@capacitor/app');
    return App;
  } catch {
    console.warn('App plugin yüklenemedi');
    return null;
  }
}

/**
 * iOS ATT izni iste
 * NOT: Info.plist'e NSUserTrackingUsageDescription eklenmeli:
 * "Kişiselleştirilmiş reklamlar ve içerik için izleme izni gereklidir."
 */
export async function requestTrackingPermission(): Promise<TrackingPermission> {
  // Web platformunda izin gerekmez
  if (!Capacitor.isNativePlatform()) {
    return { granted: true, status: 'unavailable' };
  }

  const platform = Capacitor.getPlatform();

  // iOS için ATT kontrolü
  if (platform === 'ios') {
    try {
      // iOS 14.5+ ATT framework'ü gerektirir
      // Capacitor plugin ile entegre edilmeli (örn: @capacitor/app-tracking-transparency)
      
      console.log('iOS ATT permission flow started');
      const App = await getAppPlugin();
      if (App) {
        const info = await App.getInfo();
        console.log('App info (ATT context):', info);
      }
      // Gerçek ATT diyaloğu için native plugin entegrasyonu eklenecek.
      return { granted: true, status: 'authorized' };
    } catch (error) {
      console.error('ATT permission error:', error);
      return { granted: false, status: 'denied' };
    }
  }

  // Android için (GDPR uyumlu consent dialog)
  if (platform === 'android') {
    try {
      console.log('Android tracking permission handled via AdMob consent');
      
      // AdMob consent form zaten GDPR uyumlu
      // Ek bir dialog gerekmez
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
    try {
      const App = await getAppPlugin();
      if (App) {
        const info = await App.getInfo();
        console.log('App info (ATT check):', info);
      }
      return { granted: true, status: 'authorized' };
    } catch (error) {
      console.error('ATT check error:', error);
      return { granted: false, status: 'denied' };
    }
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
    // iOS settings URL scheme
    console.log('Opening iOS Settings for ATT');
    // TODO: Plugin ile app-prefs:root=Privacy&path=Tracking açılabilir
  }

  if (platform === 'android') {
    // Android settings intent
    console.log('Opening Android Settings');
    // TODO: Plugin ile ayarlar açılabilir
  }
}
