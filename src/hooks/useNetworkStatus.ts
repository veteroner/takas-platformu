'use client';

import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // İlk kontrol
    setIsOnline(navigator.onLine);
    setIsChecking(false);

    // Online/offline event listeners
    const handleOnline = () => {
      console.log('🌐 İnternet bağlantısı kuruldu');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📡 İnternet bağlantısı kesildi');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periyodik kontrol (her 30 saniyede bir)
    const intervalId = setInterval(async () => {
      try {
        // Küçük bir fetch ile gerçek bağlantıyı kontrol et
        const response = await fetch('/api/health-check', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        if (response.ok && !isOnline) {
          setIsOnline(true);
        }
      } catch {
        if (isOnline) {
          setIsOnline(false);
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  return { isOnline, isChecking };
}
