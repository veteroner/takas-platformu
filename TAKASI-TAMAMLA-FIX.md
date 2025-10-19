# 🔧 Takası Tamamla Butonu Hatası - FIX

## ❌ Problem
"Takası Tamamla" butonuna tıkladığınızda şu hata oluşuyor:
```
POST https://...supabase.co/rest/v1/rpc/complete_match 400 (Bad Request)

Error: new row for relation "notifications" violates check constraint "notifications_type_check"
```

## 🔍 Neden Oluyor?
Rating system'i eklerken `notifications` tablosuna yeni notification type'ları eklemeyi planladık:
- `'rating_required'` - Puanlama gerekli bildirimi
- `'match_completed'` - Takas tamamlandı bildirimi

Ancak `notifications` tablosunda `type` kolonu için bir **CHECK constraint** var ve bu constraint sadece eski type'lara izin veriyor:
- ❌ Eski: `'system', 'match', 'message', 'like', 'trade', 'warning', 'announcement'`
- ✅ Yeni: Yukarıdakiler + `'rating_required', 'match_completed'`

## ✅ Çözüm

### Adım 1: SQL Script'i Çalıştır
Supabase Dashboard'a git ve SQL Editor'da şu dosyayı çalıştır:
```
📁 supabase/fix-notification-types.sql
```

Bu script:
1. ❌ Eski constraint'i kaldırır
2. ✅ Yeni constraint'i ekler (rating type'larıyla)
3. 🧪 Test eder

### Adım 2: Kontrol Et
Script çalıştıktan sonra "Takası Tamamla" butonu çalışacak!

## 📝 SQL Script İçeriği
```sql
-- Eski constraint'i kaldır
ALTER TABLE public.notifications 
  DROP CONSTRAINT IF EXISTS notifications_type_check;

-- Yeni constraint'i ekle (rating type'larıyla)
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check 
  CHECK (type IN (
    'system', 'match', 'message', 'like', 
    'trade', 'warning', 'announcement',
    'rating_required',  -- 🆕 Rating System
    'match_completed'   -- 🆕 Rating System
  ));
```

## 🎯 Sonuç
Bu fix'ten sonra:
- ✅ "Takası Tamamla" butonu çalışacak
- ✅ Kullanıcılara "Puanlama gerekli" bildirimi gidecek
- ✅ Rating modal'ı otomatik açılacak
- ✅ Rating system tam çalışır hale gelecek

## 🚀 Hızlı Uygulama
1. Supabase Dashboard aç → SQL Editor
2. `fix-notification-types.sql` dosyasını kopyala-yapıştır
3. RUN düğmesine bas
4. ✅ "Notification type constraint güncellendi!" mesajını gör
5. Uygulamayı yeniden dene

---
**Not:** Bu sadece bir kez yapılması gereken bir database migration'dır. Bir kez çalıştırdıktan sonra kalıcı olarak düzelir.
