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
      // iOS: Splash'ı 3 saniye göster ve otomatik kapat
      // Bu süre içinde web yüklenmeli, yüklenmezse de uygulama açılır
      launchShowDuration: 3000,  // 3 saniye sonra otomatik kapat
      launchAutoHide: true,      // Otomatik kapanış aktif
      launchFadeOutDuration: 500,
      backgroundColor: '#EC4899',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#EC4899'
    },
    AdMob: {
      // iOS: Test App ID (Production'da gerçek ID kullanın)
      appId: 'ca-app-pub-3940256099942544~1458002511',
      testingDevices: [],
      initializeForTesting: true
    }
  }
};

export default config;
