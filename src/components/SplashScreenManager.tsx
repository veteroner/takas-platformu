'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

let splashHidden = false;

/**
 * Splash screen'i güvenli bir şekilde gizle
 * iOS'ta web içeriği yüklenmeden önce splash kapanmamalı
 */
async function hideSplashScreen() {
  // Zaten gizlenmişse çık
  if (splashHidden) return;
  
  // Sadece native platformda çalış
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    // Dinamik import - web'de hata vermez
    const { SplashScreen } = await import('@capacitor/splash-screen');
    
    // Splash'ı gizle
    await SplashScreen.hide({
      fadeOutDuration: 300
    });
    
    splashHidden = true;
    console.log('[SplashScreenManager] Splash gizlendi');
  } catch (error) {
    console.error('[SplashScreenManager] Hata:', error);
    splashHidden = true; // Hata olsa da tekrar deneme
  }
}

/**
 * Bu bileşen, native uygulamalarda splash screen'in
 * web içeriği yüklendikten sonra gizlenmesini sağlar.
 * 
 * Strateji:
 * 1. Component mount olduğunda = React hazır
 * 2. 500ms bekle = web içeriği render edildi
 * 3. Splash'ı kapat
 */
export default function SplashScreenManager() {
  useEffect(() => {
    // Sayfa yüklendiğinde splash'ı gizle
    // 500ms bekleme: React hydration + ilk render tamamlansın
    const timer = setTimeout(() => {
      hideSplashScreen();
    }, 500);

    // Yedek: 3 saniye içinde her türlü kapat (deadlock önleme)
    const fallbackTimer = setTimeout(() => {
      if (!splashHidden) {
        console.warn('[SplashScreenManager] Fallback ile splash kapatılıyor');
        hideSplashScreen();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return null;
}
