# 🚨 SUPABASE KURULUM GEREKLİ!

## ⚠️ ÖNEMLİ: Aşağıdaki SQL dosyalarını Supabase'de çalıştırmalısınız!

### 📋 Adım Adım Kurulum:

#### 1️⃣ **Supabase Dashboard'a Git**
```
https://supabase.com/dashboard
→ Projenizi seçin
→ SQL Editor'ı açın
```

#### 2️⃣ **SQL Dosyalarını Sırayla Çalıştır**

**DOSYA 1: User Metadata (Bio/Location/Phone)**
```bash
📁 supabase/add-user-metadata.sql
```
- `users` tablosuna `metadata` JSONB kolonu ekler
- Bio, lokasyon, telefon bilgilerini saklar
- GIN index ile hızlı sorgular

**DOSYA 2: User Swipes (Beğenilen/Geçilen Ürünler)** ⭐ **ÇOK ÖNEMLİ!**
```bash
📁 supabase/create-user-swipes.sql
```
- `user_swipes` tablosu oluşturur
- Beğenilen/geçilen ürünleri kalıcı saklar
- RLS policies ile güvenlik sağlar

#### 3️⃣ **Nasıl Çalıştırılır?**

1. **Dosyayı aç:** VS Code'da SQL dosyasını aç
2. **İçeriği kopyala:** Tüm SQL kodunu kopyala (Cmd+A, Cmd+C)
3. **Supabase'e yapıştır:** SQL Editor'da "New query" → Yapıştır
4. **Çalıştır:** "Run" butonuna tıkla
5. **Sonucu kontrol et:** `✅ ... başarıyla oluşturuldu!` mesajını gör

#### 4️⃣ **Hata Alırsanız**

**Hata: "relation already exists"**
```
✅ SORUN YOK! Tablo zaten var.
```

**Hata: "permission denied"**
```
❌ Service role key kullanın
→ Project Settings → API → service_role key
→ SQL Editor'da connection string'i güncelle
```

**Hata: "function does not exist"**
```
❌ Önce tabloyu oluşturun, sonra fonksiyonları
→ CREATE TABLE kısımlarını önce çalıştırın
```

### 🎯 Kurulum Tamamlandı mı Kontrol Et:

**Test Query 1: user_swipes tablosu var mı?**
```sql
SELECT * FROM user_swipes LIMIT 1;
```
✅ Başarılı → Tablo hazır!
❌ Hata → create-user-swipes.sql çalıştır

**Test Query 2: metadata kolonu var mı?**
```sql
SELECT metadata FROM users LIMIT 1;
```
✅ Başarılı → Metadata hazır!
❌ Hata → add-user-metadata.sql çalıştır

### 📊 Özellikler Çalışıyor mu?

✅ **Beğenilen ürünler kalıcı:** Sayfa yenilenince kaybolmuyor
✅ **Beğenilen grid:** "Beğenilen" sayacına tıkla → Grid açılır
✅ **Profile bilgileri:** Bio/Location/Phone kaydediliyor
✅ **Duplicate swipe engellendi:** Aynı ürüne 2 kez swipe yapılamaz

### 🚀 Sonraki Adımlar:

1. **Tabloları oluştur** (yukarıdaki adımlar)
2. **Uygulamayı yenile** (Cmd+R veya F5)
3. **Test et:**
   - Ürün beğen → Sayfa yenile → Beğenilen grid'de görün
   - Profile → Bio yaz → Kaydet → Sayfa yenile → Bio kalsın

### ❓ Yardım:

Sorun yaşıyorsanız:
1. Browser console'u aç (F12)
2. Hata mesajlarını kontrol et
3. `user_swipes table not found` görüyorsan → SQL dosyasını çalıştır
4. `409 Conflict` görüyorsan → Duplicate swipe (şimdi düzeltildi)

---

**Son Güncelleme:** 19 Ekim 2025
**Gerekli SQL Dosyaları:** 
- ✅ `supabase/add-user-metadata.sql`
- ⭐ `supabase/create-user-swipes.sql` (MUTLaka çalıştır!)
