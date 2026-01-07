# 📱 iOS Push Bildirim Sorun Raporu

**Rapor Tarihi:** 6 Ocak 2026  
**Platform:** iOS (Capacitor + OneSignal Cordova v5.x)  
**Durum:** ⚠️ Bildirimler uygulama açıkken (foreground) geliyor, ancak gösterilmiyor

---

## 🔍 LOG ANALİZİ ÖZETİ

### ✅ BAŞARILI IŞLEMLER

1. **OneSignal Başlatma**
   ```
   ✅ OneSignal.initialize() çağrıldı: f26d64d9-c8c9-48ee-a472-f12cc5c8b629
   ✅ Notification event listeners kuruldu
   ✅ Push bildirim izni: Kabul edildi
   ```

2. **Push Subscription Durumu**
   ```
   ✅ Push Subscription ID: 7438057a-0c3c-4476-8099-05ee000da92b
   ✅ Push Token: 803632a2f4a865dc03a8aabb108db7b5a5bee370...
   ✅ Push bildirim izni: authorized
   ```

3. **Kullanıcı Authentication**
   ```
   ✅ OneSignal.login() on SIGNED_IN: cfc49cbe-d046-42e4-b6fd-7bcb91ee942f
   ✅ External User ID başarıyla atandı
   ```

4. **Bildirim Alımı (Foreground)**
   ```
   ✅ 2 adet bildirim başarıyla alındı:
      - f849f870-135f-4f2d-9bf5-13f1ff7d0c52
      - bd77a4d6-c91e-4260-b03b-779d26137403
   
   ✅ Her iki bildirim için de şu metodlar çağrıldı:
      - preventDefault() ✅
      - displayNotification() ✅
      - proceedWithWillDisplay() ✅
   ```

---

## ❌ SORUNLAR

### 1. **KRİTİK: Foreground Bildirimleri Gösterilmiyor**

**Sorun:** Loglar bildirimlerin alındığını gösteriyor ancak kullanıcı bildirimleri görmüyor.

**Neden:** [OneSignalCapacitorInit.tsx](src/components/OneSignalCapacitorInit.tsx#L54-L58) dosyasında yanlış kod:

```tsx
// MEVCUT KOD (YANLIŞ ❌)
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
  console.log('🔔 Bildirim alındı (foreground):', event)
  event.preventDefault() // ❌ Bildirimi ENGELLER
  event.notification.display() // ❌ event.notification.display() diye bir metod YOK!
})
```

**Sorunun Detayı:**
- `event.preventDefault()` çağrısı bildirimin gösterilmesini ENGELLER
- `event.notification.display()` metodu OneSignal Cordova v5.x API'sinde YOK
- Doğru metod: `event.getNotification().display()` veya `event.notification` objesine direkt erişim

**Loglardan Kanıt:**
```
To Native Cordova -> OneSignalPush preventDefault OneSignalPush152003853
To Native Cordova -> OneSignalPush displayNotification OneSignalPush152003854
To Native Cordova -> OneSignalPush proceedWithWillDisplay OneSignalPush152003855
```

---

### 2. **UYARI: Deprecated API Kullanımı**

```
⚠️ OneSignal: This method has been deprecated. 
   Use getIdAsync instead for getting push subscription id.
⚠️ OneSignal: This method has been deprecated. 
   Use getTokenAsync instead for getting push subscription token.
```

**Neden:** Eski API metodları kullanılıyor:
- `OneSignal.User.pushSubscription.id` (deprecated)
- `OneSignal.User.pushSubscription.token` (deprecated)

---

### 3. **iOS Sistem Uyarıları (Kritik Değil)**

Aşağıdaki uyarılar **OneSignal ile ilgili değil**, iOS sistem hataları:

1. **UIScene Lifecycle Uyarısı**
   ```
   UIScene lifecycle will soon be required. 
   Failure to adopt will result in an assert in the future.
   ```
   - **Etki:** Gelecek iOS sürümlerinde sorun çıkarabilir
   - **Çözüm:** AppDelegate yerine SceneDelegate kullanmaya geç

2. **AutoLayout Constraint Hataları**
   ```
   Unable to simultaneously satisfy constraints...
   ```
   - **Etki:** Klavye görünümünde layout sorunları
   - **Çözüm:** iOS klavye constraint'lerini düzelt

3. **Haptic Feedback Hataları**
   ```
   Failed to read pattern library data: hapticpatternlibrary.plist
   ```
   - **Etki:** Haptic feedback çalışmıyor (iOS Simulator'da normal)
   - **Çözüm:** Gerçek cihazda test et

4. **WebP Görüntü Hatası**
   ```
   makeImagePlus:3798: *** ERROR: 'WEBP'-_reader->initImage[0] failed err=-50
   ```
   - **Etki:** Bazı WebP görseller yüklenmiyor
   - **Çözüm:** Görselleri JPEG/PNG formatına dönüştür

---

## 🔧 ÇÖZÜM ÖNERİLERİ

### 1. **ACİL: Foreground Notification Handler Düzelt**

[OneSignalCapacitorInit.tsx](src/components/OneSignalCapacitorInit.tsx#L54-L58) dosyasını şu şekilde düzelt:

```tsx
// DOĞRU KOD ✅
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
  console.log('🔔 Bildirim alındı (foreground):', event)
  
  // SEÇENEK 1: Bildirimi direkt göster (önerilen)
  // Hiçbir şey yapma, event.preventDefault() ÇAĞIRMA!
  // OneSignal otomatik olarak gösterecektir
  
  // SEÇENEK 2: Bildirimi custom olarak göster
  // const notification = event.getNotification()
  // notification.display() // veya benzeri bir metod
  
  // SEÇENEK 3: Bildirimi tamamen engelle (istemiyorsan)
  // event.preventDefault()
})
```

**veya daha basit:**

```tsx
// En basit çözüm - event listener'ı tamamen KALDIR
// OneSignal varsayılan davranışı ile bildirimleri gösterecektir

// Bu kodu SİL:
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
  console.log('🔔 Bildirim alındı (foreground):', event)
  event.preventDefault() // ❌ BU SATIRI SİL
  event.notification.display() // ❌ BU SATIRI SİL
})

// Sadece click event'i dinle:
OneSignal.Notifications.addEventListener('click', (event: any) => {
  console.log('👆 Bildirime tıklandı:', event)
  // Navigation logic buraya
})
```

---

### 2. **Deprecated API'leri Güncelle**

```tsx
// YANLIŞ ❌
const subscriptionId = OneSignal.User.pushSubscription.id
const token = OneSignal.User.pushSubscription.token

// DOĞRU ✅
const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync()
const token = await OneSignal.User.pushSubscription.getTokenAsync()
```

---

### 3. **Background & Killed State Test Et**

Foreground sorununu çözdükten sonra şu durumları test et:

1. **Background State**
   - Uygulamayı arka plana al
   - Bildirim gönder
   - Bildirim gelip gelmediğini kontrol et

2. **Killed State**
   - Uygulamayı tamamen kapat (swipe up)
   - Bildirim gönder
   - Bildirim gelip gelmediğini kontrol et

3. **Notification Click**
   - Bildirime tıkla
   - Uygulama açılıp açılmadığını kontrol et
   - Navigation çalışıp çalışmadığını kontrol et

---

### 4. **iOS Capabilities Kontrol Et**

Xcode'da şu ayarları doğrula:

1. **Signing & Capabilities** sekmesine git
2. **Push Notifications** capability'sini ekle (yoksa)
3. **Background Modes** altında şunları işaretle:
   - ✅ Remote notifications

**Kontrol:**
```xml
<!-- Info.plist -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string> <!-- ✅ MEVCUT -->
</array>
```

---

### 5. **Test için OneSignal Dashboard Ayarları**

OneSignal Dashboard'dan test bildirimi gönderirken:

1. **Platform:** iOS seç
2. **Delivery:** "Send immediately" seç
3. **Audience:** "Test Users" veya "Subscribed Users" seç
4. **Options:**
   - ✅ Include Player IDs: `7438057a-0c3c-4476-8099-05ee000da92b`
   - ✅ Sound: Default
   - ✅ Priority: High

---

## 📋 HIZLI DÜZELTME CHECKLİSTİ

- [ ] 1. [OneSignalCapacitorInit.tsx](src/components/OneSignalCapacitorInit.tsx) dosyasında `event.preventDefault()` çağrısını KALDIR
- [ ] 2. `event.notification.display()` satırını KALDIR veya doğru API'ye güncelle
- [ ] 3. Deprecated API metodlarını `getIdAsync()` ve `getTokenAsync()` ile değiştir
- [ ] 4. `npx cap sync ios` komutu çalıştır
- [ ] 5. Xcode'da Clean Build Folder (Cmd+Shift+K)
- [ ] 6. Uygulamayı yeniden build et ve cihaza yükle
- [ ] 7. Test bildirimi gönder (foreground)
- [ ] 8. Test bildirimi gönder (background)
- [ ] 9. Test bildirimi gönder (killed state)
- [ ] 10. Bildirime tıklama test et

---

## 🎯 BEKLENEN SONUÇ

Düzeltmelerden sonra:

1. ✅ Uygulama **açıkken (foreground)** bildirimler görünecek
2. ✅ Uygulama **arka planda (background)** bildirimler gelecek
3. ✅ Uygulama **kapalıyken (killed)** bildirimler gelecek
4. ✅ Bildirime **tıklandığında** uygulama açılacak
5. ✅ Hiçbir deprecation uyarısı OLMAYACAK

---

## 📊 TEST SONUÇLARI TABLOSU

| Durum | Bildirim Geldi? | Gösterildi? | Tıklama Çalıştı? |
|-------|----------------|-------------|------------------|
| **Foreground (Şu an)** | ✅ Evet | ❌ Hayır | ⏸️ Test edilmedi |
| **Background (Şu an)** | ⏸️ Test edilmedi | ⏸️ Test edilmedi | ⏸️ Test edilmedi |
| **Killed (Şu an)** | ⏸️ Test edilmedi | ⏸️ Test edilmedi | ⏸️ Test edilmedi |

---

## 🔗 İLGİLİ DOSYALAR

- [OneSignalCapacitorInit.tsx](src/components/OneSignalCapacitorInit.tsx) - Ana OneSignal konfigürasyon dosyası
- [OneSignalInit.tsx](src/components/OneSignalInit.tsx) - Legacy OneSignal init (kullanılmıyor)
- [Info.plist](ios/App/App/Info.plist) - iOS app manifest
- [capacitor.config.ts](capacitor.config.ts) - Capacitor konfigürasyonu

---

## 📚 KAYNAKLAR

- [OneSignal Cordova SDK v5.x Documentation](https://documentation.onesignal.com/docs/cordova-sdk)
- [OneSignal iOS Setup Guide](https://documentation.onesignal.com/docs/ios-sdk-setup)
- [Foreground Notification Display](https://documentation.onesignal.com/docs/notifications#foreground-notification-handlers)

---

**SONUÇ:** Ana sorun `event.preventDefault()` çağrısı. Bunu kaldırınca bildirimler gösterilecektir! 🎉
