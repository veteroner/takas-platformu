# 🐛 Dil Değiştirme Bug Raporu

**Tarih:** 3 Ocak 2026
**Durum:** 🔴 Kritik - Kullanıcı deneyimini etkiliyor
**Öncelik:** Yüksek

---

## 📋 Problem Tanımı

### Kullanıcı Senaryosu:
1. ✅ Kullanıcı giriş yapmadan dili **İngilizce** olarak seçiyor
2. ✅ Kullanıcı girişi yapıyor
3. ❌ Ayarlar sayfasına girdiğinde dil otomatik olarak **Türkçe**'ye dönüyor
4. ❌ İngilizce seçildiğinde anlık değişiyor ama tekrar **Türkçe**'ye dönüyor

### Gözlemlenen Davranış:
- Dil seçimi localStorage'a kaydediliyor
- Kullanıcı girişi yapınca Supabase'den kullanıcı ayarları çekiliyor
- Veritabanındaki dil tercihi (muhtemelen `tr`) localStorage'ı override ediyor
- Anlık değişiklikler geçici, sayfa yeniden render edilince tekrar Türkçe oluyor

---

## 🔍 Teknik Analiz

### Sorunun Kök Nedeni:

#### 1️⃣ **Race Condition - useEffect Çakışması**

**Dosya:** `/src/app/settings/page.tsx` (Satır 30, 63, 77, 233)

```typescript
// SORUN 1: Initial state i18n.language'den geliyor (localStorage/cookie)
const [settings, setSettings] = useState({
  language: i18n.language as 'tr' | 'en' | 'de' | 'ar' | 'da', // ✅ İngilizce
  // ...
})

// SORUN 2: loadUser useEffect'i Supabase'den veriyi çekince override ediyor
const loadUser = useCallback(async () => {
  // ...
  if (userSettings) {
    const loadedSettings = {
      language: userSettings.language, // ❌ Veritabanından 'tr' geliyor
      // ...
    }
    setSettings(loadedSettings) // State güncelleniyor
    await i18n.changeLanguage(userSettings.language) // i18n de Türkçe'ye dönüyor
  }
}, [router, i18n])

// SORUN 3: Select onChange'de sadece state güncellenip localStorage'a yazılıyor
onChange={async (e) => {
  const newLang = e.target.value
  setSettings({...settings, language: newLang}) // State güncellendi
  await i18n.changeLanguage(newLang) // i18n güncellendi
  localStorage.setItem('i18nextLng', newLang) // localStorage güncellendi
  // ❌ SUPABASE GÜNCELLENMEDİ! Kullanıcı "Kaydet" butonuna basmadı
}}
```

#### 2️⃣ **Veritabanı Senkronizasyon Problemi**

**Senaryo:**
- Kullanıcı **ilk kez** giriş yaptığında `user_settings` tablosunda kayıt YOK
- Veritabanında kayıt olmadığında default dil `'tr'` oluyor
- Kullanıcı dil değiştiriyor ama **Save** butonuna basmıyor
- Sayfa yeniden yüklendiğinde veritabanından `null` dönüyor
- `null` durumunda localStorage kullanılmalı ama kodda bu kontrol eksik

#### 3️⃣ **localStorage vs Supabase Priority**

**Mevcut Akış:**
```
1. Sayfa yükleniyor
2. Initial state: i18n.language (localStorage'dan) → 'en' ✅
3. loadUser useEffect çalışıyor
4. Supabase'den getUserSettings('user_id')
5. Eğer userSettings.language = 'tr' ise:
   - setSettings({ language: 'tr' }) ❌
   - i18n.changeLanguage('tr') ❌
   - localStorage override ediliyor ❌
```

**Olması Gereken Akış:**
```
1. Sayfa yükleniyor
2. localStorage'dan dil tercihi kontrol ediliyor → 'en'
3. Supabase'den getUserSettings kontrol ediliyor
4. EĞER localStorage !== Supabase:
   - Hangisi daha yeni/öncelikli? → localStorage (kullanıcı en son seçti)
   - Supabase'i güncelle
5. İkisi de yoksa → Browser language ya da 'tr'
```

---

## 🎯 Çözüm Stratejisi

### Düzeltme Adımları:

#### ✅ **Adım 1:** İlk Kullanıcı Girişinde Default Dil Ayarını Kaydet
- Kullanıcı ilk kez giriş yaptığında `user_settings` tablosunda kayıt oluştur
- Default dil olarak `localStorage.i18nextLng` kullan (kullanıcının seçtiği dil)
- Eğer localStorage boşsa browser language kullan

#### ✅ **Adım 2:** localStorage Önceliği
- Kullanıcı ayarlar sayfasında dil değiştirdiğinde **hem localStorage hem Supabase** güncelle
- "Kaydet" butonuna gerek kalmadan anlık senkronize et
- localStorage her zaman Supabase ile senkron olmalı

#### ✅ **Adım 3:** Race Condition Düzeltmesi
- `loadUser` useEffect'inde localStorage kontrolü ekle
- Eğer localStorage'daki dil Supabase'dekinden farklıysa → localStorage kazanır
- Supabase'i de arka planda güncelle

#### ✅ **Adım 4:** Dil Değiştirme Optimizasyonu
- Select onChange'de **hem state, hem localStorage, hem Supabase** güncelle
- Kullanıcı "Kaydet" butonuna basmadan da kalıcı olsun
- Anlık feedback + persistent storage

---

## 📝 Kod Değişiklikleri

### Değiştirilecek Dosyalar:
1. ✏️ `/src/app/settings/page.tsx` - Dil değiştirme mantığı
2. ✏️ `/src/lib/i18n.ts` - Dil tespiti mantığı (gerekirse)
3. ✏️ `/src/lib/userSettings.ts` - Yeni kullanıcı için default ayarlar

### Test Senaryoları:
- [ ] Yeni kullanıcı giriş yapıyor → Dil tercihini seçiyor → Giriş yapıyor → Dil korunuyor
- [ ] Mevcut kullanıcı ayarlar sayfasında dil değiştiriyor → Sayfa yenileniyor → Dil korunuyor
- [ ] Kullanıcı farklı cihazdan giriş yapıyor → Son seçtiği dil görünüyor
- [ ] localStorage temizlenince → Supabase'den doğru dil yükleniyor

---

## 🚀 Uygulama Planı

1. **settings/page.tsx düzelt** - Race condition çöz, localStorage priority ekle
2. **userSettings.ts güncelle** - İlk kullanıcı için default ayar oluştur
3. **Test et** - Yukarıdaki senaryoları doğrula
4. **Deploy** - Production'a gönder

---

## 📊 Beklenen Sonuç

✅ Kullanıcı giriş yapmadan dil seçiyor → **Korunuyor**
✅ Kullanıcı giriş yapıyor → **Seçtiği dil aktif**
✅ Ayarlar sayfasında dil değiştiriyor → **Anlık ve kalıcı**
✅ Sayfa yenileniyor → **Dil aynı kalıyor**
✅ Farklı cihazdan giriş yapıyor → **Son seçim aktif**

---

**Rapor Oluşturan:** GitHub Copilot
**Analiz Süresi:** 3 Ocak 2026
