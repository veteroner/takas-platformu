'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

/**
 * SplashScreen plugin'i dinamik olarak yükle (sadece native platformda)
 */
async function getSplashScreenPlugin() {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    return SplashScreen;
  } catch (error) {
    console.warn('SplashScreen plugin yüklenemedi:', error);
    return null;
  }
}

/**
 * Bu bileşen, native uygulamalarda splash screen'in
 * web içeriği yüklendikten sonra gizlenmesini sağlar.
 * 
 * NOT: capacitor.config.ts'de launchAutoHide: true olmalı
 * Bu component sadece ekstra güvenlik için - eğer auto hide çalışmazsa
 * manuel olarak gizler.
 */
export default function SplashScreenManager() {
  useEffect(() => {
    const hideSplash = async () => {
      // Sadece native platformlarda çalış
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      try {
        // İçerik yüklenene kadar bekle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // SplashScreen plugin'i dinamik olarak al
        const SplashScreen = await getSplashScreenPlugin();
        if (!SplashScreen) {
          return;
        }
        
        // Splash screen'i gizle (eğer hala görünürse)
        await SplashScreen.hide({
          fadeOutDuration: 300
        });
        
        console.log('✅ Splash screen gizlendi');
      } catch (error) {
        console.error('❌ Splash screen gizlenirken hata:', error);
      }
    };

    hideSplash();
  }, []);

  return null;
}
