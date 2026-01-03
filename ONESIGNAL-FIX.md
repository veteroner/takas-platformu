# 🔔 OneSignal Bildirim Sorunu Çözümü

## 🔴 Tespit Edilen ASIL Sorun

### OneSignal Cordova Plugin API Versiyonu Uyumsuzluğu

**Plugin Kurulu:** `onesignal-cordova-plugin@5.2.15` (Modern v5.x API)
**Kod:** Eski v3/v4 API fonksiyonlarını kullanıyor!

#### ❌ Hatalı Log'lar (Gerçek Cihaz):
```
⚡️ [warn] - OneSignal.setAppId unknown type: undefined
⚠️ OneSignal.promptForPushNotificationsWithUserResponse not available
```

**SEBEP:** v5.x plugin'de bu fonksiyonlar YOK!

#### ✅ Doğru v5.x API:
| Eski API (v3/v4) ❌ | Yeni API (v5.x) ✅ |
|---------------------|-------------------|
| `setAppId(appId)` | `initialize(appId)` |
| `promptForPushNotificationsWithUserResponse()` | `Notifications.requestPermission()` |
| `setNotificationWillShowInForegroundHandler()` | `Notifications.addEventListener('foregroundWillDisplay')` |
| `setNotificationOpenedHandler()` | `Notifications.addEventListener('click')` |
| `setExternalUserId()` | `login(externalId)` veya `User.setExternalId()` |
| `removeExternalUserId()` | `logout()` veya `User.removeExternalId()` |

---

## ✅ ÇÖZÜM UYGULANDI

### OneSignalCapacitorInit.tsx Modern v5.x API ile Güncellendi

```typescript
// ✅ DOĞRU - v5.x Modern API
const OneSignal = window.plugins.OneSignal

// 1. Initialize
OneSignal.initialize(ONESIGNAL_APP_ID)

// 2. Request Permission
OneSignal.Notifications.requestPermission(true).then(accepted => {
  console.log('Bildirim izni:', accepted)
})

// 3. Foreground notification handler
OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
  console.log('Bildirim alındı:', event)
  event.notification.display() // Göster
})

// 4. Notification clicked handler
OneSignal.Notifications.addEventListener('click', (event) => {
  console.log('Bildirime tıklandı:', event)
})

// 5. Set External User ID
OneSignal.login(supabaseUserId)

// 6. Logout
OneSignal.logout()
```

---

## 🚀 YENİDEN DEPLOY ADIMLARI

### 1️⃣ Build ve Sync
```bash
cd /Volumes/LaCie/Takas-platform

# Next.js build
npm run build

# iOS sync
npx cap sync ios
```

### 2️⃣ Xcode'da Yeniden Deploy
```bash
npx cap open ios
```

**Xcode'da:**
1. Product → Clean Build Folder (Cmd+Shift+K)
2. Product → Destination → Gerçek iPhone seçin
3. Product → Run (Cmd+R)

### 3️⃣ Beklenen Yeni Log'lar
```
✅ OneSignal.initialize() çağrıldı: f26d64d9-c8c9-48ee-a472-f12cc5c8b629
📱 Push bildirim izni: Kabul edildi
✅ OneSignal.login() called with External User ID: <supabase-user-id>
✅ Notification event listeners kuruldu
🎉 OneSignal v5.x kurulumu tamamlandı!
```

---

## 📋 OneSignal Dashboard Kontrolü

### Push Certificate Kontrolü ⚠️
1. [OneSignal Dashboard](https://app.onesignal.com) → Settings → Platforms → iOS
2. **APNs Authentication Key** veya **.p12 Certificate** yüklü mü?
3. Eğer yoksa: [iOS Push Certificate Guide](https://documentation.onesignal.com/docs/ios-sdk-setup)

### Test Bildirimi Gönder
1. Messages → New Push
2. "Send to Test Users" veya "Send to All Subscribers"
3. Mesaj oluştur ve gönder
4. Gerçek iOS cihazında bildirim bekleyin

---

## 🔍 DEBUG İPUÇLARI

### Başarılı Kurulum Kontrolü:
```javascript
// Console'da bakılacak loglar:
✅ "OneSignal plugin yapısı: [User, Notifications, Debug, Session...]"
✅ "OneSignal.initialize() çağrıldı"
✅ "Push bildirim izni: Kabul edildi"
✅ "OneSignal.login() called with External User ID"
```

### Hala Sorun Varsa:
1. **Xcode Clean Build** yapıldı mı?
2. **Gerçek cihaz** kullanılıyor mu? (Simulator çalışmaz!)
3. **iOS Settings → TakaZone → Notifications** açık mı?
4. **OneSignal Dashboard → Audience → All Users** External User ID görünüyor mu?

---

## 📚 API Referansları

- [OneSignal Cordova v5.x Docs](https://documentation.onesignal.com/docs/cordova-sdk-setup)
- [v5.x Migration Guide](https://documentation.onesignal.com/docs/cordova-sdk-5x-migration-guide)
- [iOS Push Certificate Setup](https://documentation.onesignal.com/docs/ios-sdk-setup)

---

## ✅ SON DURUM

- ✅ OneSignal v5.x Modern API'ye geçildi
- ✅ `initialize()` kullanılıyor (setAppId değil)
- ✅ `Notifications.requestPermission()` kullanılıyor
- ✅ Event listeners doğru API ile kuruldu
- ✅ `login()`/`logout()` modern API kullanılıyor
- 🔄 **Bekliyor:** Clean build + gerçek cihazda test

---

## ✅ ÇÖZÜM ADIM ADIM

### SEÇENEK 1: Cordova Plugin Kullan (Önerilen - Basit)

#### 1️⃣ Doğru Plugin'i Kur
```bash
# Eski plugin'i kaldır
npm uninstall onesignal-cordova-plugin

# Yeni Cordova plugin'i kur
npm install onesignal-cordova-plugin@^5.2.4

# iOS dependencies
npx cap sync ios
cd ios/App && pod install && cd ../..
```

#### 2️⃣ OneSignalCapacitorInit.tsx Dosyasını Güncelle
Cordova API'sine uyumlu hale getir:

```tsx
'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || 'f26d64d9-c8c9-48ee-a472-f12cc5c8b629'

export default function OneSignalCapacitorInit() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (typeof window === 'undefined') return
        
        // Wait for Cordova deviceready
        const waitForCordova = () => new Promise<void>((resolve) => {
          if (window.cordova) {
            resolve()
          } else {
            document.addEventListener('deviceready', () => resolve(), { once: true })
            setTimeout(resolve, 3000)
          }
        })
        
        await waitForCordova()
        
        // Access OneSignal from window.plugins
        const windowWithPlugins = window as any
        
        if (windowWithPlugins.plugins?.OneSignal) {
          console.log('🔔 OneSignal Cordova başlatılıyor...')
          const OneSignal = windowWithPlugins.plugins.OneSignal

          // 1. Initialize OneSignal
          OneSignal.setAppId(ONESIGNAL_APP_ID)
          console.log('✅ OneSignal initialized with App ID:', ONESIGNAL_APP_ID)

          // 2. Bildirim izni iste
          OneSignal.promptForPushNotificationsWithUserResponse((accepted: boolean) => {
            console.log('📱 Push bildirim izni:', accepted ? 'Kabul edildi' : 'Reddedildi')
          })

          // 3. Notification received handler
          OneSignal.setNotificationWillShowInForegroundHandler((notification: any) => {
            console.log('🔔 Bildirim alındı (foreground):', notification)
            OneSignal.completeNotification(notification.notificationId, true)
          })

          // 4. Notification opened handler
          OneSignal.setNotificationOpenedHandler((openedEvent: any) => {
            console.log('👆 Bildirime tıklandı:', openedEvent)
          })

          // 5. Set External User ID (Supabase user)
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user?.id) {
            OneSignal.setExternalUserId(session.user.id)
            console.log('✅ External User ID set:', session.user.id)
          }

          // 6. Auth state listener
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.id) {
              OneSignal.setExternalUserId(session.user.id)
              console.log('✅ External User ID updated:', session.user.id)
            } else if (event === 'SIGNED_OUT') {
              OneSignal.removeExternalUserId()
              console.log('✅ External User ID removed')
            }
          })

          console.log('🎉 OneSignal kurulumu tamamlandı!')
          
        } else {
          console.warn('⚠️ OneSignal plugin bulunamadı')
        }
      } catch (error) {
        console.error('❌ OneSignal başlatma hatası:', error)
      }
    }
    
    initOneSignal()
  }, [])
  
  return null
}
```

#### 3️⃣ iOS Info.plist Permissions (Zaten var ✅)
```xml
<!-- Zaten ekli -->
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

#### 4️⃣ iOS Push Certificate Kontrolü
OneSignal Dashboard'da kontrol edin:
- Settings → Platforms → iOS
- APNs Authentication Key VEYA .p12 certificate yüklü olmalı

#### 5️⃣ Test Et
```bash
# iOS'ta test
npx cap sync ios
npx cap open ios

# Xcode'da gerçek cihazda çalıştır
# Push bildirimleri simulator'de ÇALIŞMAZ!
```

---

### SEÇENEK 2: Capacitor Native Plugin (Gelişmiş)

Eğer Capacitor ekosisteminde kalmak istiyorsanız:

#### 1️⃣ Plugin Değişikliği
```bash
# Cordova plugin'i kaldır
npm uninstall onesignal-cordova-plugin

# Capacitor plugin kur (unofficial)
npm install onesignal-capacitor

# VEYA resmi Capacitor OneSignal SDK kullan
npm install @onesignal/capacitor-onesignal
```

#### 2️⃣ Capacitor Config Güncelle
```typescript
// capacitor.config.ts
plugins: {
  OneSignal: {
    appId: 'f26d64d9-c8c9-48ee-a472-f12cc5c8b629'
  }
}
```

---

## 🧪 TEST ADIMLARI

### 1. OneSignal Dashboard Test
1. OneSignal Dashboard → Messages → New Push
2. "Send to Test Users" veya "Send to All Subscribers"
3. Mesaj gönder

### 2. External User ID Kontrolü
OneSignal Dashboard → Audience → All Users
- External User ID kolonu boş olmamalı (Supabase user ID görünmeli)

### 3. Device Subscription Kontrolü
```javascript
// Browser console'da (web test için)
OneSignal.getUserId().then(userId => {
  console.log('OneSignal Player ID:', userId)
})
```

### 4. iOS Native Test
```bash
# Real device'da test ZORUNLU
# Simulator'de push notifications ÇALIŞMAZ

npx cap open ios
# Xcode'da gerçek iPhone'a deploy et
```

---

## 📋 CHECKLIST

- [ ] Doğru plugin kurulu (`onesignal-cordova-plugin` v5.2.4+)
- [ ] OneSignalCapacitorInit.tsx Cordova API'sine güncellendi
- [ ] iOS Podfile'da OneSignal dependency var
- [ ] Info.plist'te UIBackgroundModes remote-notification var
- [ ] OneSignal Dashboard'da iOS APNs certificate yüklü
- [ ] App ID doğru: `f26d64d9-c8c9-48ee-a472-f12cc5c8b629`
- [ ] External User ID ayarlanıyor (console'da log var mı?)
- [ ] Gerçek iOS cihazında test edildi (simulator değil!)

---

## 🔍 DEBUG İPUÇLARI

### Log'larda Bakılacaklar:
```
✅ İyi:
- "OneSignal initialized with App ID"
- "Push bildirim izni: Kabul edildi"
- "External User ID set: <supabase-user-id>"

❌ Kötü:
- "OneSignal plugin bulunamadı"
- "promptForPushNotificationsWithUserResponse not available"
- "OneSignal.setAppId unknown type: undefined"
```

### OneSignal Dashboard Debug:
1. Delivery → Message Reports
2. Her mesaj için "Sent/Delivered/Clicked" istatistikleri görünür

### iOS Gerçek Cihaz Gereksinimi:
```
⚠️ Push notifications iOS Simulator'de ÇALIŞMAZ!
✅ Gerçek iPhone/iPad kullanın
✅ Xcode → Product → Destination → Select gerçek cihaz
```

---

## 🚀 HIZLI BAŞLATMA

```bash
# 1. Plugin kur/güncelle
npm install onesignal-cordova-plugin@latest

# 2. iOS sync
npx cap sync ios
cd ios/App && pod install && cd ../..

# 3. Kodu güncelle
# OneSignalCapacitorInit.tsx dosyasını yukarıdaki gibi değiştir

# 4. Test (gerçek cihazda!)
npx cap open ios
```

---

## 📚 KAYNAKLAR

- [OneSignal Cordova Setup](https://documentation.onesignal.com/docs/cordova-sdk-setup)
- [OneSignal iOS Certificate](https://documentation.onesignal.com/docs/ios-sdk-setup#step-1-generate-an-ios-push-certificate)
- [OneSignal API Docs](https://documentation.onesignal.com/reference)
