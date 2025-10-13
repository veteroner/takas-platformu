'use client'

import { useState } from 'react';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import { Gift, Loader2 } from 'lucide-react';
import { AdMobRewardItem } from '@capacitor-community/admob';

interface RewardedAdButtonProps {
  onRewardEarned?: (reward: AdMobRewardItem) => void;
  buttonText?: string;
  rewardDescription?: string;
  className?: string;
}

/**
 * Rewarded Reklam Butonu
 * Kullanıcı bu butona basıp reklam izlediğinde ödül kazanır
 */
export default function RewardedAdButton({
  onRewardEarned,
  buttonText = 'Reklam İzle',
  rewardDescription = 'Ekstra özellikler kazan',
  className = '',
}: RewardedAdButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { isReady, show } = useRewardedAd((reward: AdMobRewardItem) => {
    console.log('Reward earned:', reward);
    setShowSuccess(true);
    
    // Kullanıcıya bildirim göster
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Parent component'e callback
    if (onRewardEarned) {
      onRewardEarned(reward);
    }
  });

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await show();
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        disabled={!isReady || isLoading || showSuccess}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold
          transition-all duration-200 shadow-lg
          ${
            isReady && !isLoading && !showSuccess
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Yükleniyor...</span>
          </>
        ) : showSuccess ? (
          <>
            <Gift className="w-5 h-5" />
            <span>Ödül Kazandın! 🎉</span>
          </>
        ) : (
          <>
            <Gift className="w-5 h-5" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
      
      {rewardDescription && (
        <p className="text-sm text-gray-600 text-center mt-2">
          {rewardDescription}
        </p>
      )}

      {!isReady && !showSuccess && (
        <p className="text-xs text-gray-500 text-center mt-1">
          Reklam hazırlanıyor...
        </p>
      )}
    </div>
  );
}

