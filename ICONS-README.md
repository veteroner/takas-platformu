# 🎨 Takas Platform - App Icons & Branding

## 📱 Uygulama İkonları

Uygulamanız için profesyonel ikonlar tasarlandı ve eklendi:

### 🎯 Ana İkon Dosyaları
- **Ana Uygulama İkonu**: `/public/icons/app-icon.svg` (512x512)
- **Favicon**: `/public/favicon.svg` (32x32)  
- **Web App Manifest**: `/public/manifest.json`
- **Splash Screen**: `/public/splash-screen.svg` (1242x2688)

### 🎨 Tasarım Özellikleri
- **Renkler**: Pink (#EC4899) → Purple (#8B5CF6) → Blue (#6366F1)
- **Tema**: Modern gradient, exchange/swap sembolü
- **Stil**: Minimalist, clean, professional
- **Format**: SVG (skalabilir) + PNG destekleri

### 📋 Eklenen Meta Tags
```html
<!-- PWA Desteği -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Takas">
<meta name="theme-color" content="#EC4899">

<!-- İkonlar -->
<link rel="icon" href="/favicon.svg">
<link rel="apple-touch-icon" href="/icons/app-icon.svg">
<link rel="manifest" href="/manifest.json">
```

### 🔧 Capacitor Mobil App
- **App ID**: `com.takas.platform`
- **App Name**: `Takas Platform`
- **Splash Screen**: Otomatik, 2 saniye
- **Status Bar**: Light tema, pink background

### 📱 Desteklenen Platformlar
- ✅ Web (PWA)
- ✅ iOS (Safari, Native App)
- ✅ Android (Chrome, Native App)
- ✅ Desktop (Chrome, Edge, Firefox)

### 🎨 İkon Boyutları
- **16x16**: Tarayıcı sekmesi
- **32x32**: Favicon
- **48x48**: Windows tiles
- **128x128**: Chrome store
- **180x180**: iOS home screen
- **192x192**: Android home screen
- **512x512**: PWA manifest

### 🚀 Kullanım
Tüm ikonlar otomatik olarak uygulamaya entegre edildi:
1. **Ana sayfa**: Header'da uygulama ikonu
2. **Browser**: Favicon ve tab ikonu
3. **Mobile**: Home screen ve splash ikonu
4. **PWA**: Install prompt ikonu

---

## 🛠️ Geliştirici Notları

İkonları güncellemek için:
1. `/public/icons/app-icon.svg` dosyasını düzenleyin
2. Yeni boyutlar için `/public/icon-generator.html` kullanın
3. Manifest dosyasını güncelleyin
4. Cache'i temizleyin

**Tasarım dosyaları**: Tüm SVG dosyalar düzenlenebilir format'tadır.
