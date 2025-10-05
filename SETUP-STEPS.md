# 🚀 Supabase Setup - ADIM ADIM REHBER

## ✅ Projeniz Hazır!
**Project ID**: rraatgwihvrxopjahpoh
**URL**: https://rraatgwihvrxopjahpoh.supabase.co

---

## 📋 Yapılacaklar Listesi

### ✅ 1. Database Schema Kurulumu (2 dakika)

1. **SQL Editor'ü Aç**:
   - Tarayıcınızda zaten açık olmalı
   - Veya: https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/editor

2. **Schema SQL'i Çalıştır**:
   ```bash
   # Terminal'de bu komutu çalıştır:
   cat supabase/schema.sql | pbcopy
   ```
   
   Veya manuel:
   - `supabase/schema.sql` dosyasını aç
   - **Tüm içeriği kopyala** (Cmd+A, Cmd+C)

3. **SQL Editor'de**:
   - "New query" butonuna tıkla
   - Kopyaladığın SQL'i yapıştır (Cmd+V)
   - **RUN** butonuna tıkla (veya Cmd+Enter)

✅ Başarılı mesajı görmelisin!

**Ne Oluşturuldu:**
- `users` tablosu
- `items` tablosu
- `swipes` tablosu
- `matches` tablosu
- `messages` tablosu
- RLS policies
- Trigger functions

---

### ✅ 2. Storage Bucket Oluştur (1 dakika)

1. **Storage Sayfası**:
   https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/storage/buckets

2. **New Bucket**:
   - Name: `item-images`
   - ✅ Public bucket (işaretle!)
   - Create bucket

3. **Policies Ayarla**:
   - `item-images` bucket'ına tıkla
   - **Policies** sekmesi
   - **New Policy** → **For full customization**
   
   **Policy 1: Public Read**
   ```
   Target roles: SELECT
   Policy name: Public read access
   USING expression: true
   ```
   
   **Policy 2: Authenticated Upload**
   ```
   Target roles: INSERT
   Policy name: Authenticated upload
   WITH CHECK expression: auth.role() = 'authenticated'
   ```

---

### ✅ 3. Environment Variables (1 dakika)

1. **API Keys Al**:
   https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/settings/api

2. **Kopyala**:
   - **Project URL**: `https://rraatgwihvrxopjahpoh.supabase.co` (zaten .env.local'de)
   - **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (uzun key)

3. **`.env.local` Dosyasını Güncelle**:
   ```bash
   # Dosyayı aç:
   code .env.local
   
   # veya
   open -a "Visual Studio Code" .env.local
   ```
   
   `paste-your-anon-key-here` yerine kopyaladığın **anon public** key'i yapıştır.

4. **Kaydet!** (Cmd+S)

---

### ✅ 4. Test Et! (1 dakika)

```bash
# Development server'ı başlat
npm run dev

# Tarayıcıda aç: http://localhost:3000
```

**Console'da kontrol et** (F12):
```javascript
// Test Supabase connection
const { data, error } = await supabase.from('items').select('count')
console.log('Supabase OK:', data, error)
```

---

### ✅ 5. Netlify Environment Variables

Deploy etmeden önce Netlify'da da ayarla:

1. **Netlify Dashboard**:
   https://app.netlify.com/teams/veteroner/projects

2. Site'i deploy ettikten sonra:
   - Site settings → Environment variables
   - **Add a variable** (2 tane)

   ```
   NEXT_PUBLIC_SUPABASE_URL = https://rraatgwihvrxopjahpoh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon-key-buraya]
   ```

3. **Redeploy** (değişiklikler uygulanır)

---

## 🧪 İlk Test Verisi (Opsiyonel)

SQL Editor'de test verisi ekle:

```sql
-- Test kullanıcısı oluştur (Authentication > Users'da da yapabilirsin)
-- Veya direkt UI'dan bir kullanıcı oluştur: Authentication > Add user

-- Test ürünü ekle (UI'dan ürün yükle sayfasından da yapabilirsin)
INSERT INTO items (
  title, 
  description, 
  category, 
  condition, 
  images, 
  owner_id
) VALUES (
  'İlk Test Ürünü',
  'Bu bir test ürünüdür',
  'toys',
  'good',
  ARRAY['https://via.placeholder.com/400'],
  (SELECT id FROM users LIMIT 1) -- İlk kullanıcı
);
```

---

## ✅ Checklist

Tamamlandı mı?

- [ ] Database schema çalıştırıldı ✓
- [ ] Storage bucket oluşturuldu (`item-images`) ✓
- [ ] Storage policies ayarlandı ✓
- [ ] `.env.local` dosyası güncellendi ✓
- [ ] `npm run dev` ile test edildi ✓
- [ ] Netlify env variables (deploy sonrası) ⏳

---

## 🎯 Hızlı Linkler

| Sayfa | Link |
|-------|------|
| Dashboard | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh |
| SQL Editor | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/editor |
| Table Editor | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/editor |
| Storage | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/storage/buckets |
| API Settings | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/settings/api |
| Authentication | https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/auth/users |

---

## 🆘 Sorun Giderme

### "Invalid API key" hatası:
- `.env.local` dosyasında `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru mu?
- Server'ı restart et: `npm run dev`

### "relation does not exist" hatası:
- SQL schema çalıştırıldı mı?
- SQL Editor'de `SELECT * FROM items;` dene

### Storage upload hatası:
- Bucket `item-images` public mu?
- Policies ayarlandı mı?

---

## 🎉 Hazır!

Backend artık çalışır durumda! 🚀

**Next Steps:**
1. ✅ Schema kur → SQL Editor
2. ✅ Storage ayarla → Buckets
3. ✅ Env variables → .env.local
4. ✅ Test et → npm run dev
5. 🎯 Ürün yükle ve swipe yap!

**Başarılar! 🎊**
