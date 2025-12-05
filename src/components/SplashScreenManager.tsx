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

let splashHidden = false;

/**
 * Bu bileşen, native uygulamalarda splash screen'in
 * web içeriği yüklendikten sonra gizlenmesini sağlar.
 */
export default function SplashScreenManager() {
  useEffect(() => {
    const hideSplash = async () => {
      // Zaten gizlenmişse tekrar çalıştırma
      if (splashHidden) {
        return;
      }

      // Sadece native platformlarda çalış
      if (!Capacitor.isNativePlatform()) {
        return;
      }

      try {
        // SplashScreen plugin'i dinamik olarak al
        const SplashScreen = await getSplashScreenPlugin();
        if (!SplashScreen) {
          console.warn('SplashScreen plugin mevcut değil');
          return;
        }

        // Minimum bekleme süresi - sayfa içeriğinin render olması için
        // Siyah ekran sorununu önlemek için manuel gizlemeyi devre dışı bıraktık.
        // Native config'deki launchAutoHide: true (2000ms) ayarını kullanıyoruz.
        /*
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Splash screen'i gizle
        await SplashScreen.hide({
          fadeOutDuration: 200
        });
        */
        console.log('Splash screen native auto-hide bekleniyor...');
        
        splashHidden = true;
        console.log('Splash screen gizlendi');
      } catch (error) {
        console.error('Splash screen gizlenirken hata:', error);
        // Hata olsa bile flag'i set et ki tekrar denemesin
        splashHidden = true;
      }
    };

    // Birden fazla event listener ile daha güvenilir hale getir
    // DOMContentLoaded - DOM hazır olduğunda
    // load - Tüm kaynaklar yüklendiğinde
    // readystatechange - Document ready state değiştiğinde

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Sayfa zaten yüklenmiş veya yükleniyor
      hideSplash();
    } else {
      // DOMContentLoaded daha erken tetiklenir
      document.addEventListener('DOMContentLoaded', hideSplash);
      // load event'i de ekle (fallback)
      window.addEventListener('load', hideSplash);
      
      return () => {
        document.removeEventListener('DOMContentLoaded', hideSplash);
        window.removeEventListener('load', hideSplash);
      };
    }
  }, []);

  return null;
}
