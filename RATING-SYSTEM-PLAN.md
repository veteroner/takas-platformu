# RATING SİSTEMİ - Eksik Özellikler Planı

## 🎯 DURUM ANALİZİ

### ✅ MEVCUT:
- Database: `user_ratings` tablosu + fonksiyonlar ✓
- API: Rating CRUD fonksiyonları ✓  
- UI: `/profile/ratings` sayfası (yorumları listeler) ✓
- Profil stats: Ortalama puan gösterimi ✓

### ❌ EKSİK:
1. **RatingModal komponenti** - Kullanıcı puanlama formu YOK
2. **Match tamamlama butonu** - Takas sonrası "Tamamla" butonu YOK
3. **Profil → Değerlendirmeler linki** - Yorumları göster butonu YOK
4. **Rating notification handling** - Bildirime tıklayınca modal açılmıyor

---

## 📋 İMPLEMENTASYON PLANI

### 1️⃣ RatingModal Komponenti (ÖNCELİK: YÜKSEK)
**Dosya:** `src/components/RatingModal.tsx`

**Özellikler:**
- 5 yıldızlı rating sistemi
- Yorum textarea (opsiyonel)
- Kullanıcı bilgisi gösterimi (avatar + isim)
- Match bilgisi
- Submit + İptal butonları
- Turnstile bot koruması (opsiyonel)

**Props:**
```typescript
interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  matchId: string
  ratedUserId: string
  ratedUserName: string
  ratedUserAvatar?: string
  onSuccess?: () => void
}
```

**Akış:**
1. Modal açılır → Kullanıcı bilgisi + yıldızlar
2. Yıldıza tıkla → Rating seç (1-5)
3. Yorum yaz (opsiyonel)
4. Gönder → API çağrısı (`rateUser`)
5. Başarılı → Toast + Modal kapat + callback

---

### 2️⃣ Profil Sayfasına "Değerlendirmeler" Butonu
**Dosya:** `src/app/profile/page.tsx`

**Değişiklik:**
```tsx
{/* User Ratings Section */}
<div className="mb-6">
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        {t('ratings')}
      </h3>
      {/* ✨ YENİ: Tüm Yorumları Gör Butonu */}
      <Link 
        href="/profile/ratings"
        className="text-white/70 hover:text-white text-sm underline"
      >
        Tüm Yorumları Gör ({stats.receivedItems}) →
      </Link>
    </div>
    
    {/* Rating özeti buraya */}
  </div>
</div>
```

---

### 3️⃣ Match Tamamlama Butonu (Eşleşmeler Sayfası)
**Dosya:** `src/app/messages/page.tsx` VEYA yeni `src/app/matches/page.tsx`

**Senaryo:**
1. Kullanıcı "Eşleşmelerim" sayfasına gider
2. Aktif match'leri görür
3. "Takas Tamamlandı" butonuna tıklar
4. Her iki taraf da tıkladı mı kontrol et
5. Evet → Match status = 'completed' + Rating modalı aç
6. Hayır → "Diğer tarafın onayı bekleniyor" toast

**Buton Örneği:**
```tsx
<button
  onClick={() => handleCompleteMatch(match.id)}
  className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
  ✓ Takası Tamamla
</button>
```

**API Call:**
```typescript
const result = await completeMatch(matchId, userId)
if (result.show_rating_modal) {
  setRatingModalOpen(true)
  setCurrentMatch(match)
}
```

---

### 4️⃣ Notification'dan Rating Modal Açma
**Dosya:** `src/app/notifications/page.tsx`

**Değişiklik:**
```tsx
// Notification'a tıklanınca
const handleNotificationClick = (notification) => {
  if (notification.type === 'rating_required') {
    const matchId = notification.data?.match_id
    // Match bilgilerini al
    // Rating modalı aç
    setRatingModalOpen(true)
  }
  // ... diğer tipler
}
```

---

## 🚀 IMPLEMENTASYON SIRASI

### Adım 1: RatingModal Komponenti (30 dk)
- Yıldız rating UI
- Form validasyonu
- API entegrasyonu

### Adım 2: Profil "Değerlendirmeler" Linki (5 dk)
- Basit Link komponenti ekle

### Adım 3: Match Completion (Opsiyonel - 1 saat)
- Eşleşmeler sayfası oluştur
- Tamamlama butonu + flow
- API entegrasyonu

### Adım 4: Notification Handling (15 dk)
- rating_required tipini handle et
- Modal aç

---

## ✅ İLK ADIM ÖNERİSİ

**ŞİMDİ YAPALIM:**
1. ✅ RatingModal komponenti oluştur
2. ✅ Profil sayfasına "Tüm Yorumları Gör" linki ekle
3. ⏳ Test için manuel rating verme (developer tools ile)

**SONRA YAPALIM (opsiyonel):**
- Match completion flow (daha kompleks)
- Notification handling

---

## 💡 HIZLI TEST SENARYOSU

```sql
-- Test için manuel rating ekle
INSERT INTO user_ratings (rater_id, rated_user_id, match_id, rating, comment)
VALUES (
  'user1-uuid',
  'user2-uuid', 
  'match-uuid',
  5,
  'Harika bir takas deneyimiydi! Teşekkürler 🎉'
);
```

Onay verirsen başlayalım! 🚀
