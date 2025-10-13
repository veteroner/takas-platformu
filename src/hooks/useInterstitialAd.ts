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
  show: () => Promise<boolean>;
  prepare: () => Promise<void>;
}

/**
 * Interstitial Reklam Hook'u
 * Tam ekran reklam göstermek için kullanılır
 */
export function useInterstitialAd(): UseInterstitialAdReturn {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // İlk yüklemede reklamı hazırla
    prepareInterstitialAd();

    // Event listener'ları ekle
    addInterstitialAdListeners(
      // onLoaded
      () => {
        setIsReady(true);
      },
      // onFailedToLoad
      () => {
        setIsReady(false);
      },
      // onShowed
      () => {
        setIsReady(false);
      },
      // onFailedToShow
      () => {
        setIsReady(false);
      },
      // onDismissed
      () => {
        // Reklam kapatıldıktan sonra yeni bir reklam hazırla
        prepareInterstitialAd();
      }
    );

    // Cleanup
    return () => {
      removeAllAdListeners();
    };
  }, []);

  const show = useCallback(async (): Promise<boolean> => {
    if (!isReady) {
      console.warn('Interstitial ad is not ready yet');
      return false;
    }
    return await showInterstitialAd();
  }, [isReady]);

  const prepare = useCallback(async (): Promise<void> => {
    await prepareInterstitialAd();
  }, []);

  return { isReady, show, prepare };
}

