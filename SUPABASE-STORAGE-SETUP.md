# 🔧 Supabase Storage Bucket Setup

## ❌ Sorun: "Load Failed" - Resim Yükleme Hatası

### Olası Nedenler:

1. **Bucket Yok** ❌
   - `item-images` bucket'ı Supabase'de oluşturulmamış olabilir

2. **Bucket Public Değil** ❌
   - Bucket private olabilir, public URL çalışmaz

3. **File Size Limit** ❌
   - Supabase free tier: 50 MB/file limit
   - Optimize edilmiş dosyalar 300 KB max (sorun değil)

4. **Storage Quota** ❌
   - 100 GB limit dolmuş olabilir (muhtemelen değil)

5. **Permission Hatası** ❌
   - RLS policy yok veya hatalı

## ✅ Çözüm: Supabase Dashboard'da Kontrol Et

### Adım 1: Bucket Kontrolü

1. **Supabase Dashboard'a git:**
   - https://supabase.com/dashboard

2. **Storage → Buckets**
   - `item-images` bucket'ını bul
   - Yoksa: **Create Bucket** ile oluştur

### Adım 2: Bucket Settings

**Bucket Oluşturma:**
```
Name: item-images
Public Bucket: ✅ YES (önemli!)
File Size Limit: 50 MB (default)
```

**Mevcut Bucket'ı Public Yap:**
1. `item-images` bucket'ına tıkla
2. **Configuration** tab'ı
3. **Public Bucket** toggle'ı **ON** yap
4. Save

### Adım 3: RLS Policy (Row Level Security)

**Varsayılan Politika:**
```sql
-- Anyone can upload
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'item-images');

-- Anyone can read public files
CREATE POLICY "Public images are readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');

-- Users can update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Adım 4: Test Upload

**Manuel Test:**
1. Supabase Dashboard → Storage → item-images
2. **Upload** butonu
3. Bir test resmi yükle
4. Public URL'yi kopyala
5. Tarayıcıda aç
6. Resim görünüyor mu?

**✅ Evet:** Bucket çalışıyor
**❌ Hayır:** Bucket public değil

## 🔍 Xcode Console'da Bakılacak Loglar:

### Başarılı Upload:
```
[API] 📤 Starting image upload...
Data: {
  "fileName": "photo-123456.webp",
  "fileSize": "245.67 KB",
  "fileType": "image/webp",
  "userId": "user-123"
}

[API] ☁️ Uploading to Supabase Storage...

[API] ✅ Upload successful, getting public URL...

[API] ✅ Image uploaded successfully
Data: {
  "publicUrl": "https://xxx.supabase.co/storage/v1/object/...",
  "fullPath": "user-123/123456.webp"
}
```

### Başarısız Upload:
```
[API] 📤 Starting image upload...

[API] ☁️ Uploading to Supabase Storage...

[API] ❌ Supabase Storage upload error
Error: {
  "message": "Bucket not found",
  "statusCode": "404"
}
```

veya

```
[API] ❌ Supabase Storage upload error
Error: {
  "message": "new row violates row-level security policy",
  "statusCode": "403"
}
```

## 🛠️ Hızlı Çözüm Komutu:

### SQL Editor'de çalıştır:

```sql
-- 1. Bucket var mı kontrol et
SELECT * FROM storage.buckets WHERE id = 'item-images';

-- 2. Bucket yoksa oluştur
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true);

-- 3. RLS policy'leri ekle
CREATE POLICY "Anyone can upload to item-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Anyone can read item-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');

-- 4. Test: Bir dosya yükle ve public URL'yi test et
```

## 📊 Alternatif: Bucket Oluşturma (UI)

### Supabase Dashboard:

1. **Storage** → **New Bucket**
2. **Name:** `item-images`
3. **Public bucket:** ✅ **EVET**
4. **File size limit:** 50 MB
5. **Allowed MIME types:** (boş bırak - tüm tipler)
6. **Create bucket**

## 🎯 Test Sonrası:

### Console'da göreceğin:

**Bucket yoksa:**
```
[API] ❌ Supabase Storage upload error
Bucket not found: item-images
```

**Bucket private ise:**
```
[API] ❌ Supabase Storage upload error
new row violates row-level security policy
```

**RLS policy hatası:**
```
[API] ❌ Supabase Storage upload error
permission denied for storage.objects
```

**Başarılı:**
```
[API] ✅ Image uploaded successfully
publicUrl: https://xxx.supabase.co/storage/...
```

## 🚀 Sonraki Test:

1. ✅ Bucket'ı kontrol et/oluştur
2. ✅ Public yap
3. ✅ RLS policy ekle
4. ✅ Xcode'da tekrar test et
5. ✅ Console loglarını paylaş!

---

**Xcode Console'da ne görüyorsun?** 🔍
- "Bucket not found" mu?
- "Permission denied" mi?
- Başka bir hata mı?
