# 🚀 TakasYap - Supabase Tam Kurulum Rehberi

Bu rehber, TakasYap platformunun veritabanını sıfırdan kurmak için gerekli tüm adımları içerir.

## 📋 İçindekiler
1. [Önkoşullar](#önkoşullar)
2. [Kurulum Adımları](#kurulum-adımları)
3. [Doğrulama](#doğrulama)
4. [Test](#test)
5. [Sorun Giderme](#sorun-giderme)

---

## ✅ Önkoşullar

- ✅ Supabase hesabı (https://supabase.com)
- ✅ Proje oluşturulmuş olmalı
- ✅ Supabase URL ve ANON_KEY `.env.local`'de olmalı

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🔧 Kurulum Adımları

### **ADIM 1: Supabase Dashboard'a Git**

1. https://supabase.com/dashboard adresine git
2. Projenizi seçin
3. Sol menüden **"SQL Editor"** seçin

---

### **ADIM 2: Ana Şemayı Çalıştır**

1. **"New Query"** butonuna tıkla
2. `/supabase/schema.sql` dosyasının içeriğini kopyala
3. SQL Editor'e yapıştır
4. **"RUN"** butonuna tıkla ▶️
5. ✅ Başarı mesajı: `Success. No rows returned`

**Bu adım şunları oluşturur:**
- ✅ Users, Items, Matches, Messages tabloları
- ✅ RLS (Row Level Security) politikaları
- ✅ Trigger'lar (otomatik match oluşturma)
- ✅ Temel fonksiyonlar
- ✅ Engelleme ve şikayet sistemi
- ✅ Küfür filtresi
- ✅ Yasadışı ürün filtresi

---

### **ADIM 3: Eksik Tabloları Ekle**

1. **"New Query"** butonuna tıkla
2. `/supabase/complete-schema.sql` dosyasını kopyala
3. SQL Editor'e yapıştır
4. **"RUN"** butonuna tıkla ▶️

**Bu adım şunları ekler:**
- ✅ `notifications` tablosu (BİLDİRİMLER)
- ✅ `admin_users` tablosu (ADMİN YETKİLERİ)
- ✅ `fcm_tokens` tablosu (PUSH NOTİFİCATİON)
- ✅ `user_activity_log` tablosu (AKTİVİTE TAKİBİ)
- ✅ Bildirim trigger'ları (otomatik bildirim)
- ✅ Admin fonksiyonları
- ✅ Platform istatistik fonksiyonları
- ✅ App settings default değerleri

---

### **ADIM 4: Şikayet İstatistik Fonksiyonunu Düzelt**

1. **"New Query"** butonuna tıkla
2. `/supabase/fix-statistics-simple.sql` dosyasını kopyala
3. SQL Editor'e yapıştır
4. **"RUN"** butonuna tıkla ▶️

**Bu adım:**
- ✅ `get_report_statistics` fonksiyonunu düzeltir
- ✅ "aggregate function calls cannot be nested" hatasını çözer

---

### **ADIM 5: Admin Kullanıcı Oluştur**

1. İlk olarak bir kullanıcı oluştur (eğer yoksa):
   - Uygulamaya git → Sign Up yap
   - Veya Supabase Dashboard → Authentication → Users → Add User

2. Kullanıcı ID'sini al:
   - Authentication → Users → Kullanıcıya tıkla
   - UID'yi kopyala

3. SQL Editor'de çalıştır:

```sql
-- BURAYA KENDİ USER ID'NİZİ YAZIN!
SELECT public.make_user_admin('YOUR-USER-ID-HERE', 'super_admin');
```

✅ Artık admin paneline erişebilirsiniz!

---

## ✅ Doğrulama

### **1. Tabloları Kontrol Et**

SQL Editor'de çalıştır:

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Olması gerekenler:**
```
admin_users
app_settings
consents
fcm_tokens
filtered_messages
illegal_product_attempts
items
matches
messages
notification_prefs
notifications          ← ÖNEMLİ!
seeking_preferences
swipes
user_activity_log
user_blocks
user_chat_bans
user_reports
user_violations
users
```

### **2. Fonksiyonları Kontrol Et**

```sql
-- Tüm fonksiyonları listele
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

**Önemli fonksiyonlar:**
- ✅ `create_notification`
- ✅ `get_report_statistics`
- ✅ `get_platform_stats`
- ✅ `is_admin`
- ✅ `make_user_admin`

### **3. RLS Politikalarını Kontrol Et**

```sql
-- notifications tablosu politikaları
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename = 'notifications';
```

Sonuç:
```
Users can view own notifications
Users can update own notifications
System can create notifications
```

---

## 🧪 Test

### **Test 1: Bildirim Oluştur**

```sql
-- Bir test bildirimi oluştur
SELECT public.create_notification(
  'YOUR-USER-ID-HERE',
  '🎉 Hoş Geldiniz!',
  'TakasYap platformuna hoş geldiniz. İlk eşyalarınızı ekleyin!',
  'system',
  '{"welcome": true}'::jsonb
);
```

### **Test 2: Platform İstatistikleri**

```sql
SELECT * FROM public.get_platform_stats();
```

### **Test 3: Admin Kontrolü**

```sql
SELECT public.is_admin('YOUR-USER-ID-HERE');
-- Sonuç: true
```

### **Test 4: Okunmamış Bildirimler**

```sql
SELECT public.get_unread_notification_count('YOUR-USER-ID-HERE');
```

---

## 🎯 Admin Panel Kullanımı

### **1. Admin Panele Eriş**

```
https://takasyap.netlify.app/admin
```

### **2. Bildirim Gönder**

1. Admin Panel → **Ayarlar** sekmesi
2. **Bildirimler** tab'ine geç
3. Hedef seç:
   - **Tüm Kullanıcılar**
   - **Aktif Kullanıcılar** (son 7 gün)
   - **Belirli Kullanıcı** (ID ile)
4. Başlık ve mesaj yaz
5. **Gönder** butonuna tıkla

**Örnek Bildirim:**
```
Hedef: Aktif Kullanıcılar
Başlık: 🎉 Yeni Özellik!
Mesaj: Artık video yükleyebilirsiniz! Hemen deneyin.
```

---

## ❌ Sorun Giderme

### **Hata: "Could not find the table 'public.notifications'"**

**Çözüm:**
```sql
-- notifications tablosunu manuel oluştur
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'match', 'message', 'like', 'trade', 'warning', 'announcement')),
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  sent_push BOOLEAN DEFAULT FALSE,
  push_sent_at TIMESTAMPTZ,
  push_error TEXT
);

-- RLS aktif et
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politikaları ekle
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);
```

### **Hata: "aggregate function calls cannot be nested"**

**Çözüm:**
- `/supabase/fix-statistics-simple.sql` dosyasını çalıştırın
- Reports sayfası düzelecektir

### **Hata: "permission denied for table users"**

**Çözüm:**
- RLS politikalarını kontrol edin
- Service role key kullanıyorsanız doğru mu kontrol edin

### **Admin Panele Erişemiyorum**

**Çözüm:**
```sql
-- Admin yapılmadıysa:
SELECT public.make_user_admin('YOUR-USER-ID', 'super_admin');

-- Kontrol et:
SELECT * FROM public.admin_users WHERE user_id = 'YOUR-USER-ID';
```

---

## 📊 Varsayılan Ayarlar

`app_settings` tablosunda şu değerler varsayılan olarak gelir:

```sql
SELECT * FROM public.app_settings;
```

| Key | Value |
|-----|-------|
| app_name | TakasYap |
| support_email | support@takasyap.com |
| min_ios_version | 1.0.0 |
| min_android_version | 1.0.0 |
| push_enabled | true |
| maintenance_mode | false |
| rate_limit_per_minute | 100 |
| max_items_per_user | 50 |

---

## 🔄 Günlük Bakım

### **Eski Verileri Temizle**

```sql
-- Tüm eski verileri temizle (30+ gün eski bildirimler, vb.)
SELECT * FROM public.cleanup_old_data();
```

**Supabase Edge Function ile otomatikleştirin:**
```typescript
// Her gece 03:00'te çalışacak
Deno.cron("cleanup", "0 3 * * *", async () => {
  await supabase.rpc('cleanup_old_data')
})
```

---

## 🎉 Tamamlandı!

Artık TakasYap platformunuz tamamen hazır! 🚀

**Özellikler:**
- ✅ Kullanıcı yönetimi
- ✅ Eşya listelemeleri
- ✅ Swipe ve eşleşme sistemi
- ✅ Mesajlaşma
- ✅ Bildirimler (in-app)
- ✅ Admin paneli
- ✅ Şikayet sistemi
- ✅ Engelleme sistemi
- ✅ Küfür filtresi
- ✅ Yasadışı ürün filtresi
- ✅ KVKK/GDPR uyumlu

**Sırada:**
- 🔄 FCM/APNs entegrasyonu (gerçek push notification)
- 🔄 Email bildirimleri
- 🔄 SMS doğrulama
- 🔄 Ödeme entegrasyonu

---

## 📞 Destek

Sorun yaşarsanız:
1. Bu dokümanı tekrar okuyun
2. SQL hatalarını kontrol edin
3. Supabase Dashboard → Logs kısmına bakın
4. GitHub Issues açın

---

**Hazırlayan:** TakasYap Development Team  
**Son Güncelleme:** 18 Ekim 2025  
**Versiyon:** 1.0.0
