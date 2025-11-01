# 🎨 Splash Screen Kaynakları

Bu klasör, Takas Platform uygulamasının splash screen görsellerini içerir.

## 📁 Klasör Yapısı

```
resources/
├── splash/          # Splash screen görselleri (otomatik oluşturulacak)
└── README.md        # Bu dosya
```

## 🚀 Splash Screen Oluşturma

### Adım 1: Generator'ı Aç
```bash
# Tarayıcınızda açın:
open public/splash-generator.html
```

### Adım 2: Görselleri Oluştur
1. Renkleri ve metinleri özelleştirin
2. "Tüm Boyutları İndir" butonuna tıklayın
3. İndirilen tüm görselleri `resources/splash/` klasörüne taşıyın

### Adım 3: Capacitor Assets Oluştur
```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --splash resources/splash
```

## 📱 Desteklenen Boyutlar

### iOS Splash Screens
- iPhone 14 Pro Max: 1242x2688
- iPhone 14 Pro: 1125x2436
- iPhone 14: 828x1792
- iPhone SE: 750x1334
- iPhone 8 Plus: 1242x2208
- iPhone 5: 640x1136
- iPad Pro 12.9": 2048x2732
- iPad Pro 11": 1668x2388
- iPad 10.2": 1536x2048

### Android Splash Screens
- HDPI: 480x800
- XHDPI: 720x1280
- XXHDPI: 1080x1920
- XXXHDPI: 1440x2560

## 🎯 Splash Screen Özellikleri

### Mevcut Ayarlar (`capacitor.config.ts`)
```typescript
SplashScreen: {
  launchShowDuration: 2500,      // 2.5 saniye gösterim
  launchAutoHide: true,           // Otomatik gizle
  launchFadeOutDuration: 500,     // 0.5 saniye fade out
  backgroundColor: '#EC4899',     // Pink gradient başlangıç
  showSpinner: false,             // Spinner gösterme
  splashFullScreen: true,         // Tam ekran
  splashImmersive: true          // Immersive mod
}
```

## 🔄 Web Splash Screen

Web versiyonu için otomatik splash screen komponenti (`src/components/SplashScreen.tsx`) kullanılıyor:
- ✅ Gradient animasyonlu arka plan
- ✅ 3D rotasyon efekti
- ✅ Yükleme animasyonu
- ✅ 2.5 saniye otomatik gizlenme
- ✅ Smooth fade out

## 📝 Notlar

1. **Görsel Kalitesi**: PNG formatında, yüksek çözünürlüklü
2. **Renk Uyumu**: Uygulama teması ile uyumlu gradient
3. **Platform Özgü**: iOS ve Android için optimize edilmiş
4. **Performans**: Hızlı yüklenme için optimize edilmiş boyutlar

## 🛠️ Özelleştirme

Renkleri ve tasarımı değiştirmek için:
1. `public/splash-generator.html` dosyasını açın
2. Renk ve metin değerlerini ayarlayın
3. Yeni görselleri oluşturun
4. `npx capacitor-assets generate` komutunu tekrar çalıştırın

## 📚 Daha Fazla Bilgi

- [Capacitor Splash Screen Docs](https://capacitorjs.com/docs/apis/splash-screen)
- [Capacitor Assets CLI](https://github.com/ionic-team/capacitor-assets)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/launch-screen/)
- [Android Splash Screens](https://developer.android.com/guide/topics/ui/splash-screen)
