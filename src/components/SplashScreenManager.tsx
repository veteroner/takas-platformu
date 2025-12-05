'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * Bu bileşen artık isteğe bağlı - splash otomatik kapanıyor.
 * Sadece erken kapatma için kullanılabilir.
 * 
 * capacitor.config.ts'de launchAutoHide: true ve 
 * launchShowDuration: 3000 ayarlı olduğu için
 * 3 saniye sonra splash otomatik kapanacak.
 */
export default function SplashScreenManager() {
  useEffect(() => {
    // Native platformda değilse hiçbir şey yapma
    if (!Capacitor.isNativePlatform()) return;

    // Splash zaten otomatik kapanacak, bu sadece loglama için
    console.log('[SplashScreenManager] Native platform detected, splash will auto-hide in 3s');
  }, []);

  return null;
}
