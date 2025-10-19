# 🌟 Rating System - Karşılıklı Değerlendirme Sistemi

## 📖 OVERVIEW

Takas tamamlandığında kullanıcıların birbirlerini puanlaması için WhatsApp tarzı karşılıklı değerlendirme sistemi.

## 🎯 FEATURES

### ✅ Implemented Features:

1. **Match Completion Flow**
   - "Takası Tamamla" butonu chat ekranında
   - Her iki taraf onayladığında match completed olur
   - Otomatik bildirim gönderimi

2. **Rating Modal**
   - 1-5 yıldız rating sistemi
   - Opsiyonel yorum alanı (500 karakter)
   - Smooth animasyonlar (Framer Motion)
   - Responsive tasarım

3. **Profile Integration**
   - Ortalama puan gösterimi
   - Toplam değerlendirme sayısı
   - Rating özeti ve istatistikler
   - Tüm değerlendirmeleri görüntüleme

4. **Database System**
   - `user_ratings` tablosu
   - `matches` tablosuna yeni kolonlar (user1_confirmed, user2_confirmed, completed_at)
   - RLS policies (Row Level Security)
   - Helper functions (PostgreSQL)

## 📂 FILES

### 🆕 Created Files:

```
/supabase/create-rating-system.sql          # Database schema
/src/components/RatingModal.tsx             # Rating modal component
/src/app/profile/ratings/page.tsx           # All ratings view page
```

### 📝 Modified Files:

```
/src/lib/api.ts                             # API functions for ratings
/src/components/Chat.tsx                    # Added completion button & modal
/src/app/profile/page.tsx                   # Rating summary integration
```

## 🗄️ DATABASE SCHEMA

### `user_ratings` Table

```sql
CREATE TABLE user_ratings (
  id UUID PRIMARY KEY,
  rater_id UUID REFERENCES auth.users(id),      -- Kim puanlıyor
  rated_user_id UUID REFERENCES auth.users(id), -- Kim puanlanıyor
  match_id UUID REFERENCES matches(id),         -- Hangi takas
  rating INTEGER (1-5),                         -- Puan
  comment TEXT,                                 -- Yorum (opsiyonel)
  created_at TIMESTAMPTZ,
  
  UNIQUE(rater_id, match_id)                    -- Her match'te 1 kez puan
);
```

### `matches` Table Updates

```sql
ALTER TABLE matches ADD COLUMN:
- user1_confirmed BOOLEAN DEFAULT false
- user2_confirmed BOOLEAN DEFAULT false
- completed_at TIMESTAMPTZ
```

## 🔧 HELPER FUNCTIONS

### 1. `get_user_average_rating(user_id)`
Kullanıcının ortalama puanını hesaplar
```sql
SELECT AVG(rating) FROM user_ratings WHERE rated_user_id = user_id
```

### 2. `get_user_rating_count(user_id)`
Kullanıcının aldığı toplam puan sayısı

### 3. `complete_match(match_id, user_id)`
Match'i tamamlar, her iki taraf da onayladıysa status='completed' yapar

### 4. `user_has_rated_match(user_id, match_id)`
Kullanıcı bu match'i puanladı mı kontrol eder

### 5. `check_match_both_rated(match_id)`
Her iki taraf da puanlama yaptı mı kontrol eder

## 🎨 UI/UX FLOW

### Match Completion Flow:

```
1. User1: "Takası Tamamla" butonuna basar
   └─> matches.user1_confirmed = true
   └─> Status: "⏳ Diğer tarafın onayı bekleniyor..."

2. User2: "Takası Tamamla" butonuna basar
   └─> matches.user2_confirmed = true
   └─> matches.status = 'completed'
   └─> matches.completed_at = NOW()
   └─> Her iki tarafa bildirim gönderilir

3. Rating Modal otomatik açılır
   └─> User1 ve User2 birbirini puanlar
   └─> Yorumlar opsiyonel

4. Her ikisi de puanladı mı kontrol edilir
   └─> Profile stats güncellenir
```

### Chat Screen States:

- **Active**: "Takası Tamamla" butonu gösterilir
- **Pending**: "⏳ Diğer tarafın onayı bekleniyor..."
- **Completed (Not Rated)**: "✅ Takas tamamlandı! Lütfen puanlayın."
- **Completed (Rated)**: "🌟 Takas tamamlandı ve puanlandı!"

## 🚀 API FUNCTIONS

### `confirmMatchCompletion(matchId, userId)`
```typescript
const result = await confirmMatchCompletion(matchId, userId)
// Returns: { success, message, showRatingModal, bothConfirmed }
```

### `rateUser({ raterId, ratedUserId, matchId, rating, comment })`
```typescript
const success = await rateUser({
  raterId: 'user-id',
  ratedUserId: 'other-user-id',
  matchId: 'match-id',
  rating: 5,
  comment: 'Harika bir takas!'
})
```

### `getUserAverageRating(userId)`
```typescript
const avgRating = await getUserAverageRating(userId)
// Returns: 4.7 (or 5.0 if no ratings)
```

### `getUserRatingCount(userId)`
```typescript
const count = await getUserRatingCount(userId)
// Returns: 12
```

### `hasUserRatedMatch(userId, matchId)`
```typescript
const hasRated = await hasUserRatedMatch(userId, matchId)
// Returns: true/false
```

### `getUserRatings(userId)`
```typescript
const ratings = await getUserRatings(userId)
// Returns: [{ rating, comment, rater, match, created_at }, ...]
```

## 📊 PROFILE STATS INTEGRATION

Profile sayfasında artık şunlar gösterilir:

```typescript
stats: {
  sharedItems: 4,        // Paylaşılan ürün sayısı
  receivedItems: 12,     // Tamamlanan takas sayısı
  rating: 4.7            // Ortalama puan (database'den)
}
```

### Rating Display:

- **5.0 - 4.5**: "🌟 Mükemmel!"
- **4.4 - 4.0**: "👍 Harika!"
- **3.9 - 3.5**: "💪 İyi!"
- **3.4 - 0**: "📈 İyileştirilebilir"

## 🔔 NOTIFICATIONS

`trigger_notify_match_completed()` trigger'ı:

```sql
-- Match completed olduğunda her iki tarafa bildirim gönderir
INSERT INTO notifications (user_id, type, title, message, data)
VALUES (
  user_id,
  'rating_required',
  'Takası Puanla',
  'Tamamlanan takasınız için lütfen karşı tarafı puanlayın!',
  jsonb_build_object('match_id', match_id)
)
```

## 🛡️ SECURITY (RLS)

### user_ratings RLS Policies:

```sql
-- SELECT: Kullanıcılar sadece kendilerine verilen puanları görebilir
USING (auth.uid() = rated_user_id OR auth.uid() = rater_id)

-- INSERT: Kullanıcılar sadece kendi puanlarını ekleyebilir
WITH CHECK (auth.uid() = rater_id)

-- UPDATE: 24 saat içinde güncellenebilir
USING (auth.uid() = rater_id AND created_at > NOW() - INTERVAL '24 hours')
```

## 📦 INSTALLATION

### 1. Run SQL Migration

```bash
# Supabase Dashboard → SQL Editor'da çalıştır:
/supabase/create-rating-system.sql
```

### 2. Verify Tables

```sql
-- Check tables created
SELECT * FROM user_ratings LIMIT 1;
SELECT user1_confirmed, user2_confirmed FROM matches LIMIT 1;

-- Test functions
SELECT get_user_average_rating('user-id');
SELECT get_user_rating_count('user-id');
```

### 3. Test Frontend

```bash
npm run dev

# Test flow:
1. Chat ekranında "Takası Tamamla" butonuna bas
2. Her iki taraftan da onayla
3. Rating modal açılsın
4. Puan ver ve yorum yaz
5. Profile sayfasında rating'i gör
```

## 🎯 TESTING CHECKLIST

- [ ] SQL migration başarılı çalıştı
- [ ] Chat ekranında "Takası Tamamla" butonu görünüyor
- [ ] Tek taraf onayladığında "bekleniyor" mesajı gösteriliyor
- [ ] Her iki taraf onayladığında rating modal açılıyor
- [ ] 1-5 yıldız rating çalışıyor
- [ ] Yorum yazma opsiyonel
- [ ] Rating submit başarılı
- [ ] Profile sayfasında ortalama puan gösteriliyor
- [ ] "Tüm Değerlendirmeleri Gör" sayfası çalışıyor
- [ ] Rating distribution chart doğru gösteriliyor
- [ ] Bildirimler gönderiliyor

## 🐛 TROUBLESHOOTING

### Problem: "user_ratings table does not exist"
```bash
# Çözüm: SQL migration'ı Supabase'de çalıştır
# Dashboard → SQL Editor → create-rating-system.sql
```

### Problem: "column user1_confirmed does not exist"
```bash
# Çözüm: matches tablosuna kolonlar eklenmedi
# SQL'de ALTER TABLE komutlarını manuel çalıştır
```

### Problem: RPC function not found
```bash
# Çözüm: Helper functions oluşturulmamış
# SQL dosyasındaki CREATE FUNCTION komutlarını çalıştır
```

### Problem: Rating modal açılmıyor
```bash
# Debug:
console.log('Match status:', matchStatus)
console.log('Show rating modal:', showRatingModal)
console.log('User has rated:', userHasRated)

# loadMatchStatus() fonksiyonunun çağrıldığından emin ol
```

## 🚀 FUTURE IMPROVEMENTS

### Potential Enhancements:

1. **Animated Star Rating**
   - Hover efektleri
   - Bounce animasyonlar

2. **Review Photos**
   - Kullanıcılar fotoğraf ekleyebilir
   - Takas sonrası ürün durumu kanıtı

3. **Rating Categories**
   - İletişim
   - Ürün kalitesi
   - Teslimat hızı
   - Genel deneyim

4. **Reply to Reviews**
   - Kullanıcılar yorumlara cevap verebilir

5. **Report Abuse**
   - Kötü niyetli yorumları raporlama

6. **Rating Reminders**
   - 24 saat sonra reminder notification
   - Push notification

7. **Badge System**
   - "Super Trader" badge (5.0 rating)
   - "Trusted Seller" (10+ perfect ratings)

## 📄 LICENSE

Part of Takas Platform - All rights reserved

## 👥 CONTACT

For questions or issues, contact the development team.

---

**Status**: ✅ READY FOR TESTING
**Version**: 1.0.0
**Last Updated**: 19 Ekim 2025
