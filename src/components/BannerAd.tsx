'use client'

import { useEffect } from 'react';
import { showBannerAd, removeBannerAd } from '@/lib/admob';
import { BannerAdPosition } from '@capacitor-community/admob';

interface BannerAdProps {
  position?: BannerAdPosition;
}

/**
 * Banner Reklam Komponenti
 * Ekranın alt veya üst kısmında banner reklam gösterir
 */
export default function BannerAd({ position = BannerAdPosition.BOTTOM_CENTER }: BannerAdProps) {
  useEffect(() => {
    // Komponent mount olduğunda banner'ı göster
    showBannerAd(position);

    // Komponent unmount olduğunda banner'ı kaldır
    return () => {
      removeBannerAd();
    };
  }, [position]);

  // Banner native olarak gösteriliyor, web'de spacer görevi görür
  return (
    <div className="h-12 w-full bg-transparent" aria-label="Advertisement space">
      {/* Native platform'da bu div üzerine banner gelecek */}
    </div>
  );
}

