import { Capacitor } from '@capacitor/core';

// AdMob modülünü dinamik olarak yükle
let AdMobModule: typeof import('@capacitor-community/admob') | null = null;

async function getAdMobModule() {
  if (AdMobModule) return AdMobModule;
  
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  
  try {
    AdMobModule = await import('@capacitor-community/admob');
    return AdMobModule;
  } catch (error) {
    console.warn('AdMob modülü yüklenemedi:', error);
    return null;
  }
}

// AdMob'u başlat
export async function initializeAdMob(): Promise<void> {
  try {
    // Web platformunda AdMob çalışmaz
    if (!Capacitor.isNativePlatform()) {
      console.log('Ads are not available on web platform');
      return;
    }

    const admob = await getAdMobModule();
    if (!admob) return;

    await admob.AdMob.initialize({ initializeForTesting: true });

    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization error:', error);
  }
}

// BANNER REKLAMLAR KALDIRILDI - SADECE INTERSTITIAL REKLAMLAR

// AdMob interstitial hazır mı durumunu takip et
let interstitialReady = false;

// Interstitial Reklamı Hazırla
export async function prepareInterstitialAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;

    const admob = await getAdMobModule();
    if (!admob) return;

    // Test Interstitial Ad ID
    await admob.AdMob.prepareInterstitial({
      adId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial Ad ID
      isTesting: true
    });

    console.log('Interstitial ad prepared successfully');
  } catch (error) {
    console.error('Error preparing interstitial ad:', error);
  }
}

// Interstitial Reklamı Göster
export async function showInterstitialAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;

    const admob = await getAdMobModule();
    if (!admob) return;

    await admob.AdMob.showInterstitial();
    console.log('Interstitial ad shown successfully');
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    // Reklam gösterilemezse sessizce devam et
  }
}

// Interstitial Reklam Event Listener'ları
export async function addInterstitialAdListeners(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const admob = await getAdMobModule();
  if (!admob) return;

  // Remove existing listeners first
  removeAllAdListeners();

  const { AdMob, InterstitialAdPluginEvents } = admob;

  // Reklam yüklendiğinde
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info) => {
    console.log('Interstitial ad loaded:', info);
    interstitialReady = true;
  });

  // Reklam yüklenemediğinde
  AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
    console.error('Interstitial ad failed to load:', error);
    interstitialReady = false;
  });

  // Reklam gösterildiğinde
  AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
    console.log('Interstitial ad showed');
    interstitialReady = false;
    // Yeni reklam hazırla
    prepareInterstitialAd();
  });

  // Reklam gösterilemediğinde
  AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error) => {
    console.error('Interstitial ad failed to show:', error);
    interstitialReady = false;
  });

  // Reklam kapatıldığında
  AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
    console.log('Interstitial ad dismissed');
    interstitialReady = false;
    // Yeni reklam hazırla
    prepareInterstitialAd();
  });
}

// Tüm Event Listener'ları Kaldır
export function removeAllAdListeners(): void {
  if (!Capacitor.isNativePlatform()) return;
  // AdMob removeAllListeners metodu mevcut değil
  console.log('Ad listeners cleanup requested');
}

// Interstitial hazır mı?
export function isAdMobInterstitialReady(): boolean {
  return interstitialReady;
}

// Swipe Counter Class - Interstitial reklamlar için
export class SwipeCounter {
  private count: number = 0;
  private threshold: number;
  private callback: () => void;

  constructor(threshold: number, callback: () => void) {
    this.threshold = threshold;
    this.callback = callback;
  }

  increment(): void {
    this.count++;
    if (this.count >= this.threshold) {
      this.count = 0; // Reset counter
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