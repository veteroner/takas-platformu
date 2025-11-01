'use client'

import { useEffect, useCallback, useState } from 'react';
import {
  initializeAds,
  prepareInterstitial,
  showInterstitial,
  isInterstitialReady,
  getActiveAdNetwork,
} from '@/lib/adManager';

interface UseAdsReturn {
  isReady: boolean;
  show: () => Promise<void>;
  prepare: () => Promise<void>;
  activeNetwork: 'unity' | 'admob' | 'none';
}

/**
 * Unified Reklam Hook'u
 * Unity Ads öncelikli, Unity yoksa AdMob kullanır
 */
export function useAds(): UseAdsReturn {
  const [isReady, setIsReady] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<'unity' | 'admob' | 'none'>('none');

  useEffect(() => {
    // Reklam sistemini başlat
    const init = async () => {
      await initializeAds();
      setActiveNetwork(getActiveAdNetwork());
      setIsReady(isInterstitialReady());
    };

    init();

    // Her 2 saniyede bir ready durumunu kontrol et
    const checkInterval = setInterval(() => {
      setIsReady(isInterstitialReady());
      setActiveNetwork(getActiveAdNetwork());
    }, 2000);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const show = useCallback(async (): Promise<void> => {
    if (!isReady) {
      console.warn('Ad is not ready yet');
      return;
    }
    
    const success = await showInterstitial();
    if (success) {
      setIsReady(false);
      // Yeni reklam hazırla
      setTimeout(() => {
        prepareInterstitial();
      }, 1000);
    }
  }, [isReady]);

  const prepare = useCallback(async (): Promise<void> => {
    await prepareInterstitial();
    setTimeout(() => {
      setIsReady(isInterstitialReady());
    }, 1000);
  }, []);

  return {
    isReady,
    show,
    prepare,
    activeNetwork,
  };
}
