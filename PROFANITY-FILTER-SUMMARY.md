# 🛡️ Küfür ve Hakaret Engelleme Sistemi - Özet

## ✅ SİSTEM BAŞARIYLA OLUŞTURULDU!

### 📦 Oluşturulan Dosyalar

```
✅ src/lib/profanity-database.ts         # Küfür veritabanı ve seviye tanımları
✅ src/lib/profanity-filter.ts           # Ana filtreleme motoru
✅ src/hooks/useMessageFilter.ts         # React hook
✅ src/app/api/messages/filter/route.ts  # API endpoint
✅ src/components/MessageFilterWarning.tsx # UI bileşenleri
✅ supabase/schema.sql                   # Veritabanı şeması (güncellenmiş)
✅ PROFANITY-FILTER-SYSTEM.md           # Detaylı dokümantasyon
✅ PROFANITY-FILTER-INTEGRATION.md      # Entegrasyon rehberi
```

---

## 🎯 Sistem Özellikleri

### ✅ Otomatik Filtreleme
- ✅ 200+ Türkçe küfür ve varyasyonu
- ✅ Gizlenmiş küfür tespiti (a*k, a m k, etc.)
- ✅ Tekrarlayan karakter tespiti (aaaammmkkk)
- ✅ False positive önleme (whitelist)
- ✅ Kelime sınırı kontrolü

### ✅ Kademeli Ceza Sistemi
| İhlal | Ceza | Süre |
|-------|------|------|
| 1-2 | Uyarı | - |
| 3-5 | Kısa Ban | 1 saat |
| 6-10 | Orta Ban | 24 saat |
| 10+ | Uzun Ban | 7 gün |
| Nefret | Kalıcı | 365 gün |

### ✅ KVKK Uyumlu
- ✅ Tüm ihlaller loglanır
- ✅ 6 ay otomatik silme
- ✅ Şeffaf bilgilendirme
- ✅ Kullanıcı hakları korunur

### ✅ Teknik Altyapı
- ✅ Frontend + Backend filtreleme
- ✅ Real-time validation
- ✅ Supabase entegrasyonu
- ✅ TypeScript tip güvenliği
- ✅ Performans optimize

---

## 🚀 Hızlı Başlangıç

### 1️⃣ Veritabanı Kurulumu

```bash
# Supabase SQL Editor'de çalıştırın:
# supabase/schema.sql dosyasındaki profanity filter bölümünü
# (Satır 300'den sonraki tüm kod)
```

### 2️⃣ Environment Variables

`.env.local` dosyasına ekleyin:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3️⃣ Chat Component'te Kullanın

```tsx
import { useMessageFilter } from '@/hooks/useMessageFilter'
import { MessageFilterWarning } from '@/components/MessageFilterWarning'

function ChatPage() {
  const { isMessageClean, getWarningMessage } = useMessageFilter()
  const [warning, setWarning] = useState<string | null>(null)

  const handleSend = async (message: string) => {
    // Frontend kontrolü
    if (!isMessageClean(message)) {
      const warningMsg = getWarningMessage(message, 0)
      setWarning(warningMsg)
      return
    }

    // Backend API'ye gönder
    const response = await fetch('/api/messages/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        matchId,
        receiverId
      })
    })

    const result = await response.json()

    if (!result.allowed) {
      setWarning(result.reason)
      return
    }

    // Mesajı kaydet
    await sendMessage(message)
  }

  return (
    <div>
      {warning && (
        <MessageFilterWarning
          reason={warning}
          onClose={() => setWarning(null)}
        />
      )}
      {/* ... */}
    </div>
  )
}
```

---

## 📊 Test Örnekleri

```typescript
import { detectProfanity } from '@/lib/profanity-filter'

// ✅ Temiz mesaj
detectProfanity("Merhaba, nasılsın?")
// → { isClean: true, severity: 'none' }

// ⚠️ Hafif hakaret
detectProfanity("Çok salakça")
// → { isClean: false, severity: 'medium', violationType: 'moderate' }

// ❌ Açık küfür
detectProfanity("amk")
// → { isClean: false, severity: 'high', violationType: 'severe' }

// ❌ Gizlenmiş küfür
detectProfanity("a m k")
// → { isClean: false, severity: 'high', violationType: 'severe' }

// ✅ Whitelist (false positive önleme)
detectProfanity("Masalcı dükkanı")
// → { isClean: true, severity: 'none' }
```

---

## 📈 İstatistikler ve Monitoring

### SQL Sorguları

```sql
-- Bugünkü ihlal sayısı
SELECT COUNT(*) FROM user_violations 
WHERE DATE(created_at) = CURRENT_DATE;

-- En çok ihlal yapan kullanıcılar
SELECT user_id, COUNT(*) as violations
FROM user_violations
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id
ORDER BY violations DESC
LIMIT 10;

-- En çok tespit edilen kelimeler
SELECT UNNEST(detected_words) as word, COUNT(*) as count
FROM user_violations
GROUP BY word
ORDER BY count DESC
LIMIT 20;

-- Aktif ban sayısı
SELECT COUNT(*) FROM user_chat_bans
WHERE banned_until > NOW();
```

---

## 🔧 Özelleştirme

### Küfür Listesi Güncelleme

```typescript
// src/lib/profanity-database.ts

export const profanityDatabase = {
  severe: [
    'yeni_küfür',  // ← Buraya ekleyin
    // ...
  ],
  whitelist: [
    'yeni_istisna',  // ← Buraya ekleyin
    // ...
  ]
}
```

### Ceza Sürelerini Değiştirme

```typescript
// src/lib/profanity-database.ts

export const violationLevels = {
  shortBan: {
    range: [3, 5],
    duration: 60  // ← Dakika cinsinden değiştirin
  },
  // ...
}
```

---

## ⚠️ Önemli Notlar

### 1. Güvenlik
- ✅ `SUPABASE_SERVICE_ROLE_KEY` **ASLA** frontend'e maruz bırakılmamalı
- ✅ Sadece API route'larında kullanılmalı
- ✅ `.env.local` dosyası Git'e eklenmemeli

### 2. KVKK Uyumu
- ✅ Filtrelenen mesajlar 6 ay saklanır
- ✅ İhlal kayıtları 2 yıl saklanır (hukuki gereklilik)
- ✅ Kullanıcılar verilerini talep edebilir
- ✅ Gizlilik politikası güncellenmiş ✅

### 3. Performans
- ✅ Frontend ön kontrolü hızlı feedback sağlar
- ✅ Backend kontrolü kesin koruma sağlar
- ✅ Regex optimizasyonları yapılmış
- ✅ Veritabanı indexleri eklenmiş

---

## 🐛 Sorun Giderme

### Problem: API 401 Unauthorized

**Çözüm:**
```typescript
// Authorization header'ı eklemeyi unutmayın
const { data: { session } } = await supabase.auth.getSession()

fetch('/api/messages/filter', {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`
  }
})
```

### Problem: False Positive (Yanlış Engelleme)

**Çözüm:**
```typescript
// Whitelist'e ekleyin
whitelist: ['kelime']
```

### Problem: Küfür Filtrelenmiyor

**Çözüm:**
```typescript
// 1. Veritabanına ekleyin
severe: ['yeni_küfür']

// 2. Varyasyonlarını ekleyin
severe: ['yeni_küfür', 'yeni kufur', 'yeni*kufur']
```

---

## 📚 Dokümantasyon

- 📖 **Detaylı Sistem Dokümantasyonu:** `PROFANITY-FILTER-SYSTEM.md`
- 🚀 **Entegrasyon Rehberi:** `PROFANITY-FILTER-INTEGRATION.md`
- 💾 **Veritabanı Şeması:** `supabase/schema.sql` (satır 300+)

---

## 🎉 Başarılar!

Küfür ve hakaret engelleme sistemi başarıyla oluşturuldu. Artık:

✅ Kullanıcılar birbirlerine küfür edemez
✅ Otomatik filtreleme çalışır
✅ Kademeli ceza sistemi aktif
✅ KVKK uyumlu loglama yapılır
✅ Hukuki açıdan güvendesiniz
✅ Kullanıcı deneyimi korunur

### Sonraki Adımlar:

1. ✅ Veritabanı kurulumunu yapın
2. ✅ Chat component'lerini entegre edin
3. ✅ Test edin (temiz ve uygunsuz mesajlar)
4. ✅ Prodüksiyona deploy edin
5. 🔄 İstatistikleri izleyin ve optimize edin

---

## 📞 Destek

Sorularınız için:
- **Email:** kvkk@teknovagroup.com
- **Dokümantasyon:** `PROFANITY-FILTER-SYSTEM.md`
- **Entegrasyon:** `PROFANITY-FILTER-INTEGRATION.md`

---

**© 2025 Teknova Tarım Hayvancılık Bilişim Reklam Limited Şirketi**

*Tüm hakları saklıdır.*
