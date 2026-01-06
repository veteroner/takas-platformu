import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teknova.takasapp',
  appName: 'TakaZone',
  webDir: 'out',
  // PRODUCTION MODE: Canlı URL kullanılıyor (yeni kod deploy edilince otomatik güncellenir)
  server: {
    // NOTE: Native WebViews can keep aggressive caches for HTML/JS.
    // Adding a version query param forces a fresh fetch after updates.
    url: 'https://takazone.com/?v=28f3329',
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https'
  },
  android: {
    // Android-specific optimizations
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Timeout settings
    loggingBehavior: 'production',
    // Background mode için
    backgroundColor: '#EC4899'
  },
  ios: {
    // Prevent double safe-area padding in native iOS.
    // We handle safe areas via CSS env(safe-area-inset-*) utilities.
    contentInset: 'never',
    // iOS 10+ uyumluluk için minimum SDK
    minVersion: '13.0'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#EC4899',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
