# 🔍 iOS Web Inspector Debug Guide

## Problem: Xcode Console'da Log Görünmüyor

### Neden:
- `server.url` Netlify'i işaret ediyor
- Web içeriği remote'tan yükleniyor
- Console logları Safari Web Inspector'da

## ✅ Çözüm: Safari Web Inspector

### Adım 1: iPhone'da Web Inspector'ı Aç

1. **iPhone Ayarlar**
2. **Safari**
3. **Gelişmiş** (Advanced)
4. **Web Inspector** → **Aç**

### Adım 2: Mac'te Safari'yi Aç

1. Safari'yi aç
2. **Safari → Settings** (veya **Preferences**)
3. **Advanced** tab
4. **Show Develop menu in menu bar** ✅

### Adım 3: Uygulamayı Çalıştır

1. Xcode'dan iPhone'a deploy et
2. Uygulamayı aç

### Adım 4: Safari'de Connect

1. Safari → **Develop** menu
2. iPhone cihazını bul
3. **[Cihaz Adı]** → **Değiştir** (veya App adı)
4. **Web Inspector** açılır

### Adım 5: Console'u İzle

1. Web Inspector'da **Console** tab'ı
2. Upload sayfasına git
3. Kamera butonuna bas
4. **TÜM LOGLARI GÖRÜRSÜN!** 🎉

```
[UPLOAD_PAGE] 📱 Upload page mounted
[USER_ACTION] 👤 UploadPage - CAMERA_BUTTON_CLICKED
[CAMERA] 📸 Opening camera...
...
```

## ✅ Alternatif: Local Development Mode

### Daha hızlı debug için local'de çalıştır:

```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Capacitor sync
npx cap sync ios
```

### capacitor.config.ts'yi geçici değiştir:

```typescript
const config: CapacitorConfig = {
  appId: 'com.takasyap.app',
  appName: 'TakasYap',
  webDir: 'out',
  server: {
    url: 'http://localhost:3000',  // Local dev server
    cleartext: true
  },
  // ...
}
```

Sonra Xcode'dan çalıştır → **Xcode Console'da loglar görünür!**

## 🎯 Hızlı Test:

### Safari Web Inspector ile:
1. ✅ iPhone'da Web Inspector aç
2. ✅ Mac Safari'de Develop menu aç
3. ✅ Xcode'dan run
4. ✅ Safari Develop → iPhone → App
5. ✅ Console tab → Logları izle

### Local Dev ile:
1. ✅ `npm run dev` çalıştır
2. ✅ capacitor.config.ts → `url: 'http://localhost:3000'`
3. ✅ `npx cap sync ios`
4. ✅ Xcode'dan run
5. ✅ Xcode Console'da logları izle

---

## 📊 Load Failed Sorunu:

### En muhtemel nedenler:

1. **File Path Conversion Hatası**
   - `photo.webPath` null veya invalid
   - Blob creation failed
   
2. **Supabase Bucket Yok**
   - `item-images` bucket oluşturulmamış
   
3. **CORS Hatası**
   - Netlify → Supabase CORS policy

### Safari Console'da bakılacaklar:

```javascript
// Başarılı:
[API] ✅ Image uploaded successfully

// Hata:
[API] ❌ Supabase Storage upload error
// veya
Failed to fetch photo: 404
// veya
CORS error: Access blocked
```

## 🚀 Önerilen Yöntem:

**Safari Web Inspector** kullan → En hızlı debug yöntemi!

Sonra buraya console çıktısını yapıştır 📋
