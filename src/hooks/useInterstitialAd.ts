'use client'

import { useEffect, useCallback, useState } from 'react';
import {
  prepareInterstitialAd,
  showInterstitialAd,
  addInterstitialAdListeners,
  removeAllAdListeners,
} from '@/lib/admob';

interface UseInterstitialAdReturn {
  isReady: boolean;
  show: () => Promise<void>;
  prepare: () => Promise<void>;
}

/**
 * Interstitial Reklam Hook'u
 * Tam ekran reklam göstermek için kullanılır
 */
export function useInterstitialAd(): UseInterstitialAdReturn {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Event listener'ları ekle
    addInterstitialAdListeners();
    
    // İlk yüklemede reklamı hazırla
    prepareInterstitialAd();

    // Cleanup
    return () => {
      removeAllAdListeners();
    };
  }, []);

  const show = useCallback(async (): Promise<void> => {
    if (!isReady) {
      console.warn('Interstitial ad is not ready yet');
      return;
    }
    await showInterstitialAd();
  }, [isReady]);

  const prepare = useCallback(async (): Promise<void> => {
    await prepareInterstitialAd();
  }, []);

  return { isReady, show, prepare };
}

