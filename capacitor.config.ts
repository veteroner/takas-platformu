import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teknova.takasapp',
  appName: 'Takas Platform',
  webDir: 'out',
  server: {
    // Production: Netlify URL
    url: 'https://takasyap.netlify.app',
    cleartext: true,
    androidScheme: 'https'
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
      appId: 'ca-app-pub-3940256099942544~1458002511', // Test App ID - Gerçek ID ile değiştirilecek
      testingDevices: [],
      initializeForTesting: true
    }
  }
};

export default config;
