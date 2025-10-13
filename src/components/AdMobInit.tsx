'use client'

import { useEffect } from 'react';
import { initializeAdMob } from '@/lib/admob';

/**
 * AdMob Başlatıcı Komponenti
 * Uygulama başlangıcında AdMob'u başlatır
 */
export default function AdMobInit() {
  useEffect(() => {
    initializeAdMob();
  }, []);

  return null; // UI render etmeye gerek yok
}

