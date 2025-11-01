'use client'

import { useEffect } from 'react';
import { initializeAds } from '@/lib/adManager';

/**
 * Unified Ads Başlatıcı Komponenti
 * Unity Ads + AdMob sistemini başlatır
 * Unity Ads öncelikli, yoksa AdMob kullanır
 */
export default function AdsInit() {
  useEffect(() => {
    initializeAds();
  }, []);

  return null; // UI render etmeye gerek yok
}
