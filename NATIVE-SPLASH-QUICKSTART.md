# 🚀 NATIVE SPLASH SCREEN - HIZLI BAŞLANGIÇ

## 🎯 5 Dakikada Kurulum

### 1️⃣ Generator'ı Aç (TARAYICIda AÇILDI ✅)
```bash
open resources/splash-generator-advanced.html
```

### 2️⃣ Görselleri Oluştur
Tarayıcıda açılan generator'da:
- ✅ **"📦 Tüm Boyutları Oluştur"** butonuna tıkla
- ✅ İndirilen **17 PNG dosyasını** `resources/splash/` klasörüne taşı

### 3️⃣ Otomatik Kurulum
```bash
./setup-native-splash.sh
```

### 4️⃣ Test Et
```bash
# iOS
npx cap open ios

# Android
npx cap open android
```

---

## 🎨 GENERATOR ÖZELLİKLERİ

Tarayıcıda açılan arayüzde:

### Özelleştirmeler:
- 🎨 **Renk 1-3**: Gradient renkleri (varsayılanlar iyi)
- 📝 **Uygulama Adı**: TAKAS
- 📱 **Alt Metin**: 🔄 Eşyalarını Takas Et
- 🔧 **Logo Boyutu**: 280px (ayarlanabilir)
- ✨ **Animasyon**: Rotate (seçilebilir)

### Butonlar:
- 🔄 **Önizlemeyi Güncelle**: Değişiklikleri canlı gör
- 💾 **Bu Boyutu İndir**: Sadece önizleme boyutunu indir
- 📦 **Tüm Boyutları Oluştur**: 17 farklı boyutu otomatik oluştur ⭐

---

## 📦 OLUŞTURULACAK DOSYALAR

Generator **"Tüm Boyutları Oluştur"** butonuna tıkladığında:

### iOS (9 dosya):
- `splash-iphone-14-pro-max-1242x2688.png`
- `splash-iphone-14-pro-1125x2436.png`
- `splash-iphone-14-828x1792.png`
- `splash-iphone-se-750x1334.png`
- `splash-iphone-8-plus-1242x2208.png`
- `splash-iphone-5-640x1136.png`
- `splash-ipad-pro-12-9-2048x2732.png`
- `splash-ipad-pro-11-1668x2388.png`
- `splash-ipad-10-2-1536x2048.png`

### Android Portrait (4 dosya):
- `splash-android-xxxhdpi-port-1440x2560.png`
- `splash-android-xxhdpi-port-1080x1920.png`
- `splash-android-xhdpi-port-720x1280.png`
- `splash-android-hdpi-port-480x800.png`

### Android Landscape (4 dosya):
- `splash-android-xxxhdpi-land-2560x1440.png`
- `splash-android-xxhdpi-land-1920x1080.png`
- `splash-android-xhdpi-land-1280x720.png`
- `splash-android-hdpi-land-800x480.png`

**Toplam: 17 dosya**

---

## 📂 DOSYA YERLEŞİMİ

```
Takas-platform/
├── resources/
│   ├── splash/
│   │   ├── splash-iphone-14-pro-max-1242x2688.png  ← Buraya taşı
│   │   ├── splash-iphone-14-pro-1125x2436.png       ← Buraya taşı
│   │   ├── splash-android-xxxhdpi-port-1440x2560.png ← Buraya taşı
│   │   └── ... (14 dosya daha)
│   └── splash-generator-advanced.html (açıldı ✅)
```

---

## ⚡ KOMUTLAR

### Manuel Kurulum:
```bash
# 1. cordova-res yükle
npm install -g cordova-res

# 2. iOS splash'leri oluştur
cordova-res ios --skip-config --copy --type splash

# 3. Android splash'leri oluştur
cordova-res android --skip-config --copy --type splash

# 4. Build
npm run build

# 5. Sync
npx cap sync

# 6. Test
npx cap open ios      # veya
npx cap open android
```

### Otomatik (Önerilen):
```bash
./setup-native-splash.sh
```

---

## ✅ KONTROL LİSTESİ

### Kurulum Öncesi:
- [x] Generator tarayıcıda açıldı ✅
- [ ] 17 PNG dosyası oluşturuldu
- [ ] PNG'ler `resources/splash/` klasörüne taşındı
- [ ] `cordova-res` yüklendi
- [ ] Native splash'ler oluşturuldu
- [ ] Build yapıldı
- [ ] Sync yapıldı
- [ ] iOS/Android'de test edildi

---

## 🎨 SPLASH SCREEN ÖNIZLEME

Generator'da göreceğin tasarım:

```
┌─────────────────────────────────┐
│                                 │
│    [Gradient Background]        │
│    Pink → Purple → Indigo       │
│                                 │
│         ┌──────────┐            │
│    🔵  │    ⚪    │  🔴        │
│   (Mavi)│  (Takas) │(Pembe)     │
│         └──────────┘            │
│                                 │
│         TAKAS                   │
│   🔄 Eşyalarını Takas Et       │
│   Beğen • Eşleş • Takas Yap    │
│                                 │
│         • • •                   │
│    (Loading dots)               │
│                                 │
│  ⚡ Powered by Teknova         │
│       v1.0.0                    │
└─────────────────────────────────┘
```

---

## 🎯 SONRAKİ ADIMLAR

1. ✅ **Generator'dan görselleri oluştur**
   - "📦 Tüm Boyutları Oluştur" butonuna tıkla
   - 17 PNG dosyasını indir

2. ✅ **Dosyaları taşı**
   - İndirilen tüm PNG'leri `resources/splash/` klasörüne taşı

3. ✅ **Setup script'i çalıştır**
   ```bash
   ./setup-native-splash.sh
   ```

4. ✅ **Test et**
   ```bash
   npx cap open ios      # iOS için
   npx cap open android  # Android için
   ```

---

## 📚 DETAYLI DOKÜMANTASYON

Daha fazla bilgi için:
- 📖 `NATIVE-SPLASH-SETUP.md` - Detaylı kurulum rehberi
- 🎨 `SPLASH-SCREEN-IMPROVED.md` - Web splash screen değişiklikleri
- ⚙️ `capacitor.config.ts` - Yapılandırma dosyası

---

## 💡 İPUCU

Generator'da **canlı önizleme** var!
- Renkleri değiştir → Anında gör
- Metinleri düzenle → Canlı güncelleme
- Animasyonları dene → Gerçek zamanlı

**Mükemmel ayarları bulduğunda "Tüm Boyutları Oluştur"a tıkla! 🎨**

---

## 🆘 SORUN ÇÖZÜMÜ

### Generator açılmadı mı?
```bash
# Manuel aç
open resources/splash-generator-advanced.html

# veya tarayıcıdan
# Finder > resources > splash-generator-advanced.html > Aç
```

### Dosyalar nereye indirildi?
```bash
# Genellikle Downloads klasöründe
ls ~/Downloads/splash-*.png

# Taşımak için
mv ~/Downloads/splash-*.png resources/splash/
```

### Script çalışmıyor mu?
```bash
# İzin ver
chmod +x setup-native-splash.sh

# Tekrar dene
./setup-native-splash.sh
```

---

## 🚀 HAZIRSIN!

Generator açıldı ve hazır! Şimdi:
1. Tarayıcıdaki generator'da **"📦 Tüm Boyutları Oluştur"**
2. Dosyaları `resources/splash/` klasörüne taşı
3. `./setup-native-splash.sh` komutunu çalıştır

**3 adımda native splash screen'in hazır! 🎉**
