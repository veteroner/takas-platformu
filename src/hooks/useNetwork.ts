'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NetworkState {
  isOnline: boolean;
  isServerReachable: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
}

interface UseNetworkOptions {
  /** Health check interval in milliseconds (default: 30000) */
  checkInterval?: number;
  /** Health check timeout in milliseconds (default: 5000) */
  timeout?: number;
  /** Enable periodic health checks (default: true) */
  enablePeriodicCheck?: boolean;
}

const HEALTH_ENDPOINT = '/api/health';

/**
 * Unified network status hook
 * Combines online/offline detection with server health checks
 */
export function useNetwork(options: UseNetworkOptions = {}) {
  const {
    checkInterval = 30000,
    timeout = 5000,
    enablePeriodicCheck = true,
  } = options;

  const [state, setState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isServerReachable: true,
    isChecking: true,
    lastChecked: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Health check function
  const checkHealth = useCallback(async (): Promise<boolean> => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, timeout);

      const response = await fetch(HEALTH_ENDPOINT, {
        method: 'HEAD',
        cache: 'no-store',
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }, [timeout]);

  // Full status check
  const checkStatus = useCallback(async () => {
    const browserOnline = navigator.onLine;
    
    setState(prev => ({ ...prev, isChecking: true }));

    let serverReachable = false;
    if (browserOnline) {
      serverReachable = await checkHealth();
    }

    setState({
      isOnline: browserOnline,
      isServerReachable: serverReachable,
      isChecking: false,
      lastChecked: new Date(),
    });

    return browserOnline && serverReachable;
  }, [checkHealth]);

  // Manual retry function
  const retry = useCallback(async () => {
    return checkStatus();
  }, [checkStatus]);

  // Setup event listeners and periodic checks
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Browser reports online');
      setState(prev => ({ ...prev, isOnline: true }));
      // Check server when coming online
      checkStatus();
    };

    const handleOffline = () => {
      console.log('📡 Browser reports offline');
      setState(prev => ({
        ...prev,
        isOnline: false,
        isServerReachable: false,
      }));
    };

    // Initial check
    checkStatus();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup periodic check
    if (enablePeriodicCheck) {
      intervalRef.current = setInterval(checkStatus, checkInterval);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkStatus, checkInterval, enablePeriodicCheck]);

  // Derived state: truly connected means both online and server reachable
  const isConnected = state.isOnline && state.isServerReachable;

  return {
    ...state,
    isConnected,
    retry,
    checkStatus,
  };
}

export default useNetwork;
