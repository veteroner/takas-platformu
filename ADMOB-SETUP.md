# AdMob Entegrasyonu Kılavuzu

## 🎯 Reklam Stratejisi

Takas Platform uygulamasında 3 tip reklam kullanıyoruz:

### 1. **Banner Reklamlar** 📱
- **Konum**: Ana sayfa swipe kartları altında
- **Görünüm**: Sürekli
- **Gelir**: Orta, ama sürekli
- **Kullanıcı Deneyimi**: Az rahatsız edici

### 2. **Interstitial Reklamlar** 🎬
- **Konum**: Her 5 swipe'da bir otomatik gösterilir
- **Görünüm**: Tam ekran
- **Gelir**: Yüksek
- **Kullanıcı Deneyimi**: Orta rahatsız edici (ama stratejik zamanlarda)

### 3. **Rewarded Reklamlar** 🎁
- **Konum**: Profil sayfasında "Ekstra Swipe Kazan" butonu
- **Görünüm**: Kullanıcı isteğiyle
- **Gelir**: En yüksek (eCPM)
- **Kullanıcı Deneyimi**: Kullanıcı dostu (karşılığında ödül)

## 📦 Kurulum

Paketler zaten yüklendi:
```bash
npm install @capacitor-community/admob
```

## ⚙️ Yapılandırma

### Test ID'leri (Şu anda aktif)

**iOS:**
- Banner: `ca-app-pub-3940256099942544/2934735716`
- Interstitial: `ca-app-pub-3940256099942544/4411468910`
- Rewarded: `ca-app-pub-3940256099942544/1712485313`
- App ID: `ca-app-pub-3940256099942544~1458002511`

**Android:**
- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`
- Rewarded: `ca-app-pub-3940256099942544/5224354917`
- App ID: `ca-app-pub-3940256099942544~3347511713`

### Gerçek ID'lere Geçiş

1. **AdMob Hesabı Oluştur**
   - https://admob.google.com adresine git
   - Hesap oluştur ve uygulamayı ekle

2. **Reklam Birimleri Oluştur**
   - iOS ve Android için ayrı ayrı:
     - Banner Ad
     - Interstitial Ad
     - Rewarded Ad

3. **ID'leri Güncelle**
   - `src/lib/admob.ts` dosyasındaki `AD_IDS` objesini güncelle
   - `capacitor.config.ts` dosyasındaki `appId`'yi güncelle
   - `ios/App/App/Info.plist` dosyasındaki `GADApplicationIdentifier` değerini güncelle
   - `android/app/src/main/AndroidManifest.xml` dosyasındaki `APPLICATION_ID` değerini güncelle

4. **Test Modunu Kapat**
   - `src/lib/admob.ts` dosyasında:
     - `initializeForTesting: false` yap
     - Her reklam fonksiyonunda `isTesting: false` yap

## 🚀 Kullanım

### Banner Reklam
```tsx
import BannerAd from '@/components/BannerAd'

<BannerAd /> // Alt merkezde banner gösterir
```

### Interstitial Reklam
```tsx
import { useInterstitialAd } from '@/hooks/useInterstitialAd'

const { isReady, show } = useInterstitialAd()

// Reklam göster
if (isReady) {
  await show()
}
```

### Rewarded Reklam
```tsx
import { useRewardedAd } from '@/hooks/useRewardedAd'

const { isReady, show } = useRewardedAd((reward) => {
  console.log('Kullanıcı ödül kazandı:', reward)
  // Ödül ver
})

// Reklam göster
if (isReady) {
  await show()
}
```

## 📱 Native Yapılandırma

### iOS (Info.plist)
```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-3940256099942544~1458002511</string>
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>
```

### Android (AndroidManifest.xml)
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713" />
```

## 🧪 Test Etme

1. **Web'de Test**
   - Web'de AdMob çalışmaz, konsol log'larını kontrol edin

2. **iOS/Android'de Test**
   ```bash
   npm run build
   npx cap sync
   npx cap open ios    # iOS için
   npx cap open android # Android için
   ```

3. **Test Reklamları Görüntüleme**
   - Test ID'leri ile gerçek reklamlar gibi görünür
   - Tıklama yapabilirsiniz (gelir kazanmazsınız)
   - Her zaman reklam döner

## 📊 Gelir Optimizasyonu

### eCPM Tahminleri (Türkiye)
- **Banner**: $0.50 - $2.00
- **Interstitial**: $3.00 - $8.00
- **Rewarded**: $8.00 - $15.00

### Stratejiler
1. **Banner'ları Ana Sayfalarda Kullan** - Sürekli görünüm
2. **Interstitial'ları Doğru Zamanlarda Göster** - Kullanıcı deneyimini bozmadan
3. **Rewarded'ları İyi Ödüllerle Sun** - Kullanıcı kendi isteğiyle izler

### Swipe Sayacı Ayarları
Ana sayfa'da her 5 swipe'da bir interstitial gösteriliyor. Bunu değiştirmek için:
```tsx
// src/app/page.tsx
const [swipeCounter] = useState(() => new SwipeCounter(5, () => { // 5'i değiştir
  if (interstitialAd.isReady) {
    interstitialAd.show()
  }
}))
```

## ⚠️ Önemli Notlar

1. **Test ID'lerini Production'da KULLANMA**
   - AdMob hesabınız kısıtlanabilir
   - Test için test ID'leri, canlı için gerçek ID'leri kullan

2. **Kendi Reklamlarınıza Tıklama**
   - Asla kendi reklamlarınıza tıklamayın
   - Test ID'leri ile test edin

3. **AdMob Policy**
   - https://support.google.com/admob/answer/6128543
   - Politikalara uygun içerik kullanın

4. **iOS ATT (App Tracking Transparency)**
   - iOS 14+ için kullanıcı izni gerekli
   - Entegrasyon otomatik olarak yapılmış

## 🐛 Sorun Giderme

### "No ad to show" Hatası
- Reklam henüz yüklenmemiş, birkaç saniye bekleyin
- `isReady` state'ini kontrol edin

### iOS'ta Reklamlar Görünmüyor
- Info.plist'te GADApplicationIdentifier var mı kontrol edin
- Pod install çalıştırın: `cd ios/App && pod install`

### Android'de Reklamlar Görünmüyor
- AndroidManifest.xml'de APPLICATION_ID var mı kontrol edin
- Internet permission var mı kontrol edin

## 📚 Dosya Yapısı

```
src/
├── lib/
│   └── admob.ts              # AdMob servis fonksiyonları
├── hooks/
│   ├── useInterstitialAd.ts  # Interstitial reklam hook'u
│   └── useRewardedAd.ts      # Rewarded reklam hook'u
└── components/
    ├── AdMobInit.tsx         # AdMob başlatıcı
    ├── BannerAd.tsx          # Banner reklam komponenti
    └── RewardedAdButton.tsx  # Rewarded reklam butonu
```

## 🎉 Entegre Edilen Sayfalar

✅ Ana Sayfa (`src/app/page.tsx`)
- Banner reklam (alt)
- Interstitial reklam (her 5 swipe)

✅ Profil Sayfası (`src/app/profile/page.tsx`)
- Rewarded reklam butonu (+10 ekstra swipe)

✅ Layout (`src/app/layout.tsx`)
- AdMob başlatıcı

## 🔄 Sonraki Adımlar

1. ✅ Test ID'leri ile test et
2. ⏳ AdMob hesabı oluştur
3. ⏳ Gerçek reklam birimlerini oluştur
4. ⏳ ID'leri güncelle
5. ⏳ Test modunu kapat
6. ⏳ Production'a deploy et

## 💡 İpuçları

- İlk 1-2 hafta gelir düşük olabilir (AdMob öğreniyor)
- Kullanıcı engagement arttıkça gelir artar
- A/B test yaparak en iyi reklam sıklığını bulun
- Rewarded reklamları teşvik edin (en yüksek eCPM)

