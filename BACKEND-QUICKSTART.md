# 🎯 Backend Integration - Quick Start

## ✅ Kurulum Tamamlandı!

Backend dosyaları hazır:
- ✅ Supabase client (`src/lib/supabase.ts`)
- ✅ API services (`src/lib/api.ts`)
- ✅ Database schema (`supabase/schema.sql`)
- ✅ TypeScript types

---

## 🚀 Hemen Başla - 3 Adım

### 1️⃣ Supabase Projesi Oluştur (5 dakika)

1. **https://supabase.com** → Sign up (GitHub ile)
2. **New Project** → Name: `takas-platform`
3. **Password**: Güçlü şifre (kaydet!)
4. **Region**: Europe West
5. **Free plan** seç → **Create**

⏱️ 2 dakika bekle...

### 2️⃣ Database Kur (2 dakika)

1. **SQL Editor** → **New query**
2. `supabase/schema.sql` dosyasını aç
3. **Tüm içeriği kopyala** → SQL Editor'e yapıştır
4. **Run** (Cmd+Enter)

✅ Tables created!

### 3️⃣ Environment Variables (1 dakika)

1. Supabase → **Settings** → **API**
2. Kopyala:
   - **Project URL**
   - **anon public key**

3. Proje klasöründe `.env.local` oluştur:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. Netlify'da da ayarla:
   - Site settings → Environment variables
   - İki değişkeni ekle

---

## 🖼️ BONUS: Storage Setup (Fotoğraf Yükleme)

1. **Storage** → **New bucket**
2. Name: `item-images`
3. ✅ Public bucket
4. **Create**

5. **Policies** → **New policy**:
   ```
   Policy 1: Public read - true
   Policy 2: Authenticated upload - auth.role() = 'authenticated'
   ```

---

## 🧪 Test Et!

### Local Test:
```bash
# Development server başlat
npm run dev

# Tarayıcıda: http://localhost:3000
# Console'da Supabase bağlantısını gör
```

### Database Test:
```sql
-- SQL Editor'de çalıştır
SELECT * FROM users;
SELECT * FROM items;
```

---

## 📝 Kullanım Örnekleri

### Ürün Yükleme (Upload sayfası zaten hazır!)
```typescript
import { createItem, uploadImage } from '@/lib/api'

// Fotoğraf yükle
const imageUrl = await uploadImage(file, userId)

// Ürün oluştur
const item = await createItem({
  title: 'Jean Ceket',
  description: 'Vintage',
  category: 'clothing',
  condition: 'good',
  images: [imageUrl],
  owner_id: userId
})
```

### Feed Getir (Ana sayfa)
```typescript
import { getFeedItems } from '@/lib/api'

const items = await getFeedItems(userId, 20)
```

### Swipe Kaydet
```typescript
import { recordSwipe } from '@/lib/api'

await recordSwipe(userId, itemId, 'right') // Match kontrolü otomatik!
```

### Mesaj Gönder
```typescript
import { sendMessage } from '@/lib/api'

await sendMessage(matchId, senderId, receiverId, 'Merhaba!')
```

---

## 🔄 Şimdi Ne Yapmalı?

1. **SUPABASE-SETUP.md** dosyasını oku (detaylı rehber)
2. Supabase projesini oluştur
3. `.env.local` dosyasını ayarla
4. `npm run dev` ile test et
5. Ürün yükle ve database'de gör!

---

## 📊 Backend Özellikleri

✅ **Tam CRUD** - Create, Read, Update, Delete
✅ **Authentication** - Kullanıcı sistemi
✅ **File Upload** - Fotoğraf yükleme
✅ **Real-time** - Canlı mesajlaşma
✅ **Match System** - Otomatik eşleşme
✅ **Security** - Row Level Security
✅ **Scalable** - Otomatik ölçeklendirme

---

## 🆘 Sorun mu Var?

### Backend bağlanamıyor:
```typescript
// src/lib/supabase.ts dosyasını kontrol et
// .env.local dosyası var mı?
// Environment variables doğru mu?
```

### Database hatası:
```sql
-- SQL Editor'de kontrol et:
SELECT * FROM items LIMIT 1;

-- Hata varsa schema.sql tekrar çalıştır
```

---

## 🎉 Hazır!

Backend production-ready! 🚀

**Free Tier Limits:**
- 500MB database ✅
- 1GB storage ✅
- 50K monthly users ✅

Yeterli olmaz ise: $25/month

---

## 📚 Detaylı Dokümantasyon

- `SUPABASE-SETUP.md` - Adım adım kurulum
- `supabase/schema.sql` - Database yapısı
- `src/lib/api.ts` - API fonksiyonları
- `src/lib/supabase.ts` - Supabase client

**Başarılar! 🎊**
