# 🧪 Küfür Filtreleme Sistemi - Test Rehberi

## ✅ Sistem Kurulumu Tamamlandı!

### Yapılan İşlemler:
1. ✅ Veritabanı şeması oluşturuldu (Supabase SQL Editor)
2. ✅ Environment variables hazır (SUPABASE_SERVICE_ROLE_KEY)
3. ✅ Chat component'e filtreleme entegre edildi
4. ✅ API endpoint aktif (`/api/messages/filter`)

---

## 🚀 Test Adımları

### 1️⃣ Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcıda açın: http://localhost:3000

### 2️⃣ Giriş Yapın

1. Platformda iki farklı kullanıcı oluşturun (veya mevcut hesapları kullanın)
2. İki kullanıcı arasında bir match oluşturun
3. Chat sayfasına gidin

### 3️⃣ Test Mesajları Gönderin

#### ✅ Test 1: Temiz Mesaj (İzin Verilmeli)
```
Merhaba, nasılsın?
```
**Beklenen:** Mesaj başarıyla gönderilir ✅

#### ❌ Test 2: Açık Küfür (Engellenmeli)
```
amk ne yapıyorsun
```
**Beklenen:** 
- Mesaj GÖNDERİLMEZ ❌
- Kırmızı uyarı kutusu görünür
- "💬 Mesajınız uygunsuz içerik nedeniyle gönderilemedi..."

#### ❌ Test 3: Gizlenmiş Küfür (Engellenmeli)
```
a m k
```
**Beklenen:** Yine engellenir ❌

#### ❌ Test 4: Tekrarlayan Karakter Küfürü
```
aaaammmkkkk
```
**Beklenen:** Engellenir ❌

#### ⚠️ Test 5: Hafif Hakaret (Uyarı)
```
çok salak bir şey
```
**Beklenen:** 
- İlk 1-2 kez uyarı verir
- 3. kez 1 saatlik ban

#### ✅ Test 6: False Positive Kontrolü (İzin Verilmeli)
```
Masalcı dükkanından aldım
```
**Beklenen:** "salak" kelimesi geçse de whitelist nedeniyle izin verilir ✅

---

## 🔴 Ban Testi

### Test 7: Kademeli Ban Sistemi

1. **1. İhlal:** Küfür mesajı gönder → ⚠️ Uyarı
2. **2. İhlal:** Tekrar küfür → ⚠️ Uyarı (daha sert)
3. **3. İhlal:** Tekrar küfür → 🚫 1 SAAT BAN
   - Sayfanın üstünde kırmızı ban banner'ı görünür
   - Mesaj input'u devre dışı kalır
   - "Kalan süre: X dakika" gösterir

4. **Ban Durumu Kontrolü:**
```bash
# Browser console'da
fetch('/api/messages/filter', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
}).then(r => r.json()).then(console.log)

# Çıktı:
# { banned: true, bannedUntil: "2025-10-15T...", totalViolations: 3 }
```

---

## 📊 Admin Kontrolleri

### Veritabanı İstatistikleri (Supabase SQL Editor)

```sql
-- 1. Bugünkü ihlaller
SELECT COUNT(*) FROM user_violations 
WHERE DATE(created_at) = CURRENT_DATE;

-- 2. En çok tespit edilen kelimeler
SELECT UNNEST(detected_words) as word, COUNT(*) as count
FROM user_violations
GROUP BY word
ORDER BY count DESC
LIMIT 10;

-- 3. Aktif banlı kullanıcılar
SELECT * FROM user_chat_bans
WHERE banned_until > NOW();

-- 4. Son 10 ihlal
SELECT 
  uv.*,
  u.name,
  u.email
FROM user_violations uv
JOIN users u ON uv.user_id = u.id
ORDER BY uv.created_at DESC
LIMIT 10;
```

---

## 🐛 Sorun Giderme

### Problem 1: "Cannot find module 'profanity-filter'"

**Çözüm:**
```bash
# Sunucuyu yeniden başlatın
npm run dev
```

### Problem 2: API 401 Unauthorized

**Çözüm:**
- `.env.local` dosyasında `SUPABASE_SERVICE_ROLE_KEY` olduğundan emin olun
- Supabase Dashboard > Settings > API > Service Role Key'i kopyalayın

### Problem 3: Mesaj engellenmeden geçiyor

**Çözüm 1:** Browser console'u açın ve hataları kontrol edin
```bash
# Browser console'da
localStorage.clear()
# Sayfayı yenileyin
```

**Çözüm 2:** Supabase functions'ları kontrol edin
```sql
-- record_violation fonksiyonu var mı?
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%violation%';
```

### Problem 4: Ban süresi doldu ama hala banlı

**Çözüm:**
```sql
-- Expired banları temizle
DELETE FROM user_chat_bans
WHERE banned_until < NOW();
```

---

## ✅ Başarılı Test Çıktısı

Eğer şunları görüyorsanız sistem çalışıyor:

1. ✅ Temiz mesajlar gönderiliyor
2. ❌ Küfürlü mesajlar engelleniyor
3. ⚠️ Uyarı mesajları görünüyor
4. 🚫 3. ihlalden sonra ban aktif oluyor
5. ⏰ Ban süresi geri sayımı çalışıyor
6. 📊 Veritabanında kayıtlar oluşuyor

---

## 📸 Beklenen Görünüm

### Başarılı Mesaj:
```
✅ [Mesaj balonu görünür]
```

### Engellenen Mesaj:
```
❌ [Kırmızı uyarı kutusu]
💬 Mesajınız uygunsuz içerik nedeniyle gönderilemedi. 
   Lütfen saygılı bir dil kullanın.
[X] (Kapat butonu)
```

### Ban Durumu:
```
🔴 [Sayfanın üstünde kırmızı banner]
🚫 Mesaj gönderme yetkiniz askıya alındı
Tekrarlanan ihlaller nedeniyle geçici olarak mesaj gönderemezsiniz.
Kalan süre: 45 dakika

İhlal Sayısı: 3
```

---

## 🎉 Sonraki Adımlar

Test başarılıysa:

1. ✅ **Prodüksiyon:** Deploy edin
2. ✅ **Monitoring:** İstatistikleri düzenli takip edin
3. ✅ **İyileştirme:** Küfür listesini genişletin
4. ✅ **Optimizasyon:** False positive'leri whitelist'e ekleyin

---

## 📞 Destek

Sorun yaşarsanız:
- 📖 `PROFANITY-FILTER-SYSTEM.md` - Detaylı dokümantasyon
- 🚀 `PROFANITY-FILTER-INTEGRATION.md` - Entegrasyon rehberi
- 💾 `supabase/schema.sql` - Veritabanı şeması

**Sistem hazır! Test etmeye başlayabilirsiniz! 🚀**
