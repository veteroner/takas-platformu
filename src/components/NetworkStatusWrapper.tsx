'use client';

import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/OfflineScreen';
import { AnimatePresence } from 'framer-motion';

interface NetworkStatusWrapperProps {
  children: React.ReactNode;
}

export function NetworkStatusWrapper({ children }: NetworkStatusWrapperProps) {
  const { isOnline, isChecking } = useNetworkStatus();

  // İlk kontrol yapılırken children'ı göster
  if (isChecking) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isOnline && <OfflineScreen key="offline" />}
      </AnimatePresence>
      {isOnline && children}
    </>
  );
}
