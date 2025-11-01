# Unity Ads + AdMob Hybrid Entegrasyonu

## 📋 Genel Bakış

Uygulama artık **Unity Ads** ve **Google AdMob** reklamlarını birlikte destekliyor:
- ✅ **Unity Ads öncelikli**: Varsa Unity Ads kullanılır
- ✅ **AdMob fallback**: Unity yoksa otomatik olarak AdMob'a geçer
- ✅ **Sadece Interstitial Reklamlar**: Her 5 swipe'da bir tam ekran reklam
- ❌ **Banner ve Rewarded Reklamlar**: Kaldırıldı

## 🎯 Reklam Stratejisi

### Unity Ads (Öncelikli)
- Native Unity Ads SDK kullanır
- iOS ve Android için ayrı Game ID'ler
- Test Mode desteği

### AdMob (Fallback)
- Unity Ads hazır değilse devreye girer
- Google AdMob SDK kullanır
- Test Ad ID'leri ile çalışır

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── unityAds.ts          # Unity Ads entegrasyonu
│   ├── admob.ts             # AdMob entegrasyonu (mevcut)
│   └── adManager.ts         # Unified ad manager (Unity + AdMob)
├── hooks/
│   ├── useAds.ts            # Unified ads hook (YENİ)
│   └── useInterstitialAd.ts # Eski AdMob hook (korundu)
└── components/
    ├── AdsInit.tsx          # Unified ads initializer
    └── AdMobInit.tsx        # Eski AdMob initializer (korundu)
```

## 🔧 Kurulum

### 1. TypeScript Kodları
✅ Tamamlandı - Build başarılı

### 2. Native Unity Ads SDK Kurulumu

#### Android (Android Studio)

1. **build.gradle (Project level)** - Unity Ads repository ekle:
```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://maven.google.com' }
    }
}
```

2. **build.gradle (App level)** - Unity Ads dependency ekle:
```gradle
dependencies {
    implementation 'com.unity3d.ads:unity-ads:4.12.0'
}
```

3. **MainActivity.java** - Unity Ads initialize et:
```java
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.UnityAds;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Unity Ads initialization
        UnityAds.initialize(this, "5721307", true, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {
                Log.d("UnityAds", "Initialization Complete");
            }

            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
                Log.e("UnityAds", "Initialization Failed: " + message);
            }
        });
    }
}
```

#### iOS (Xcode)

1. **Podfile** - Unity Ads pod ekle:
```ruby
target 'App' do
  capacitor_pods
  
  # Unity Ads
  pod 'UnityAds', '~> 4.12.0'
end
```

2. Terminal'de pod install:
```bash
cd ios/App
pod install
```

3. **AppDelegate.swift** - Unity Ads initialize et:
```swift
import UIKit
import Capacitor
import UnityAds

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Unity Ads initialization
        UnityAds.initialize("5721306", testMode: true, initializationDelegate: self)
        
        return true
    }
}

extension AppDelegate: UnityAdsInitializationDelegate {
    func initializationComplete() {
        print("Unity Ads initialization complete")
    }
    
    func initializationFailed(_ error: UnityAdsInitializationError, withMessage message: String) {
        print("Unity Ads initialization failed: \(message)")
    }
}
```

### 3. Unity Ads Dashboard Kurulumu

1. [Unity Dashboard](https://dashboard.unity3d.com/) hesabı oluştur
2. Yeni proje oluştur
3. **Monetization > Ads** bölümüne git
4. **Game ID**'leri al:
   - Android Game ID
   - iOS Game ID
5. **Ad Units** oluştur:
   - Interstitial_Android
   - Interstitial_iOS

### 4. Game ID'leri Güncelle

`src/lib/unityAds.ts` dosyasında test ID'lerini gerçek ID'lerle değiştir:

```typescript
const UNITY_ADS_CONFIG = {
  android: {
    gameId: 'GERÇEK_ANDROID_GAME_ID', // Test: 5721307
    testMode: false, // Production'da false
    interstitialAdUnitId: 'Interstitial_Android',
  },
  ios: {
    gameId: 'GERÇEK_IOS_GAME_ID', // Test: 5721306
    testMode: false, // Production'da false
    interstitialAdUnitId: 'Interstitial_iOS',
  }
};
```

## 🎮 Kullanım

### Uygulama Kodunda

```typescript
import { useAds } from '@/hooks/useAds';

function MyComponent() {
  const ads = useAds();
  
  // Reklam hazır mı kontrol et
  console.log('Ad Ready:', ads.isReady);
  
  // Hangi network kullanılıyor
  console.log('Active Network:', ads.activeNetwork); // 'unity' | 'admob' | 'none'
  
  // Reklam göster
  const handleShowAd = async () => {
    await ads.show();
  };
  
  // Yeni reklam hazırla
  const handlePrepareAd = async () => {
    await ads.prepare();
  };
}
```

### Otomatik Swipe Counter ile

Ana sayfada zaten entegre (`src/app/page.tsx`):

```typescript
const ads = useAds();

const [swipeCounter] = useState(() => new AdSwipeCounter(5, () => {
  if (ads.isReady) {
    ads.show();
  }
}));

// Her swipe'da
const handleSwipe = () => {
  swipeCounter.increment(); // Her 5 swipe'da otomatik reklam
};
```

## 🔍 Test Etme

### Console Logları

Uygulama başlatıldığında console'da göreceksin:

```
Initializing Ad Manager (Unity Ads + AdMob)...
✅ Unity Ads initialized successfully - will be used as primary
Ad Manager initialized. Using: Unity Ads
```

veya Unity yoksa:

```
Initializing Ad Manager (Unity Ads + AdMob)...
⚠️ Unity Ads not available, falling back to AdMob
Ad Manager initialized. Using: AdMob
```

### Swipe Sayacı

Her swipe'da:
```
Swipe counter: 1/5
Swipe counter: 2/5
Swipe counter: 3/5
Swipe counter: 4/5
Swipe counter: 5/5
🎯 Threshold reached, triggering ad callback
📺 Showing Unity Ads Interstitial
```

## 📊 Reklam Akışı

```
Uygulama Başlangıcı
        ↓
[AdsInit Component]
        ↓
    Initialize
        ↓
    ┌─────────┐
    │Unity Ads│ → Başarılı? → ✅ Unity Ads Kullan
    └─────────┘      ↓
                  Başarısız?
                     ↓
                 ┌───────┐
                 │ AdMob │ → ✅ AdMob Kullan
                 └───────┘
                     ↓
            5 Swipe Sayacı
                     ↓
              Reklam Göster
```

## ⚙️ Yapılandırma

### Test Mode

Test modunda (development):
- Unity Ads: Test Game ID'leri kullanılır
- AdMob: Test Ad Unit ID'leri kullanılır

### Production Mode

Production'da (`testMode: false`):
- Gerçek Game ID'ler kullanılır
- Gerçek reklam gösterilir
- Gelir kazanmaya başlar

## 🚀 Build ve Deploy

```bash
# Build
npm run build

# Sync native platforms
npx cap sync

# Android Studio'da aç
npx cap open android

# Xcode'da aç
npx cap open ios
```

## 📱 Platf Native Kod Özeti

### Android (`MainActivity.java`)
- Unity Ads SDK import edilmeli
- `onCreate()` içinde Unity Ads initialize edilmeli

### iOS (`AppDelegate.swift`)
- Unity Ads SDK pod ile yüklenmeli
- `didFinishLaunchingWithOptions` içinde Unity Ads initialize edilmeli

## 🎯 Sonuç

✅ Unity Ads + AdMob hybrid sistem hazır
✅ Öncelik: Unity Ads
✅ Fallback: AdMob
✅ Her 5 swipe'da bir interstitial reklam
✅ Banner ve Rewarded reklamlar kaldırıldı
✅ TypeScript altyapısı tamamlandı

🔜 **Sonraki Adım**: Native kod entegrasyonu (Android ve iOS)
