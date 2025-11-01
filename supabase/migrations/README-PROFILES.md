# Profiles Tablosu - Admin Mesajlar Hatası Çözümü

## 🐛 Sorun
Admin panelinde mesajlar sayfası şu hatayı veriyordu:
```
Could not find the table 'public.profiles' in the schema cache
```

## ✅ Çözüm
`profiles` tablosu oluşturuldu.

## 📋 Kurulum Adımları

### 1. Supabase Dashboard'a Git
👉 https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh

### 2. SQL Editor'ı Aç
- Sol menüden **SQL Editor** seçeneğine tıkla
- **New Query** butonuna bas

### 3. Migration SQL'ini Çalıştır
Aşağıdaki dosyanın içeriğini kopyala ve SQL Editor'a yapıştır:
```
supabase/migrations/00002_create_profiles_table.sql
```

### 4. Mevcut Kullanıcılar İçin Profil Oluştur
Eğer zaten kullanıcılar varsa (auth.users tablosunda), onlar için de profil oluştur:

```sql
INSERT INTO public.profiles (id, email, full_name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

## 🎯 Tablo Yapısı

### Kolonlar:
- `id` (UUID) - Primary Key, auth.users ile ilişkili
- `email` (TEXT) - Kullanıcı email
- `full_name` (TEXT) - Tam ad
- `avatar` (TEXT) - Profil resmi URL
- `bio` (TEXT) - Biyografi
- `phone` (TEXT) - Telefon
- `city` (TEXT) - Şehir
- `rating` (DECIMAL) - Ortalama puan (0-5)
- `total_ratings` (INTEGER) - Toplam değerlendirme sayısı
- `created_at` (TIMESTAMP) - Oluşturulma tarihi
- `updated_at` (TIMESTAMP) - Güncellenme tarihi

### Özellikler:
- ✅ **Row Level Security (RLS)** etkin
- ✅ Herkes profilleri görebilir (SELECT policy)
- ✅ Kullanıcılar kendi profillerini oluşturabilir (INSERT policy)
- ✅ Kullanıcılar kendi profillerini güncelleyebilir (UPDATE policy)
- ✅ **Otomatik Trigger**: Yeni kullanıcı kaydolduğunda otomatik profil oluşur
- ✅ **Index'ler**: email ve created_at için hızlı sorgular

## 🔄 Trigger Davranışı

Yeni bir kullanıcı `auth.users` tablosuna eklendiğinde:
```sql
INSERT INTO auth.users (email, ...) 
VALUES ('user@example.com', ...);
```

Otomatik olarak `profiles` tablosuna kayıt oluşur:
```sql
-- Trigger tarafından otomatik çalışır
INSERT INTO public.profiles (id, email, full_name)
VALUES (user_id, 'user@example.com', 'user@example.com');
```

## 🧪 Test

SQL çalıştıktan sonra test et:

```sql
-- 1. Profiles tablosunu kontrol et
SELECT * FROM public.profiles LIMIT 5;

-- 2. Mesaj gönderen kullanıcıları kontrol et
SELECT DISTINCT 
  m.sender_id, 
  p.email, 
  p.full_name
FROM messages m
LEFT JOIN profiles p ON m.sender_id = p.id
LIMIT 10;

-- 3. Profile olmayan kullanıcıları bul (boş olmalı)
SELECT u.id, u.email
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

## 📝 Notlar

- Bu tablo **zorunlu** değildir, ama admin paneli mesajlar bölümü için gereklidir
- Mevcut kullanıcılar için manuel profil oluşturma gerekebilir (yukarıdaki INSERT komutu)
- Gelecekte kaydolan tüm kullanıcılar için otomatik profil oluşur
- `email` kolonu `auth.users` ile senkronize değildir, gerekirse manuel güncelleme yapılmalıdır

## 🔗 İlgili Dosyalar

- Migration: `/supabase/migrations/00002_create_profiles_table.sql`
- Admin API: `/src/app/api/admin/messages/users/route.ts`
- Admin API (User): `/src/app/api/admin/messages/users/[userId]/route.ts`
- Admin Page: `/src/app/admin/messages/page.tsx`
- Admin Detail: `/src/app/admin/messages/[userId]/page.tsx`

## ✅ Sonuç

Migration çalıştırıldıktan sonra:
- ✅ Admin paneli mesajlar bölümü çalışır
- ✅ Kullanıcı istatistikleri görüntülenir
- ✅ Her kullanıcının mesajlarına erişilebilir
- ✅ KVKK uyumlu log sistemi aktif
