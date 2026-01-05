# Rating Sistemi Kurulum Kontrolü

## ✅ Tamamlanan İşlemler

1. **RatingModal Komponenti** 
   - ✅ Zaten mevcut ve tam fonksiyonel
   - Lokasyon: `/src/components/RatingModal.tsx`
   - Özellikler: 5 yıldız rating, yorum, animasyonlar

2. **Profil Sayfası Linki**
   - ✅ "Tüm Değerlendirmeler →" butonu eklendi
   - Rating card'ında görünüyor
   - `/profile/ratings` sayfasına yönlendiriyor

3. **API Fonksiyonları**
   - ✅ `/src/lib/api.ts` içinde mevcut
   - `rateUser()`, `getUserAverageRating()`, `getUserRatingCount()`, vb.

4. **Ratings Görüntüleme Sayfası**
   - ✅ `/src/app/profile/ratings/page.tsx` mevcut
   - Kullanıcının aldığı tüm değerlendirmeleri gösterir

---

## 🔧 Yapılması Gerekenler

### 1. Database Migration Kontrolü

**ÖNEMLİ:** Rating sisteminin çalışması için `user_ratings` tablosunun database'de olması gerekiyor.

**Kontrol Adımları:**

1. Supabase Dashboard'a git: https://supabase.com/dashboard
2. Projeyi seç
3. Sol menüden "SQL Editor"a tıkla
4. Şu sorguyu çalıştır:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_ratings'
);
```

**Sonuç:**
- `true` → Tablo mevcut ✅
- `false` → Migration çalıştırılmalı ❌

---

### 2. Migration Çalıştırma (Eğer Tablo Yoksa)

Eğer tablo yoksa, aşağıdaki SQL dosyasını Supabase SQL Editor'da çalıştır:

**Dosya:** `/supabase/create-rating-system.sql`

**Çalıştırma Yöntemi:**

```bash
# Option 1: Manual (Supabase Dashboard)
1. supabase/create-rating-system.sql dosyasını aç
2. Tüm içeriği kopyala
3. Supabase Dashboard → SQL Editor → New Query
4. Yapıştır ve Run

# Option 2: Terminal (eğer Supabase CLI kuruluysa)
supabase db push
```

---

### 3. Test Senaryosu

Migration tamamlandıktan sonra test et:

**A) Manuel Test Verisi Ekle:**

```sql
-- Test için rating ekle (Supabase SQL Editor)
INSERT INTO user_ratings (rater_id, rated_user_id, match_id, rating, comment)
VALUES (
  'YOUR_USER_ID_HERE',  -- Kendi user ID'n
  'OTHER_USER_ID_HERE', -- Test user ID
  'test-match-123',
  5,
  'Harika bir takas deneyimiydi! 🎉'
);
```

**B) Profil Sayfasında Kontrol:**
1. `/profile` sayfasına git
2. Rating sayısının değişip değişmediğine bak
3. "Tüm Değerlendirmeler →" linkine tıkla
4. Eklenen yorumun görünüp görünmediğini kontrol et

---

### 4. Match Completion Flow (Gelecek İyileştirme)

**Şu anda eksik:** Kullanıcılar rating modal'ını nasıl açacak?

**Çözüm Seçenekleri:**

**A) Mesajlar Sayfasında "Tamamla" Butonu:**
```tsx
// /src/app/messages/page.tsx veya match detay sayfası
<button onClick={() => setShowRatingModal(true)}>
  ✓ Takası Tamamla ve Değerlendir
</button>
```

**B) Bildirimden Açma:**
```tsx
// Notification handler
if (notification.type === 'rating_required') {
  // Rating modalını aç
  setShowRatingModal(true)
}
```

**C) Profil Sayfasından Manuel:**
```tsx
// Test için geçici buton
<button onClick={() => setShowRatingModal(true)}>
  Test: Rating Ver
</button>
```

---

## 🎯 Öncelik Sırası

1. **[YÜKSEK]** Database migration kontrolü + çalıştırma
2. **[YÜKSEK]** Test verisi ile doğrulama
3. **[ORTA]** Match completion flow ekleme
4. **[DÜŞÜK]** Notification handling

---

## 📊 Mevcut Dosya Yapısı

```
Rating Sistemi
├── Database
│   └── supabase/create-rating-system.sql (Migration dosyası)
├── API
│   └── src/lib/api.ts (Rating CRUD fonksiyonları)
├── Components
│   └── src/components/RatingModal.tsx (Rating formu)
└── Pages
    ├── src/app/profile/page.tsx (Rating gösterimi + link)
    └── src/app/profile/ratings/page.tsx (Tüm yorumları listele)
```

---

## ✅ Sonraki Adım

**ŞİMDİ YAP:**
1. Supabase Dashboard'a gir
2. `user_ratings` tablosunun var olup olmadığını kontrol et
3. Yoksa `create-rating-system.sql` dosyasını çalıştır
4. Test verisi ekle
5. Profil sayfasında kontrol et

Migration tamamlanınca rating sistemi tam çalışır hale gelecek! 🚀
