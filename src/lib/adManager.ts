import { Capacitor } from '@capacitor/core';
import {
  initializeAdMob,
  prepareInterstitialAd as prepareAdMobInterstitial,
  showInterstitialAd as showAdMobInterstitial,
  addInterstitialAdListeners as addAdMobInterstitialListeners,
  isAdMobInterstitialReady,
} from './admob';
import {
  initializeUnityAds,
  prepareUnityInterstitial,
  showUnityInterstitial,
  isUnityAdsReady,
} from './unityAds';

/**
 * Reklam Yöneticisi
 * Unity Ads öncelikli, Unity yoksa AdMob kullanır
 */

let isInitialized = false;
let useUnityAds = true; // Unity Ads öncelikli
let unityAdsAvailable = false;

/**
 * Reklam sistemini başlat (Unity + AdMob)
 */
export async function initializeAds(): Promise<void> {
  if (isInitialized) return;

  try {
    if (!Capacitor.isNativePlatform()) {
      console.log('Ads are not available on web platform');
      return;
    }

    console.log('Initializing Ad Manager (Unity Ads + AdMob)...');

    // Unity Ads'i dene
    unityAdsAvailable = await initializeUnityAds();
    
    if (unityAdsAvailable) {
      console.log('✅ Unity Ads initialized successfully - will be used as primary');
      useUnityAds = true;
      await prepareUnityInterstitial();
    } else {
      console.log('⚠️ Unity Ads not available, falling back to AdMob');
      useUnityAds = false;
      await initializeAdMob();
      // AdMob interstitial event dinleyicilerini ekle ve hazırlık yap
      addAdMobInterstitialListeners();
      await prepareAdMobInterstitial();
    }

    isInitialized = true;
    console.log(`Ad Manager initialized. Using: ${useUnityAds ? 'Unity Ads' : 'AdMob'}`);
  } catch (error) {
    console.error('Ad Manager initialization error:', error);
  }
}

/**
 * Interstitial Reklamı Hazırla (Unity veya AdMob)
 */
export async function prepareInterstitial(): Promise<void> {
  try {
    if (!isInitialized) {
      await initializeAds();
    }

    if (useUnityAds && unityAdsAvailable) {
      await prepareUnityInterstitial();
    } else {
      await prepareAdMobInterstitial();
    }
  } catch (error) {
    console.error('Error preparing interstitial:', error);
  }
}

/**
 * Interstitial Reklamı Göster (Unity veya AdMob)
 */
export async function showInterstitial(): Promise<boolean> {
  try {
    if (!isInitialized) {
      console.warn('Ad Manager not initialized');
      return false;
    }

    // Unity Ads kullan (eğer hazırsa)
    if (useUnityAds && unityAdsAvailable && isUnityAdsReady()) {
      console.log('📺 Showing Unity Ads Interstitial');
      return await showUnityInterstitial();
    }

    // Unity yoksa veya hazır değilse AdMob kullan
    console.log('📺 Showing AdMob Interstitial (Unity not ready)');
    await showAdMobInterstitial();
    return true;
  } catch (error) {
    console.error('Error showing interstitial:', error);
    return false;
  }
}

/**
 * Reklam hazır mı kontrol et
 */
export function isInterstitialReady(): boolean {
  if (useUnityAds && unityAdsAvailable) {
    return isUnityAdsReady();
  }
  // AdMob için gerçek ready bilgisini döndür
  return isAdMobInterstitialReady();
}

/**
 * Hangi reklam sistemi kullanılıyor
 */
export function getActiveAdNetwork(): 'unity' | 'admob' | 'none' {
  if (!isInitialized) return 'none';
  if (useUnityAds && unityAdsAvailable) return 'unity';
  return 'admob';
}

// Swipe Counter Class - Her iki reklam sistemi için
export class AdSwipeCounter {
  private count: number = 0;
  private threshold: number;
  private callback: () => void;

  constructor(threshold: number, callback: () => void) {
    this.threshold = threshold;
    this.callback = callback;
  }

  increment(): void {
    this.count++;
    console.log(`Swipe counter: ${this.count}/${this.threshold}`);
    
    if (this.count >= this.threshold) {
      this.count = 0; // Reset counter
      console.log('🎯 Threshold reached, triggering ad callback');
      this.callback(); // Show ad
    }
  }

  reset(): void {
    this.count = 0;
  }

  getCount(): number {
    return this.count;
  }
}
