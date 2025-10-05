# 🗄️ Supabase Backend Setup Guide

## 📋 Neden Supabase?

✅ **Tamamen Ücretsiz** - 500MB database, 1GB storage, 50K monthly users
✅ **PostgreSQL** - Güçlü, production-ready database
✅ **Real-time** - WebSocket ile canlı mesajlaşma
✅ **Authentication** - Built-in auth system
✅ **Storage** - Fotoğraf yükleme için
✅ **Row Level Security** - Güvenli veri erişimi
✅ **Auto-scaling** - Otomatik ölçeklendirme

---

## 🚀 1. Supabase Hesabı Oluştur

### Adım 1: Supabase'e Kayıt Ol
1. https://supabase.com adresine git
2. **"Start your project"** → **"Sign up"**
3. GitHub ile giriş yap (önerilen) veya email ile

### Adım 2: Yeni Proje Oluştur
1. **"New Project"** butonuna tıkla
2. **Organization**: (Varsa seç, yoksa "New organization")
3. **Project Name**: `takas-platform`
4. **Database Password**: Güçlü bir şifre oluştur (kaydet!)
5. **Region**: `Europe West (eu-west-1)` veya size en yakın
6. **Pricing Plan**: `Free` seç
7. **"Create new project"** tıkla

⏱️ Proje oluşumu ~2 dakika sürer...

---

## 🗄️ 2. Database Schema Kurulumu

### Adım 1: SQL Editor'ü Aç
1. Supabase dashboard → Sol menüden **"SQL Editor"** tıkla
2. **"New query"** butonuna tıkla

### Adım 2: Schema SQL'i Çalıştır
1. `supabase/schema.sql` dosyasını aç
2. **Tüm içeriği kopyala**
3. SQL Editor'e **yapıştır**
4. **"Run"** butonuna tıkla (veya Cmd/Ctrl + Enter)

✅ Başarılı mesajı görmelisiniz!

### Oluşturulan Tablolar:
- ✅ `users` - Kullanıcı profilleri
- ✅ `items` - Ürünler
- ✅ `swipes` - Swipe kayıtları
- ✅ `matches` - Eşleşmeler
- ✅ `messages` - Mesajlar

---

## 🖼️ 3. Storage (Fotoğraf Depolama) Kurulumu

### Adım 1: Storage Bucket Oluştur
1. Sol menüden **"Storage"** tıkla
2. **"New bucket"** butonuna tıkla
3. **Name**: `item-images`
4. **Public bucket**: ✅ İşaretle (fotoğraflar herkese açık)
5. **"Create bucket"** tıkla

### Adım 2: Storage Policies
1. `item-images` bucket'ına tıkla
2. **"Policies"** sekmesine git
3. **"New policy"** tıkla

#### Policy 1: Public Read (Herkes okuyabilir)
```sql
-- Target: SELECT/GET
-- Policy name: Public read access
-- Check:
true
```

#### Policy 2: Authenticated Upload (Giriş yapanlar yükleyebilir)
```sql
-- Target: INSERT
-- Policy name: Authenticated users can upload
-- Check:
auth.role() = 'authenticated'
```

---

## 🔑 4. API Keys ve Environment Variables

### Adım 1: API Keys'i Al
1. Supabase Dashboard → **"Settings"** (sol alt köşe)
2. **"API"** sekmesine git
3. **Project URL** ve **anon public** key'i kopyala

### Adım 2: .env.local Dosyası Oluştur

Projenizde `.env.local` dosyası oluşturun:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**ÖNEMLİ**: `.env.local` dosyası `.gitignore` içinde (Git'e gitmeyecek)

### Adım 3: Netlify Environment Variables

Netlify'da da ayarlamalısınız:

1. Netlify Dashboard → Site settings → **"Environment variables"**
2. **"Add a variable"** tıkla
3. Her iki değişkeni ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 👥 5. Authentication Setup (Opsiyonel)

### Email Authentication
1. **"Authentication"** → **"Providers"**
2. **"Email"** zaten aktif
3. **"Confirm email"** → İsteğe bağlı kapatabilirsiniz (development için)

### Google/GitHub OAuth (İsteğe Bağlı)
1. **"Authentication"** → **"Providers"**
2. İstediğiniz provider'ı seç (Google/GitHub)
3. OAuth credentials ekle
4. Callback URL'i ayarla

---

## 🧪 6. Test Verisi Ekle (Opsiyonel)

Test için örnek veri ekleyelim:

```sql
-- Test user (SQL Editor'de çalıştır)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('test@example.com', 'dummy', NOW());

-- Bu otomatik olarak users tablosuna profil oluşturacak

-- Test item
INSERT INTO items (title, description, category, condition, images, owner_id)
VALUES (
  'Test Ürün',
  'Bu bir test ürünüdür',
  'toys',
  'good',
  ARRAY['https://via.placeholder.com/400'],
  (SELECT id FROM users LIMIT 1)
);
```

---

## ✅ 7. Kontrol Listesi

Tamamlandı mı?

- [ ] Supabase hesabı oluşturuldu
- [ ] Yeni proje oluşturuldu
- [ ] Database schema çalıştırıldı
- [ ] Storage bucket oluşturuldu (`item-images`)
- [ ] Storage policies ayarlandı
- [ ] API keys kopyalandı
- [ ] `.env.local` dosyası oluşturuldu
- [ ] Netlify environment variables ayarlandı
- [ ] Test verisi eklendi (opsiyonel)

---

## 📊 8. Database Yönetimi

### Table Editor
- **"Table Editor"** → Tabloları görüntüle/düzenle
- Verileri manuel ekle/sil/güncelle

### SQL Editor
- Custom queries çalıştır
- Database backup al
- Analytics queries

### Realtime
- **"Database"** → **"Replication"**
- Tabloları realtime için etkinleştir
- Mesajlaşma için `messages` tablosunu etkinleştir

---

## 🔒 9. Güvenlik

### Row Level Security (RLS)
✅ Zaten schema.sql'de kuruldu!

- Kullanıcılar sadece kendi verilerini görebilir
- Public veriler herkes tarafından okunabilir
- Auth olmadan yazma yok

### API Keys
- ⚠️ **anon key** public olabilir (client-side)
- 🔒 **service_role key** ASLA public yapma!

---

## 📈 10. Monitoring

### Dashboard
- **"Database"** → Disk usage, connections
- **"Auth"** → Active users
- **"Storage"** → Bucket size
- **"Logs"** → Query logs, errors

### Alerts
- **"Settings"** → **"Billing"**
- Email alerts ayarla (disk full, rate limit)

---

## 🆘 Sorun Giderme

### Connection Error
```typescript
// Supabase bağlantısını test et
const { data, error } = await supabase.from('items').select('count')
console.log(data, error)
```

### RLS Policy Hatası
- SQL Editor → **"Policies"** kontrol et
- Policy'leri disable/enable dene
- `auth.uid()` null ise authentication kontrol et

### Storage Upload Hatası
- Bucket'ın public olduğundan emin ol
- File size limit kontrol et (50MB max free tier)
- CORS ayarlarını kontrol et

---

## 🎉 Hazır!

Backend artık kullanıma hazır! 🚀

**Next Steps:**
1. Local'de test et: `npm run dev`
2. Ürün yükle ve database'de gör
3. Swipe yap, match oluştur
4. Mesajlaş!

**Free Tier Limits:**
- 500 MB database
- 1 GB storage
- 2 GB bandwidth
- 50K monthly active users

Production için upgrade gerekirse: ~$25/month

---

## 📚 Kaynaklar

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

**Başarılar! 🎊**
