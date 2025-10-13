'use client'

import { useEffect, useCallback, useState } from 'react';
import {
  prepareRewardedAd,
  showRewardedAd,
  addRewardedAdListeners,
  removeAllAdListeners,
} from '@/lib/admob';
import { AdMobRewardItem } from '@capacitor-community/admob';

interface UseRewardedAdReturn {
  isReady: boolean;
  show: () => Promise<boolean>;
  prepare: () => Promise<void>;
  reward: AdMobRewardItem | null;
}

/**
 * Rewarded Reklam Hook'u
 * Kullanıcı reklam izleyince ödül kazanır
 */
export function useRewardedAd(onReward?: (reward: AdMobRewardItem) => void): UseRewardedAdReturn {
  const [isReady, setIsReady] = useState(false);
  const [reward, setReward] = useState<AdMobRewardItem | null>(null);

  useEffect(() => {
    // İlk yüklemede reklamı hazırla
    prepareRewardedAd();

    // Event listener'ları ekle
    addRewardedAdListeners(
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
        prepareRewardedAd();
      },
      // onRewarded
      (rewardItem: AdMobRewardItem) => {
        setReward(rewardItem);
        if (onReward) {
          onReward(rewardItem);
        }
      }
    );

    // Cleanup
    return () => {
      removeAllAdListeners();
    };
  }, [onReward]);

  const show = useCallback(async (): Promise<boolean> => {
    if (!isReady) {
      console.warn('Rewarded ad is not ready yet');
      return false;
    }
    return await showRewardedAd();
  }, [isReady]);

  const prepare = useCallback(async (): Promise<void> => {
    await prepareRewardedAd();
  }, []);

  return { isReady, show, prepare, reward };
}

