import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginEvents, RewardAdPluginEvents, AdMobRewardItem, AdLoadInfo } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Test ID'leri - Gerçek ID'lerle değiştirilecek
export const AD_IDS = {
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID
    android: 'ca-app-pub-3940256099942544/1033173712', // Test ID
  },
  rewarded: {
    ios: 'ca-app-pub-3940256099942544/1712485313', // Test ID
    android: 'ca-app-pub-3940256099942544/5224354917', // Test ID
  },
};

// Platform bazlı ad ID'si al
function getAdId(type: 'banner' | 'interstitial' | 'rewarded'): string {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' ? AD_IDS[type].ios : AD_IDS[type].android;
}

// AdMob'u başlat
export async function initializeAdMob(): Promise<void> {
  try {
    // Web platformunda AdMob çalışmaz
    if (!Capacitor.isNativePlatform()) {
      console.log('AdMob is not available on web platform');
      return;
    }

    // Types for AdMob.initialize may vary across versions; keep only known fields
    await AdMob.initialize({
      initializeForTesting: true,
    } as any);

    console.log('AdMob initialized successfully');
  } catch (error) {
    console.error('AdMob initialization error:', error);
  }
}

// Banner Reklam Göster
export async function showBannerAd(position: BannerAdPosition = BannerAdPosition.BOTTOM_CENTER): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;

    const options: BannerAdOptions = {
      adId: getAdId('banner'),
      adSize: BannerAdSize.BANNER,
      position: position,
      margin: 0,
      isTesting: true, // Test modunda
    };

    await AdMob.showBanner(options);
    console.log('Banner ad shown');
  } catch (error) {
    console.error('Error showing banner ad:', error);
  }
}

// Banner Reklamı Gizle
export async function hideBannerAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;
    await AdMob.hideBanner();
    console.log('Banner ad hidden');
  } catch (error) {
    console.error('Error hiding banner ad:', error);
  }
}

// Banner Reklamı Kaldır
export async function removeBannerAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;
    await AdMob.removeBanner();
    console.log('Banner ad removed');
  } catch (error) {
    console.error('Error removing banner ad:', error);
  }
}

// Interstitial Reklamı Hazırla
export async function prepareInterstitialAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;

    await AdMob.prepareInterstitial({
      adId: getAdId('interstitial'),
      isTesting: true,
    });

    console.log('Interstitial ad prepared');
  } catch (error) {
    console.error('Error preparing interstitial ad:', error);
  }
}

// Interstitial Reklamı Göster
export async function showInterstitialAd(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform()) return false;

    await AdMob.showInterstitial();
    console.log('Interstitial ad shown');
    return true;
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    return false;
  }
}

// Interstitial Reklam Event Listener'ları
export function addInterstitialAdListeners(
  onLoaded?: () => void,
  onFailedToLoad?: (error: any) => void,
  onShowed?: () => void,
  onFailedToShow?: (error: any) => void,
  onDismissed?: () => void
): void {
  if (!Capacitor.isNativePlatform()) return;

  if (onLoaded) {
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log('Interstitial ad loaded', info);
      onLoaded();
    });
  }

  if (onFailedToLoad) {
    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
      console.error('Interstitial ad failed to load', error);
      onFailedToLoad(error);
    });
  }

  if (onShowed) {
    AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
      console.log('Interstitial ad showed');
      onShowed();
    });
  }

  if (onFailedToShow) {
    AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error) => {
      console.error('Interstitial ad failed to show', error);
      onFailedToShow(error);
    });
  }

  if (onDismissed) {
    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log('Interstitial ad dismissed');
      onDismissed();
    });
  }
}

// Rewarded Reklamı Hazırla
export async function prepareRewardedAd(): Promise<void> {
  try {
    if (!Capacitor.isNativePlatform()) return;

    await AdMob.prepareRewardVideoAd({
      adId: getAdId('rewarded'),
      isTesting: true,
    });

    console.log('Rewarded ad prepared');
  } catch (error) {
    console.error('Error preparing rewarded ad:', error);
  }
}

// Rewarded Reklamı Göster
export async function showRewardedAd(): Promise<boolean> {
  try {
    if (!Capacitor.isNativePlatform()) return false;

    await AdMob.showRewardVideoAd();
    console.log('Rewarded ad shown');
    return true;
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
    return false;
  }
}

// Rewarded Reklam Event Listener'ları
export function addRewardedAdListeners(
  onLoaded?: () => void,
  onFailedToLoad?: (error: any) => void,
  onShowed?: () => void,
  onFailedToShow?: (error: any) => void,
  onDismissed?: () => void,
  onRewarded?: (reward: AdMobRewardItem) => void
): void {
  if (!Capacitor.isNativePlatform()) return;

  if (onLoaded) {
    AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      console.log('Rewarded ad loaded', info);
      onLoaded();
    });
  }

  if (onFailedToLoad) {
    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
      console.error('Rewarded ad failed to load', error);
      onFailedToLoad(error);
    });
  }

  if (onShowed) {
    AdMob.addListener(RewardAdPluginEvents.Showed, () => {
      console.log('Rewarded ad showed');
      onShowed();
    });
  }

  if (onFailedToShow) {
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
      console.error('Rewarded ad failed to show', error);
      onFailedToShow(error);
    });
  }

  if (onDismissed) {
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('Rewarded ad dismissed');
      onDismissed();
    });
  }

  if (onRewarded) {
    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
      console.log('User earned reward:', reward);
      onRewarded(reward);
    });
  }
}

// Tüm event listener'ları temizle
export function removeAllAdListeners(): void {
  if (!Capacitor.isNativePlatform()) return;
  
  // Interstitial listeners
  // Some versions may not expose removeAllListeners in types; guard at runtime
  (AdMob as any).removeAllListeners?.();
  console.log('All ad listeners removed');
}

// Swipe sayacı için helper
export class SwipeCounter {
  private count: number = 0;
  private threshold: number;
  private onThresholdReached: () => void;

  constructor(threshold: number, onThresholdReached: () => void) {
    this.threshold = threshold;
    this.onThresholdReached = onThresholdReached;
  }

  increment(): void {
    this.count++;
    if (this.count >= this.threshold) {
      this.count = 0;
      this.onThresholdReached();
    }
  }

  reset(): void {
    this.count = 0;
  }

  getCount(): number {
    return this.count;
  }
}

