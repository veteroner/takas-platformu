import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teknova.takasapp',
  appName: 'TakaZone',
  webDir: 'out',
  server: {
    // Production: Netlify URL
    url: 'https://takazone.com',
    cleartext: true,
    androidScheme: 'https',
    // Offline durumunda gösterilecek sayfa
    errorPath: 'index.html'
  },
  android: {
    // WebView hata sayfasını gizle ve özel sayfamızı göster
    allowMixedContent: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#EC4899',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#EC4899'
    },
    AdMob: {
      // Üretimde .env veya CI gizli değişkeninden okunabilir; build anında process.env kullanılabilir
      appId: process.env.CAPACITOR_ADMOB_APP_ID || 'TEST',
      testingDevices: [],
      initializeForTesting: process.env.NODE_ENV !== 'production'
    }
  }
};

export default config;
