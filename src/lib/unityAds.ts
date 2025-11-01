import { Capacitor } from '@capacitor/core';

/**
 * Unity Ads Entegrasyonu
 * Native Unity Ads SDK'sı üzerinden çalışır
 * 
 * NOT: Bu dosya Unity Ads'in native entegrasyonunu sağlar.
 * Android ve iOS için native kod gereklidir.
 */

// Unity Ads Game ID'leri (Test ID'leri - Gerçek ID'ler ile değiştirilmeli)
const UNITY_ADS_CONFIG = {
  android: {
    gameId: '5721307', // Test Game ID for Android
    testMode: true,
    interstitialAdUnitId: 'Interstitial_Android',
  },
  ios: {
    gameId: '5721306', // Test Game ID for iOS  
    testMode: true,
    interstitialAdUnitId: 'Interstitial_iOS',
  }
};

// Unity Ads durumu
let isUnityAdsInitialized = false;
let isUnityInterstitialReady = false;

/**
 * Unity Ads'i başlat
 */
export async function initializeUnityAds(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('Unity Ads is not available on web platform');
      return false;
    }

    const platform = Capacitor.getPlatform();
    const config = platform === 'ios' ? UNITY_ADS_CONFIG.ios : UNITY_ADS_CONFIG.android;

    console.log(`Initializing Unity Ads for ${platform} with Game ID: ${config.gameId}`);

    // Native Unity Ads initialization kodu buraya gelecek
    // Şu an için placeholder
    isUnityAdsInitialized = true;
    
    return true;
  } catch (error) {
    console.error('Unity Ads initialization error:', error);
    return false;
  }
}

/**
 * Unity Interstitial Reklamı Hazırla
 */
export async function prepareUnityInterstitial(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform() || !isUnityAdsInitialized) {
      return false;
    }

    const platform = Capacitor.getPlatform();
    const config = platform === 'ios' ? UNITY_ADS_CONFIG.ios : UNITY_ADS_CONFIG.android;

    console.log(`Preparing Unity Interstitial Ad: ${config.interstitialAdUnitId}`);

    // Native Unity Ads load kodu buraya gelecek
    isUnityInterstitialReady = true;
    
    return true;
  } catch (error) {
    console.error('Error preparing Unity interstitial ad:', error);
    return false;
  }
}

/**
 * Unity Interstitial Reklamı Göster
 */
export async function showUnityInterstitial(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform() || !isUnityAdsInitialized || !isUnityInterstitialReady) {
      console.warn('Unity Ads not ready');
      return false;
    }

    const platform = Capacitor.getPlatform();
    const config = platform === 'ios' ? UNITY_ADS_CONFIG.ios : UNITY_ADS_CONFIG.android;

    console.log(`Showing Unity Interstitial Ad: ${config.interstitialAdUnitId}`);

    // Native Unity Ads show kodu buraya gelecek
    isUnityInterstitialReady = false;
    
    // Reklam gösterildikten sonra yeni reklam hazırla
    setTimeout(() => {
      prepareUnityInterstitial();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error showing Unity interstitial ad:', error);
    return false;
  }
}

/**
 * Unity Ads hazır mı kontrol et
 */
export function isUnityAdsReady(): boolean {
  return isUnityAdsInitialized && isUnityInterstitialReady;
}

/**
 * Unity Ads Game ID'sini al
 */
export function getUnityGameId(): string {
  const platform = Capacitor.getPlatform();
  const config = platform === 'ios' ? UNITY_ADS_CONFIG.ios : UNITY_ADS_CONFIG.android;
  return config.gameId;
}
