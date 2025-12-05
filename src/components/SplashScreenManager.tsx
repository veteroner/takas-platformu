'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Bu bileşen, native uygulamalarda splash screen'in
 * web içeriği yüklendikten sonra gizlenmesini sağlar.
 */
export default function SplashScreenManager() {
  useEffect(() => {
    const hideSplash = async () => {
      // Sadece native platformlarda çalış
      if (Capacitor.isNativePlatform()) {
        try {
          // Sayfa içeriğinin yüklenmesi için kısa bir gecikme
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Splash screen'i gizle
          await SplashScreen.hide({
            fadeOutDuration: 500
          });
          
          console.log('Splash screen gizlendi');
        } catch (error) {
          console.error('Splash screen gizlenirken hata:', error);
        }
      }
    };

    // Sayfa yüklendiğinde splash'i gizle
    if (document.readyState === 'complete') {
      hideSplash();
    } else {
      window.addEventListener('load', hideSplash);
      return () => window.removeEventListener('load', hideSplash);
    }
  }, []);

  return null;
}
