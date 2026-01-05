# ✅ KİŞİSEL VERİ GİZLİLİĞİ - TEST REHBERİ

## 📋 Test Edilmesi Gereken Alanlar

### 1. 🆕 YENİ KULLANICI KAYDI

#### Test Adımları:
1. `/login` sayfasına git
2. "Hesap Oluştur" butonuna tıkla
3. Aşağıdaki bilgileri gir:
   - **Adınız:** Ahmet
   - **Soyadınız:** Yılmaz
   - **Email:** test@example.com
   - **Şifre:** 123456

#### Beklenen Sonuçlar:
- ✅ İki ayrı input alanı görünmeli (Ad + Soyad)
- ✅ KVKK bilgilendirme metni görünmeli: "🔒 Sadece adınız gösterilecektir"
- ✅ Kayıt başarılı olmalı
- ✅ Otomatik login yapmalı

#### Doğrulama:
```sql
-- Supabase SQL Editor'de çalıştır
SELECT 
  id, 
  email, 
  first_name,   -- "Ahmet" olmalı
  last_name,    -- "Yılmaz" olmalı
  display_name, -- "Ahmet" olmalı
  name          -- "Ahmet" olmalı (geriye uyumluluk)
FROM users 
WHERE email = 'test@example.com';
```

---

### 2. 👤 PROFİL SAYFASI

#### Test Adımları:
1. Login ol
2. `/profile` sayfasına git
3. Profil bilgilerini kontrol et

#### Beklenen Sonuçlar:
- ✅ Görüntüleme modunda:
  - Sadece ad gösterilmeli: "Ahmet"
  - Alt kısımda bilgi metni: "🔒 Soyadınız gizlidir"
  
- ✅ Düzenleme modunda:
  - İki ayrı input: "Adınız" ve "Soyadınız (gizli)"
  - Bilgi metni: "🔒 Sadece adınız gösterilir"

#### UI Screenshot Karşılaştırması:

**ÖNCESİ:**
```
┌──────────────┐
│   [Avatar]   │
│ Ahmet Yılmaz │  ← YANLIŞ: Tam ad-soyad
│ test@mail.com│
└──────────────┘
```

**SONRASI:**
```
┌──────────────────────┐
│      [Avatar]        │
│       Ahmet          │  ← DOĞRU: Sadece ad
│ 🔒 Soyadınız gizlidir│
│   test@mail.com      │
└──────────────────────┘
```

---

### 3. 🃏 SWIPE KART GÖRÜNÜMÜ

#### Test Adımları:
1. Ana sayfaya (feed) git
2. Ürün kartlarını kontrol et

#### Beklenen Sonuçlar:
- ✅ Kart üzerinde sadece ad görünmeli: "[A] Ahmet ⭐ 4.5"
- ✅ Soyad GÖRÜNMEMELİ

#### Kart Görünümü:

**ÖNCESİ:**
```
┌─────────────────────┐
│  [Ürün Fotoğrafı]   │
│   Kol saati         │
│ [A] Ahmet Yılmaz ⭐ │  ← YANLIŞ
└─────────────────────┘
```

**SONRASI:**
```
┌─────────────────────┐
│  [Ürün Fotoğrafı]   │
│   Kol saati         │
│   [A] Ahmet ⭐ 4.5  │  ← DOĞRU
└─────────────────────┘
```

---

### 4. ⭐ DEĞERLENDİRME MODAL

#### Test Adımları:
1. Bir eşleşme yap
2. Değerlendirme modalını aç

#### Beklenen Sonuçlar:
- ✅ Modal başlığında sadece ad: "Ahmet"
- ✅ Bilgi metni: "🔒 Sadece ad gösterilir, soyad gizlidir"

---

### 5. 🔄 MEVCUT KULLANICILARIN MİGRASYONU

#### Test Adımları:
1. Migration script'ini çalıştır:
```bash
./run-privacy-migration.sh
```

VEYA Supabase Dashboard:
```sql
-- migrations/001_add_privacy_fields.sql dosyasını çalıştır
```

#### Beklenen Sonuçlar:
- ✅ Tüm mevcut kullanıcılar migrate edilmeli
- ✅ "Ahmet Yılmaz" → firstName: "Ahmet", lastName: "Yılmaz"
- ✅ "Zeynep" → firstName: "Zeynep", lastName: ""

#### Doğrulama:
```sql
-- Migration sonrası kontrol
SELECT 
  COUNT(*) as toplam_kullanıcı,
  COUNT(first_name) as migrate_edilen
FROM users;

-- Detaylı kontrol
SELECT 
  name as eski_veri,
  first_name,
  last_name,
  display_name
FROM users 
LIMIT 10;
```

#### Beklenen Output:
```
toplam_kullanıcı | migrate_edilen
-----------------|---------------
       50        |       50
```

---

### 6. 📱 MOBİLE TEST

#### Test Adımları:
1. Uygulamayı mobil cihazda aç
2. Tüm yukarıdaki testleri tekrarla

#### Özel Kontroller:
- ✅ İki input alanı mobilde düzgün görünmeli
- ✅ KVKK metni mobilde okunabilir olmalı
- ✅ Kartlar mobilde sadece ad göstermeli

---

## 🐛 BİLİNEN SORUNLAR & ÇÖZÜMLER

### Sorun 1: Migration çalışmıyor
**Çözüm:**
```bash
# Manuel migration
psql $SUPABASE_DB_URL -f migrations/001_add_privacy_fields.sql
```

### Sorun 2: Mevcut kullanıcılar hala tam ad gösteriyor
**Çözüm:**
```sql
-- Tekrar migrate et
UPDATE users 
SET 
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = SUBSTRING(name FROM POSITION(' ' IN name) + 1),
  display_name = SPLIT_PART(name, ' ', 1)
WHERE first_name IS NULL;
```

### Sorun 3: Yeni kayıtta hata
**Kontrol:**
- [ ] firstName ve lastName input alanları var mı?
- [ ] signUp fonksiyonu 4 parametre alıyor mu?
- [ ] Database'de first_name, last_name kolonları var mı?

---

## ✅ CHECKLIST

### Frontend Test:
- [ ] Kayıt formu iki alan gösteriyor
- [ ] KVKK metni görünüyor
- [ ] Yeni kullanıcı kaydı çalışıyor
- [ ] Profile sadece ad gösteriyor
- [ ] SwipeCard sadece ad gösteriyor
- [ ] RatingModal bilgilendirme gösteriyor
- [ ] Edit modu firstName/lastName ayrı gösteriyor

### Backend Test:
- [ ] Migration başarıyla çalıştı
- [ ] Tüm kullanıcılar migrate edildi
- [ ] Yeni kayıtlar doğru kolonlara yazılıyor
- [ ] displayName otomatik oluşuyor
- [ ] Eski 'name' kolonu geriye uyumluluk için dolu

### Mobile Test:
- [ ] Mobil responsive çalışıyor
- [ ] Input alanları mobilde düzgün
- [ ] KVKK metni mobilde okunuyor

### Güvenlik Test:
- [ ] Soyad bilgisi API'lerde görünmüyor
- [ ] Sadece firstName/displayName dönüyor
- [ ] RLS politikaları aktif

---

## 📊 BAŞARI KRİTERLERİ

| Kriter | Hedef | Durum |
|--------|-------|-------|
| Migration başarı oranı | 100% | ⏳ Test bekliyor |
| Yeni kayıt başarısı | 100% | ⏳ Test bekliyor |
| Kart görünümü doğruluğu | Sadece ad | ⏳ Test bekliyor |
| KVKK uyumluluğu | Tam uyumlu | ⏳ Test bekliyor |
| Kullanıcı bilgilendirmesi | Görünür | ⏳ Test bekliyor |

---

## 🚀 PRODUCTION'A GEÇMEDEN ÖNCE

### Zorunlu Adımlar:
1. ✅ Tüm testler başarılı olmalı
2. ⏳ Migration production DB'de test edilmeli
3. ⏳ Kullanıcılara email bildirimi hazırlanmalı
4. ⏳ KVKK uzmanından onay alınmalı
5. ⏳ Backup alınmalı

### Önerilen Adımlar:
- [ ] A/B test yapın (kullanıcı tepkileri)
- [ ] Analytics ekleyin (adoption rate)
- [ ] Rollback planı hazırlayın
- [ ] Support ekibini bilgilendirin

---

## 📝 NOTLAR

### Migration Zamanı:
- Tahmini süre: 5-10 dakika
- Downtime: YOK (zero-downtime migration)
- Rollback süresi: < 1 dakika

### Kullanıcı Etkisi:
- Mevcut kullanıcılar: Sadece görünüm değişir
- Yeni kullanıcılar: İki alan görür
- Data loss: YOK

---

**Test Tarihi:** ____________________
**Test Eden:** ____________________
**Sonuç:** ⏳ BEKLEMEDE / ✅ BAŞARILI / ❌ BAŞARISIZ
