# 📱 Native App Debugging & Logging Guide

## 🔍 Problem: Uygulama Kilitlenmeleri ve Hata Tespiti

### ✅ Çözüm: Comprehensive Logging Sistemi Kuruldu

## 🛠️ Kurulu Sistemler:

### 1. **Logger System** (`src/lib/logger.ts`)
- ✅ Xcode Console'da görünür detaylı loglar
- ✅ Timestamp, kategori, emoji ile formatlanmış
- ✅ Error stack trace yakalama
- ✅ Function execution tracking
- ✅ User action tracking
- ✅ API call tracking
- ✅ Global error handler

### 2. **Camera Wrapper** (`src/lib/cameraWrapper.ts`)
- ✅ Kamera açılma adımları detaylı loglanıyor
- ✅ Permission kontrolü ve request logging
- ✅ Error handling ve user cancellation detection
- ✅ Photo capture ve gallery pick tracking

### 3. **Upload Page Logging**
- ✅ Component lifecycle logging
- ✅ User action tracking (button clicks)
- ✅ Image optimization progress
- ✅ File validation ve processing

## 📊 Xcode Console'da Görünecek Loglar:

### Örnek Log Formatı:
```
═══════════════════════════════════════════════════════
[2025-11-02T10:30:45.123Z] 📸 [CAMERA]
User clicked camera button
───────────────────────────────────────────────────────
📦 Data: {
  "platform": "ios",
  "isNative": true
}
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════
[2025-11-02T10:30:45.234Z] ℹ️ [CAMERA]
📸 Checking camera permissions...
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════
[2025-11-02T10:30:45.345Z] ℹ️ [CAMERA]
Camera permissions status
───────────────────────────────────────────────────────
📦 Data: {
  "camera": "granted",
  "photos": "granted"
}
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════
[2025-11-02T10:30:45.456Z] ℹ️ [CAMERA]
📸 Calling Camera.getPhoto()...
═══════════════════════════════════════════════════════

═══════════════════════════════════════════════════════
[2025-11-02T10:30:47.567Z] ℹ️ [CAMERA]
✅ Photo captured successfully
───────────────────────────────────────────────────────
📦 Data: {
  "format": "jpeg",
  "saved": false,
  "webPath": "(exists)",
  "path": "(exists)"
}
═══════════════════════════════════════════════════════
```

## 🎯 Debug Adımları:

### 1. **Xcode'da Çalıştır**
```bash
# Terminal'de
cd /Users/onerozbey/Desktop/Takas-platform
npx cap sync ios
npx cap open ios
```

Xcode'da:
1. Project'i aç
2. Simulator veya gerçek cihaz seç
3. **▶️ Run** butonuna bas
4. **Console** tab'ını aç (View → Debug Area → Activate Console)

### 2. **Kamera Butonuna Bas**
1. Upload sayfasına git
2. "Ekle" butonuna bas
3. "Kamera" veya "Galeri" seç

### 3. **Console Loglarını İncele**
Şunları göreceksin:

**✅ Başarılı Flow:**
```
[USER_ACTION] 👤 UploadPage - CAMERA_BUTTON_CLICKED
[CAMERA] 📸 User clicked camera button
[CAMERA] 📸 Checking camera permissions...
[CAMERA] ✅ Camera permissions granted
[CAMERA] 📸 Opening camera...
[CAMERA] 📸 Calling Camera.getPhoto()...
[CAMERA] ✅ Photo captured successfully
[UPLOAD_PAGE] ✅ Photo optimized successfully
```

**❌ Hata Durumu:**
```
[USER_ACTION] 👤 UploadPage - CAMERA_BUTTON_CLICKED
[CAMERA] 📸 User clicked camera button
[CAMERA] 📸 Checking camera permissions...
[CAMERA] ⚠️ Camera permissions not granted
[CAMERA] 📸 Requesting camera permissions...
[CAMERA] ❌ Camera permissions denied by user
───────────────────────────────────────────────────────
🔥 Error Stack: Error: Kamera izni verilmedi
    at takePhoto (cameraWrapper.ts:89)
    ...
═══════════════════════════════════════════════════════
```

## 🔧 Olası Sorunlar ve Çözümleri:

### Sorun 1: "Kamera İzni Verilmedi"
**Console'da:**
```
[CAMERA] ❌ Camera permission denied
```

**Çözüm:**
- iOS Ayarlar → TakasYap → Kamera → İzin Ver
- Uygulamayı yeniden başlat

### Sorun 2: "Camera.getPhoto() Çağrılamıyor"
**Console'da:**
```
[CAMERA] ❌ Error taking photo
Error: Camera plugin not available
```

**Çözüm:**
```bash
npx cap sync ios
# Xcode'da Clean Build Folder (Cmd+Shift+K)
# Rebuild
```

### Sorun 3: "Uygulama Donuyor/Kilitliniyor"
**Console'da:**
```
[CAMERA] 📸 Calling Camera.getPhoto()...
(sonra hiçbir log gelmez)
```

**Olası Nedenler:**
1. Main thread block oluyor
2. Info.plist'te permission tanımları eksik
3. Pod install eksik

**Çözüm:**
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

## 📱 iOS Spesifik Kontroller:

### Info.plist Kontrol:
Dosya: `ios/App/App/Info.plist`

Şunlar olmalı:
```xml
<key>NSCameraUsageDescription</key>
<string>Ürün fotoğrafı çekmek için kameranıza erişmemiz gerekiyor.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Ürün fotoğraflarını seçmek için fotoğraf galerinize erişmemiz gerekiyor.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Çektiğiniz fotoğrafları galerinize kaydetmek için izin gerekiyor.</string>
```

### Simulator Test:
⚠️ **Not:** iOS Simulator'de gerçek kamera yok!
- Galeri çalışır
- Kamera mock data verir

**Gerçek cihazda test et!**

## 🤖 Android Spesifik Kontroller:

### AndroidManifest.xml Kontrol:
Dosya: `android/app/src/main/AndroidManifest.xml`

Şunlar olmalı:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### Android Studio'da Debug:
```bash
npx cap sync android
npx cap open android
```

Logcat'te filtre:
```
tag:CAMERA|UPLOAD_PAGE|USER_ACTION
```

## 🎨 Log Kategorileri:

| Kategori | Emoji | Açıklama |
|----------|-------|----------|
| `CAMERA` | 📸 | Kamera işlemleri |
| `UPLOAD_PAGE` | 📱 | Upload sayfası |
| `USER_ACTION` | 👤 | Kullanıcı eylemleri |
| `API` | 🌐 | API çağrıları |
| `GLOBAL` | 💀 | Global hatalar |

## 🔍 Log Levels:

| Level | Emoji | Ne zaman kullanılır |
|-------|-------|---------------------|
| `debug` | 🔍 | Detaylı debugging bilgileri |
| `info` | ℹ️ | Genel bilgilendirme |
| `warn` | ⚠️ | Uyarılar |
| `error` | ❌ | Hatalar |
| `fatal` | 💀 | Kritik hatalar |

## 📝 Yeni Log Ekleme:

### Herhangi bir dosyada:
```typescript
import { logger, trackUserAction } from '@/lib/logger'

// Basit log
logger.info('MY_FEATURE', 'Bir şey oldu', { data: 'value' })

// User action tracking
trackUserAction('BUTTON_CLICKED', 'MyComponent', { buttonId: 'submit' })

// Function tracking
const end = logger.track('MY_FEATURE', 'myFunction', { param: 'value' })
// ... işlemler ...
end() // Süreyi loglar

// Error logging
try {
  // ...
} catch (error) {
  logger.error('MY_FEATURE', 'Hata oluştu', error as Error, { context: 'extra' })
}
```

## 🚀 Hemen Test Et:

1. **Kod zaten push edildi ve deploy ediliyor**
2. **Xcode'da projeyi aç:**
   ```bash
   npx cap open ios
   ```
3. **Run ile başlat**
4. **Console'u aç (Cmd+Shift+Y)**
5. **Upload sayfasına git**
6. **Kamera butonuna bas**
7. **Logları izle!**

## 📊 Log Export (Debug için):

```typescript
import { logger } from '@/lib/logger'

// Tüm logları al
const logs = logger.exportLogs()
console.log(logs)

// veya
// Logları temizle
logger.clearLogs()
```

## ✅ Şimdi Yapman Gerekenler:

1. ✅ **Kod push edildi** - Hazır!
2. ⬜ **Xcode'da aç:** `npx cap open ios`
3. ⬜ **Simulator veya gerçek cihaz seç**
4. ⬜ **Run (▶️)**
5. ⬜ **Console'u aç**
6. ⬜ **Upload → Kamera → Logları izle!**

---

## 🎯 Beklenen Sonuç:

Artık Xcode Console'unda **her adımı** göreceksin:
- ✅ Butona basma
- ✅ Permission kontrolü
- ✅ Kamera açılma
- ✅ Fotoğraf çekme
- ✅ Optimization
- ❌ Herhangi bir hata

**Sorun nerede olursa olsun, log'da göreceksin!** 🎉
