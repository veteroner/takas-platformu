'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useNetwork, NetworkState } from '@/hooks/useNetwork';

interface NetworkContextValue extends NetworkState {
  isConnected: boolean;
  retry: () => Promise<boolean>;
  checkStatus: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

interface NetworkProviderProps {
  children: ReactNode;
  /** Show offline screen when disconnected (default: true) */
  showOfflineScreen?: boolean;
  /** Show banner when server unreachable but online (default: true) */
  showBanner?: boolean;
}

export function NetworkProvider({
  children,
  showOfflineScreen = true,
  showBanner = true,
}: NetworkProviderProps) {
  const network = useNetwork();

  return (
    <NetworkContext.Provider value={network}>
      {/* Offline Banner - shows when online but server unreachable */}
      {showBanner && network.isOnline && !network.isServerReachable && !network.isChecking && (
        <OfflineBanner onRetry={network.retry} />
      )}
      
      {/* Full Offline Screen - shows when completely offline */}
      {showOfflineScreen && !network.isOnline && !network.isChecking && (
        <FullOfflineScreen onRetry={network.retry} />
      )}
      
      {/* Always render children but may be hidden behind offline screen */}
      <div className={!network.isOnline && showOfflineScreen ? 'hidden' : undefined}>
        {children}
      </div>
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkContext must be used within NetworkProvider');
  }
  return context;
}

// ============ Offline Banner Component ============
function OfflineBanner({ onRetry }: { onRetry: () => Promise<boolean> }) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 safe-area-top">
      <div className="m-2 rounded-xl bg-amber-500 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium">
              Sunucuya bağlanılamıyor. Birazdan tekrar deneyeceğiz.
            </span>
          </div>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-amber-600 text-sm font-medium hover:bg-amber-50 disabled:opacity-50 transition-colors"
          >
            {isRetrying ? 'Deneniyor...' : 'Yeniden Dene'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ Full Offline Screen Component ============
function FullOfflineScreen({ onRetry }: { onRetry: () => Promise<boolean> }) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    const success = await onRetry();
    if (success) {
      window.location.reload();
    }
    setIsRetrying(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-md mx-4 text-center">
        {/* Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 animate-pulse">
          <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-12.728-12.728m12.728 12.728L5.636 5.636m12.728 0a9 9 0 010 12.728M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          İnternet Bağlantısı Yok
        </h1>

        {/* Description */}
        <p className="text-slate-300 mb-8 leading-relaxed">
          Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.
          <br />
          Wi-Fi veya mobil verinizin açık olduğundan emin olun.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-500 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>
            {isRetrying ? 'Kontrol Ediliyor...' : 'Tekrar Dene'}
          </span>
        </button>

        {/* Tips */}
        <div className="mt-12 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">
            💡 İpuçları:
          </h3>
          <ul className="text-sm text-slate-300 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Wi-Fi bağlantınızı kontrol edin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Mobil verinizin açık olduğundan emin olun</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Uçak modunu kapatın</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>Cihazınızı yeniden başlatmayı deneyin</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NetworkProvider;
