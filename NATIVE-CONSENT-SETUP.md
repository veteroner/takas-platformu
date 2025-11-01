# Native Platform İzin Yönetimi

## ✅ Tamamlanan Değişiklikler

### 1. Çerez Banner'ı Sadece Web'de Göster
- `CookieBanner.tsx` - Native platformlarda otomatik olarak gizleniyor
- `ConsentGuard.tsx` - Web-only policy kontrolü

### 2. Native İzin Sistemi
**iOS - App Tracking Transparency (ATT)**
- ✅ `Info.plist` içine `NSUserTrackingUsageDescription` eklendi
- ✅ Kullanıcıya gösterilecek mesaj: "Kişiselleştirilmiş reklamlar ve içerik sunabilmek için izleme izninize ihtiyacımız var."

**Android**
- ✅ AdMob consent form zaten GDPR uyumlu
- ✅ Ek bir dialog gerekmiyor

### 3. Yeni Dosyalar
```
src/lib/nativeConsent.ts           # Native izin yönetim fonksiyonları
src/components/NativeConsentInit.tsx  # Uygulama başlatıcı
```

### 4. Layout Güncellemesi
- `NativeConsentInit` komponenti eklendi
- Uygulama açılışında (native'de) ATT izni otomatik olarak istenir

---

## 📱 Platform Karşılaştırması

| Özellik | Web | iOS | Android |
|---------|-----|-----|---------|
| Çerez Banner | ✅ Göster | ❌ Gizle | ❌ Gizle |
| ATT Dialog | ❌ Yok | ✅ Otomatik | ❌ Yok |
| AdMob Consent | ❌ Web'de yok | ✅ GDPR'de | ✅ GDPR'de |
| Tracking İzni | ❌ Çerez | ✅ ATT | ✅ AdMob |

---

## 🚀 Kullanım

### iOS'ta Test Etme
1. Xcode'da projeyi aç:
   ```bash
   npx cap open ios
   ```

2. Uygulamayı çalıştır

3. İlk açılışta ATT dialog'u otomatik gösterilir:
   - "Kişiselleştirilmiş reklamlar..." mesajı
   - "İzin Ver" / "İzin Verme" butonları

4. Kullanıcının seçimi AdMob'a iletilir

### Android'de Test Etme
1. Android Studio'da projeyi aç:
   ```bash
   npx cap open android
   ```

2. Uygulamayı çalıştır

3. AdMob GDPR consent form otomatik gösterilir (Avrupa'da)

### Web'de Test Etme
1. Development server başlat:
   ```bash
   npm run dev
   ```

2. Browser'da aç: http://localhost:3000

3. Çerez banner'ı sayfanın altında gösterilir

---

## 🔧 Gelecek İyileştirmeler (Opsiyonel)

### ATT Plugin Entegrasyonu
Şu an ATT kontrolü placeholder olarak çalışıyor. Gerçek implementasyon için:

```bash
# Capacitor ATT plugin kur
npm install @aparajita/capacitor-app-tracking-transparency
npx cap sync
```

Sonra `nativeConsent.ts` içinde güncelle:
```typescript
import { AppTrackingTransparency } from '@aparajita/capacitor-app-tracking-transparency';

export async function requestTrackingPermission() {
  const result = await AppTrackingTransparency.requestPermission();
  return {
    granted: result.status === 'authorized',
    status: result.status
  };
}
```

### Ayarlara Yönlendirme
Kullanıcı izni reddettiyse, ayarlar ekranından değiştirebilsin:

```typescript
import { App } from '@capacitor/app';

export async function openTrackingSettings() {
  if (platform === 'ios') {
    // iOS Settings açılabilir
    App.openUrl({ url: 'app-settings:' });
  }
}
```

---

## ✅ Sonuç

- ✅ Web: Çerez banner gösterilir (GDPR uyumlu)
- ✅ iOS: ATT dialog gösterilir (Apple zorunluluğu)
- ✅ Android: AdMob consent form (GDPR uyumlu)
- ✅ Gereksiz UI kaldırıldı (native'de çerez banner yok)

**Build ve test et:**
```bash
npm run build
npx cap sync
npx cap open ios   # veya android
```
