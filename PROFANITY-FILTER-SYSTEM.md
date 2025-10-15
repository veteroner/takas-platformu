# 🛡️ Küfür ve Hakaret Engelleme Sistemi

## 📋 Sistem Özeti

Takas platformunda kullanıcılar arası mesajlaşmada küfür, hakaret ve uygunsuz içeriği otomatik olarak engelleyen **çok katmanlı filtreleme sistemi**.

### ✅ Özellikler

- ✅ **Otomatik filtreleme** - Moderasyon gerektirmez
- ✅ **Türkçe odaklı** - 200+ küfür ve varyasyonu
- ✅ **Akıllı tespit** - Gizlenmiş küfür tespiti (a*k, a m k, etc.)
- ✅ **False positive önleme** - Whitelist sistemi
- ✅ **Kademeli ceza** - Adil ve caydırıcı
- ✅ **KVKK uyumlu** - 6 ay otomatik loglama
- ✅ **Real-time** - Anlık engelleme
- ✅ **Kullanıcı dostu** - Açık bilgilendirme

---

## 🎯 Ceza Sistemi

| İhlal Sayısı | Ceza | Süre | Açıklama |
|-------------|------|------|----------|
| 1-2 | ⚠️ Uyarı | - | Nazik uyarı mesajı |
| 3-5 | 🚫 Kısa Ban | 1 saat | Geçici engelleme |
| 6-10 | 🚫 Orta Ban | 24 saat | 1 günlük engelleme |
| 10+ | 🚫 Uzun Ban | 7 gün | Haftalık engelleme |
| Nefret Söylemi | ⛔ Kalıcı Ban | 365 gün | Ciddi ihlal |

---

## 🔧 Teknik Mimari

### 1. Filtreleme Katmanları

```
┌─────────────────────────────────────┐
│   Frontend (useMessageFilter)       │
│   ├── Anlık kontrol                 │
│   ├── Kullanıcı uyarısı             │
│   └── UI feedback                   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   API Route (/api/messages/filter)  │
│   ├── Profanity tespiti             │
│   ├── Ban kontrolü                  │
│   ├── Violation kaydı               │
│   └── Database logging              │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Supabase Database                 │
│   ├── user_violations               │
│   ├── filtered_messages             │
│   └── user_chat_bans                │
└─────────────────────────────────────┘
```

### 2. Veritabanı Şeması

#### `user_violations` - İhlal Kayıtları
```sql
CREATE TABLE user_violations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  violation_type TEXT, -- 'severe', 'moderate', 'hate'
  severity TEXT,       -- 'low', 'medium', 'high', 'critical'
  content TEXT,        -- Orijinal mesaj (şifreli)
  detected_words TEXT[], -- Tespit edilen kelimeler
  action_taken TEXT,   -- 'warning', 'ban', 'permanent_ban'
  ban_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  context JSONB        -- İlave bilgiler
);
```

#### `user_chat_bans` - Aktif Ban Durumu
```sql
CREATE TABLE user_chat_bans (
  user_id UUID PRIMARY KEY,
  banned_until TIMESTAMPTZ NOT NULL,
  ban_count INTEGER,
  total_violations INTEGER,
  reason TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### `filtered_messages` - Filtrelenen Mesaj Logları (KVKK)
```sql
CREATE TABLE filtered_messages (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  match_id UUID,
  original_content TEXT,    -- Şifreli
  detected_words TEXT[],
  severity TEXT,
  blocked BOOLEAN,
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ    -- 6 ay sonra otomatik silinir
);
```

---

## 📦 Dosya Yapısı

```
src/
├── lib/
│   ├── profanity-database.ts      # Küfür veritabanı ve seviyeler
│   ├── profanity-filter.ts        # Ana filtreleme motoru
│   └── profanity-types.ts         # TypeScript tipleri
├── hooks/
│   └── useMessageFilter.ts        # React hook
├── app/api/messages/
│   └── filter/
│       └── route.ts               # API endpoint
└── components/
    └── MessageFilterWarning.tsx   # UI bileşeni (isteğe bağlı)
```

---

## 🚀 Kullanım

### 1. Frontend - React Hook Kullanımı

```typescript
import { useMessageFilter } from '@/hooks/useMessageFilter'

function ChatComponent() {
  const { isMessageClean, getWarningMessage } = useMessageFilter()
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState<string | null>(null)

  const handleSend = async () => {
    // Önce frontend kontrolü
    if (!isMessageClean(message)) {
      const warningMsg = getWarningMessage(message, violationCount)
      setWarning(warningMsg)
      return
    }

    // API'ye gönder
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

    // Mesajı gönder
    await sendMessage(message)
  }

  return (
    <div>
      <textarea 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      {warning && <div className="text-red-500">{warning}</div>}
      <button onClick={handleSend}>Gönder</button>
    </div>
  )
}
```

### 2. API Endpoint Kullanımı

```typescript
// POST /api/messages/filter
const response = await fetch('/api/messages/filter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    message: "Mesaj içeriği",
    matchId: "uuid",
    receiverId: "uuid"
  })
})

const result = await response.json()
// result.allowed: boolean
// result.reason?: string
// result.bannedUntil?: Date
```

### 3. Ban Durumu Kontrolü

```typescript
// GET /api/messages/filter
const response = await fetch('/api/messages/filter', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

const status = await response.json()
// status.banned: boolean
// status.bannedUntil?: Date
// status.totalViolations?: number
```

---

## 🔐 Güvenlik ve KVKK Uyumu

### 1. Veri Saklama
- ✅ **Filtrelenen mesajlar**: 6 ay sonra otomatik silinir
- ✅ **İhlal kayıtları**: Hukuki süreçler için 2 yıl saklanır
- ✅ **Ban logları**: Şeffaflık için saklanır

### 2. Şifreleme
- Mesaj içerikleri veritabanında şifrelenir
- IP adresleri hash'lenir (isteğe bağlı)

### 3. Kullanıcı Hakları
- Kullanıcılar ihlal kayıtlarını görebilir (admin panel)
- İtiraz sistemi (gelecek özellik)
- Veri silme talebi hakkı

---

## 📊 Filtreleme Mantığı

### 1. Normalizasyon
```typescript
// Türkçe karakter dönüşümü
"küfür" → "kufur"
"şikayet" → "sikayet"

// Özel karakter temizleme
"a*k" → "ak"
"a.m.k" → "amk"
"a m k" → "amk"

// Tekrarlayan karakter
"aaaaammmmkkkk" → "amk"
```

### 2. Seviye Sistemi

**Seviye 1: Severe (Yüksek)**
- Açık küfür ve cinsel içerik
- Anında engelleme
- Violation kaydı

**Seviye 2: Moderate (Orta)**
- Hafif hakaret
- Uyarı mesajı
- Tekrarında ban

**Seviye 3: Hate (Kritik)**
- Nefret söylemi
- Tehdit, taciz
- Anında kalıcı ban

### 3. False Positive Önleme

```typescript
// Whitelist sistemi
"masalcı" ✅ (içinde "salak" geçse de izinli)
"Sikiş" ✅ (yer adı)
"malmö" ✅ (şehir adı)

// Kelime sınırı kontrolü
"normal" ✅ (içinde "mal" geçse de izinli)
```

---

## 🧪 Test Senaryoları

```typescript
// Test 1: Açık küfür
testFilter("amk") 
// ❌ Engellenir: severe, high

// Test 2: Gizlenmiş küfür
testFilter("a m k")
// ❌ Engellenir: severe, high

// Test 3: Hafif hakaret
testFilter("salak")
// ⚠️ Uyarı: moderate, medium

// Test 4: Temiz mesaj
testFilter("Merhaba, nasılsın?")
// ✅ İzinli: none

// Test 5: Whitelist
testFilter("Masalcı dükkanı")
// ✅ İzinli: whitelist
```

---

## ⚙️ Yapılandırma

### 1. Küfür Listesi Güncelleme

`src/lib/profanity-database.ts` dosyasında:

```typescript
export const profanityDatabase = {
  severe: [
    'yeni_küfür', // Ekle
    // ...
  ],
  whitelist: [
    'yeni_istisna', // Ekle
    // ...
  ]
}
```

### 2. Ceza Sürelerini Ayarlama

```typescript
export const violationLevels = {
  shortBan: {
    range: [3, 5],
    duration: 60 // Dakika (değiştirilebilir)
  },
  // ...
}
```

---

## 📈 Admin İstatistikleri (Gelecek Özellik)

```sql
-- En çok ihlal yapan kullanıcılar
SELECT user_id, COUNT(*) as violations
FROM user_violations
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY user_id
ORDER BY violations DESC
LIMIT 10;

-- En çok tespit edilen kelimeler
SELECT UNNEST(detected_words) as word, COUNT(*) as count
FROM user_violations
GROUP BY word
ORDER BY count DESC
LIMIT 20;

-- Günlük ihlal istatistikleri
SELECT DATE(created_at) as date, COUNT(*) as violations
FROM user_violations
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

---

## 🐛 Sorun Giderme

### Problem: False Positive (Yanlış Engelleme)

**Çözüm:** Whitelist'e ekleyin
```typescript
whitelist: ['kelime_buraya']
```

### Problem: Filtrelenmeyen Küfür

**Çözüm:** Küfür listesine ve varyasyonlarına ekleyin
```typescript
severe: ['yeni_küfür', 'varyasyon1', 'varyasyon2']
```

### Problem: Çok Sık Ban

**Çözüm:** Violation seviyelerini ayarlayın
```typescript
shortBan: {
  range: [5, 10], // 3,5 yerine 5,10
  duration: 30    // 60 dakika yerine 30
}
```

---

## 📝 Changelog

### Version 1.0 (15 Ekim 2025)
- ✅ İlk implementasyon
- ✅ Türkçe küfür veritabanı
- ✅ Otomatik ban sistemi
- ✅ KVKK uyumlu loglama
- ✅ API endpoint
- ✅ React hooks
- ✅ Veritabanı şeması

### Planlanan Özellikler
- 🔄 Admin moderasyon paneli
- 🔄 Kullanıcı itiraz sistemi
- 🔄 AI-powered sentiment analysis
- 🔄 Çoklu dil desteği
- 🔄 İstatistik dashboard

---

## 📞 Destek

Sorularınız için:
- **Email:** kvkk@teknovagroup.com
- **GitHub Issues:** (Repository link)

---

## 📜 Lisans

Bu sistem Takas Platform'un bir parçasıdır.
© 2025 Teknova Tarım Hayvancılık Bilişim Reklam Limited Şirketi
