'use client'

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { requestTrackingPermission } from '@/lib/nativeConsent';

/**
 * Native Platform İzin Başlatıcısı
 * iOS: ATT (App Tracking Transparency) diyalogu gösterir
 * Android: AdMob consent form kullanır (zaten mevcut)
 */
export default function NativeConsentInit() {
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    if (requested) return;
    
    // Sadece native platformlarda çalış
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // İlk açılışta (veya gerektiğinde) izin iste
    const initConsent = async () => {
      try {
        const platform = Capacitor.getPlatform();
        
        if (platform === 'ios') {
          // iOS ATT izni iste
          // Bu, Apple'ın zorunlu kıldığı standart dialog'u gösterir
          const permission = await requestTrackingPermission();
          console.log('iOS ATT permission result:', permission);
        }
        
        if (platform === 'android') {
          // Android için AdMob consent form zaten var
          // Ek bir şey yapmaya gerek yok
          console.log('Android consent handled by AdMob');
        }
        
        setRequested(true);
      } catch (error) {
        console.error('Native consent initialization error:', error);
      }
    };

    // Uygulama başladıktan 1 saniye sonra izin iste
    // (UI hazır olduktan sonra)
    const timeout = setTimeout(initConsent, 1000);
    
    return () => clearTimeout(timeout);
  }, [requested]);

  // UI render etmeye gerek yok
  return null;
}
