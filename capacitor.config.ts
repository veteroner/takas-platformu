import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teknova.takasapp',
  appName: 'TakaZone',
  webDir: 'out',
  // PRODUCTION MODE: Canlı URL kullanılıyor (yeni kod deploy edilince otomatik güncellenir)
  server: {
    url: 'https://takazone.com',
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
    contentInset: 'always',
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
