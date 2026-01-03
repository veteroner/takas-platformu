# 🚀 Capacitor Deployment - Hızlı Başlangıç Kılavuzu

## ✅ SEÇENEK A UYGULANДИ: Canlı Deployment

### 🎯 Yapılan Değişiklikler

#### 1. **capacitor.config.ts** güncellendi:
```typescript
server: {
  url: 'https://takazone.com',  // ✅ Canlı URL aktif
  cleartext: false
}
```

#### 2. **ios/App/App/capacitor.config.json** güncellendi:
```json
{
  "server": {
    "url": "https://takazone.com",  // ✅ Canlı URL aktif
    "cleartext": false
  }
}
```

---

## 📋 ŞİMDİ YAPILACAKLAR

### ADIM 1: Yeni Kodu Canlıya Deploy Et 🚀

Netlify'da otomatik deployment var mı kontrol edin:

```bash
# Git'e push yap
git add .
git commit -m "fix: OneSignal v5.x modern API implementation"
git push origin main

# Netlify otomatik build yapacak
# Deploy süresi: ~2-3 dakika
```

**Veya Manuel Deploy:**
```bash
# Netlify CLI ile
npm run build
netlify deploy --prod

# Vercel CLI ile
npm run build  
vercel --prod
```

---

### ADIM 2: Deploy Kontrolü ✅

1. **Netlify Dashboard'a git:** https://app.netlify.com
2. **Production deploy'u bekle** (2-3 dakika)
3. **Live URL'yi test et:** https://takazone.com
4. **Browser console'da kontrol:**
   ```
   ✅ OneSignal Cordova v5.x başlatılıyor...
   ✅ OneSignal.initialize() çağrıldı
   ```

---

### ADIM 3: iOS App Test Et 📱

Deployment bittiğinde (genelde 2-3 dakika):

```bash
# iOS'u aç
npx cap open ios
```

**Xcode'da:**
1. Product → Clean Build Folder (⌘⇧K)
2. Product → Run (⌘R) - Gerçek iPhone'da
3. **İlk açılışta bekleyin** (canlıdan yeni kod çekecek)

---

### ADIM 4: Log Kontrolü 🔍

**Beklenen Yeni Log'lar:**
```
⚡️ Loading app at https://takazone.com...
✅ OneSignal Cordova v5.x başlatılıyor...
✅ OneSignal plugin yapısı: [User, Notifications, Debug, Session...]
✅ OneSignal.initialize() çağrıldı: f26d64d9-c8c9-48ee-a472-f12cc5c8b629
📱 Push bildirim izni: Kabul edildi
✅ OneSignal.login() called with External User ID: <user-id>
🎉 OneSignal v5.x kurulumu tamamlandı!
```

**Eski Hatalar (artık yok):**
```
❌ OneSignal.setAppId unknown type: undefined  // GİTTİ!
❌ OneSignal.promptForPushNotificationsWithUserResponse not available  // GİTTİ!
```

---

### ADIM 5: OneSignal Test 🔔

Deploy bittiğinde:

1. **OneSignal Dashboard'a git:** https://app.onesignal.com
2. Messages → New Push → Create Message
3. "Send to All Subscribers" veya "Send to Test Users"
4. **iOS cihazınızda bildirimi bekleyin!**

---

## ⚠️ ÖNEMLİ NOTLAR

### 1. **İlk Açılış Yavaş Olabilir**
- App canlıdan yeni kodu ilk kez çekiyor
- WebView cache oluşturuyor
- 10-15 saniye sürebilir
- **İkinci açılışta daha hızlı olacak (cache sayesinde)**

### 2. **Cache Temizleme**
Eğer eski kod hala görünürse:

**iOS Simulator'de:**
```bash
# Simulator cache temizle
xcrun simctl erase all

# App'i yeniden yükle
npx cap open ios
```

**Gerçek Cihazda:**
- Settings → TakaZone → Clear Cache
- App'i sil, yeniden yükle

### 3. **İnternet Gereksinimi**
- ✅ App açılışı için internet gerekli (canlıdan kod çeker)
- ❌ Offline çalışmaz
- **Bu normal!** Şu an "Remote/Hybrid Mode" kullanıyorsunuz

### 4. **Gelecek İyileştirmeler**
Native bundle'a geçmek için [CAPACITOR-DEPLOYMENT-RAPOR.md](CAPACITOR-DEPLOYMENT-RAPOR.md) dosyasını okuyun.

---

## 🔄 UPDATE SÜRECİ (Gelecekte)

### Kod Değişikliği Yaparken:

```bash
# 1. Kodu değiştir (örn: OneSignal kodu)
# 2. Git'e push
git add .
git commit -m "feat: yeni özellik"
git push

# 3. Netlify otomatik deploy yapar (~2 dakika)
# 4. Deploy bitince iOS app'i aç
# 5. App otomatik yeni kodu çeker! 🎉
```

**Avantaj:** App Store submission gerekmez!  
**Dezavantaj:** İnternet olmadan app açılmaz.

---

## 📊 DEPLOYMENT STATUS

```
✅ capacitor.config.ts → Canlı URL aktif
✅ iOS config → Canlı URL aktif
🔄 Netlify deployment → BEKLE (2-3 dakika)
⏳ iOS test → Deployment bitince
⏳ OneSignal test → Deployment bitince
```

---

## 🚨 SORUN GİDERME

### "Hala eski kod görünüyor"
```bash
# 1. Netlify deploy bitmiş mi kontrol et
# 2. Browser'da test et: https://takazone.com
# 3. iOS app cache'i temizle
# 4. Xcode → Clean Build Folder
# 5. App'i yeniden çalıştır
```

### "OneSignal çalışmıyor"
```bash
# 1. Console log'larını kontrol et
# 2. "OneSignal.initialize() çağrıldı" log'u var mı?
# 3. OneSignal Dashboard → Audience → All Users
# 4. External User ID görünüyor mu?
```

### "App açılmıyor"
```bash
# 1. İnternet bağlantısı var mı?
# 2. https://takazone.com açılıyor mu?
# 3. Xcode console'da hata var mı?
```

---

## 📚 NEXT STEPS

1. ✅ **ŞİMDİ:** Netlify deployment'ı bekle
2. ✅ **SONRA:** iOS app test et
3. ✅ **EN SON:** OneSignal test bildirimi gönder

**Başarılar! 🚀**
