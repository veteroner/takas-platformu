# 🛡️ Yasadışı Ürün Filtreleme Sistemi

## 📋 Genel Bakış

Bu sistem, kullanıcıların platformda yasadışı ürün yüklemeye çalışmalarını otomatik olarak engeller. Türk Ceza Kanunu ve ilgili mevzuata uygun olarak tasarlanmıştır.

## 🎯 Özellikler

### ✅ Filtrelenen İçerik Kategorileri

1. **🚫 Uyuşturucu ve Madde Bağımlılığı**
   - Esrar, kokain, eroin, bonzai, ecstasy vb.
   - Bağımlılık yapıcı kimyasallar (tiner, tutkal)
   - Argo terimler ve varyasyonlar

2. **🔫 Silah, Patlayıcı, Tehlikeli Maddeler**
   - Ateşli silahlar (tabanca, tüfek, otomatik silah)
   - Kesici aletler (kama, kasatura, süngü)
   - Patlayıcılar (bomba, el bombası, molotof)
   - Tehlikeli kimyasallar (asit, zehir, siyanür)
   - Elektroşok ve saldırı aletleri

3. **🎭 Sahte/Korsan Ürünler**
   - Sahte marka ürünleri
   - Replika ve taklit ürünler
   - Korsan yazılım ve içerik

4. **🔞 Cinsel İçerik**
   - Cinsel ürünler
   - Pornografik içerik
   - Escort ve fuhuş hizmetleri

5. **🐾 Canlı Hayvan Ticareti**
   - Evcil hayvan satışı
   - Tehlikeli hayvanlar
   - Yasadışı hayvan ticareti

6. **💊 Reçeteli İlaçlar**
   - Antibiyotikler
   - Ağrı kesiciler (tramadol, kodein)
   - Psikiyatrik ilaçlar (xanax, prozac)
   - Uyku ilaçları
   - Anabolik steroidler

7. **🎰 Kumar ve Bahis**
   - Kumar oyunları
   - Bahis sistemleri
   - Casino ekipmanları

8. **🚬 Tütün ve Alkol**
   - Sigara ve tütün ürünleri
   - Elektronik sigara (vape)
   - Alkollü içecekler

9. **⚠️ Hırsızlık/Dolandırıcılık Riski**
   - Çalıntı ürünler
   - Faturasız/belgesiz ürünler
   - Kilitli telefonlar (iCloud locked)

10. **🚨 Diğer Yasadışı İçerik**
    - Piramit şemaları
    - Sahte kimlik belgeleri
    - Hacking araçları
    - Organ satışı

## 🏗️ Teknik Mimari

### Dosya Yapısı

```
src/
├── lib/
│   └── illegal-product-filter.ts    # Core filtreleme motoru (500+ kelime)
├── hooks/
│   └── useProductFilter.ts          # React hooks
├── components/
│   └── ProductFilterWarning.tsx     # UI uyarı komponentleri
└── app/
    ├── upload/
    │   └── page.tsx                 # Entegre edilmiş upload sayfası
    └── api/
        └── products/
            └── filter/
                └── route.ts         # Backend API endpoint
```

### Veritabanı Şeması

```sql
-- Yasadışı ürün girişim logları
CREATE TABLE public.illegal_product_attempts (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  detected_words JSONB NOT NULL,
  categories TEXT[] NOT NULL,
  risk_level TEXT NOT NULL, -- low, medium, high, critical
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL -- 1 yıl sonra otomatik silinir
);
```

## 🚀 Kullanım

### Frontend - Upload Sayfası

```tsx
import { useProductFilter } from '@/hooks/useProductFilter'
import { ProductFilterWarning } from '@/components/ProductFilterWarning'

function UploadPage() {
  const { checkProduct, lastResult } = useProductFilter()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Ürünü kontrol et
    const result = checkProduct(title, description)
    
    if (result.shouldBlock) {
      // Engelle!
      alert(result.message)
      return
    }
    
    // Upload işlemine devam et...
  }
  
  return (
    <>
      {lastResult && !lastResult.isClean && (
        <ProductFilterWarning result={lastResult} />
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Form alanları */}
      </form>
    </>
  )
}
```

### Backend API

```typescript
// POST /api/products/filter
const response = await fetch('/api/products/filter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Ürün başlığı',
    description: 'Ürün açıklaması',
    userId: 'user-123'
  })
})

const result = await response.json()
// {
//   allowed: false,
//   shouldBlock: true,
//   riskLevel: 'critical',
//   message: '🚫 Uyuşturucu ve bağımlılık yapıcı madde satışı yasaktır.',
//   categories: ['drugs'],
//   detectedWords: [...]
// }
```

## 📊 Risk Seviyeleri

| Seviye | Kategoriler | Aksiyon |
|--------|-------------|---------|
| **Critical** 🔴 | Uyuşturucu, Silah | Anında engelle + Log + Yasal uyarı |
| **High** 🟠 | Reçeteli ilaç, Hırsızlık, Canlı hayvan | Engelle + Log |
| **Medium** 🟡 | Tütün, Alkol, Kumar | Engelle + Uyarı |
| **Low** 🟢 | Sahte ürün | Uyarı + Gözden geçirme |

## 🔐 Güvenlik ve Uyumluluk

### KVKK Uyumluluğu

- ✅ **Veri Saklama:** Loglar 1 yıl sonra otomatik silinir
- ✅ **Anonimleştirme:** Sadece user_id saklanır (kişisel veri yok)
- ✅ **Şeffaflık:** Kullanıcıya net uyarı mesajları gösterilir
- ✅ **Veri Minimizasyonu:** Sadece gerekli bilgiler loglanır

### Yasal Uyumluluk

- ✅ **TCK (Türk Ceza Kanunu)** uyumlu
- ✅ **6136 Sayılı Ateşli Silahlar Kanunu** uyumlu
- ✅ **2313 Sayılı Uyuşturucu Maddelerin Murakabesi Hakkında Kanun** uyumlu
- ✅ **5237 Sayılı TCK Madde 191** (Cinsel istismar) uyumlu

### Row Level Security (RLS)

```sql
-- Sadece admin görebilir
CREATE POLICY "Admin can view illegal attempts"
  ON public.illegal_product_attempts
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sistem insert edebilir
CREATE POLICY "System can insert illegal attempts"
  ON public.illegal_product_attempts
  FOR INSERT
  WITH CHECK (true);
```

## 📈 İstatistikler ve Monitoring

### Admin Dashboard Sorgusu

```sql
-- Son 30 günün istatistiklerini getir
SELECT * FROM public.get_illegal_product_stats(30);

-- Sonuç:
-- {
--   total_attempts: 156,
--   critical_attempts: 23,
--   high_risk_attempts: 45,
--   unique_users: 89,
--   top_categories: ['drugs', 'weapons', 'prescription'],
--   attempts_by_day: {...}
-- }
```

### Otomatik Temizleme

```sql
-- Manuel çalıştırma
SELECT public.cleanup_expired_illegal_attempts();

-- Scheduled job (Supabase Edge Function ile)
-- Her gece 03:00'te otomatik çalışır
```

## 🧪 Test Senaryoları

### Test 1: Uyuşturucu Tespiti

```typescript
const result = detectIllegalProduct(
  'Satılık bonzai',
  'Kaliteli bonzai satılık, hemen teslim'
)
// Result: { shouldBlock: true, riskLevel: 'critical', categories: ['drugs'] }
```

### Test 2: Silah Tespiti

```typescript
const result = detectIllegalProduct(
  'Av tüfeği satılık',
  'Kullanılmamış av tüfeği, faturalı'
)
// Result: { shouldBlock: true, riskLevel: 'critical', categories: ['weapons'] }
```

### Test 3: Temiz Ürün

```typescript
const result = detectIllegalProduct(
  'Vintage Jean Ceket',
  'Temiz, hiç kullanılmamış vintage jean ceket'
)
// Result: { isClean: true, shouldBlock: false }
```

## 🛠️ Kurulum ve Deployment

### 1. Database Migration

```bash
# Supabase SQL Editor'de çalıştır
cat supabase/schema.sql | grep -A 200 "YASADIŞI ÜRÜN" | pbcopy
# Supabase Dashboard > SQL Editor > Paste > Run
```

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Netlify Deployment

```bash
# Build ve deploy
npm run build
git add .
git commit -m "feat: Yasadışı ürün filtreleme sistemi eklendi"
git push origin main
```

## 📝 Kelime Listesi Güncelleme

Yeni yasadışı kelimeler eklemek için:

```typescript
// src/lib/illegal-product-filter.ts
export const illegalProductDatabase = {
  drugs: [
    'esrar', 'kokain', 'eroin',
    // YENİ KELİMELER BURAYA EKLE
    'yeni-uyuşturucu-adı'
  ],
  // ...
}
```

## 🔄 Maintenance

### Haftalık Kontroller

- ✅ False positive kontrolü (yanlışlıkla engellenen ürünler)
- ✅ Whitelist güncelleme
- ✅ Yeni yasadışı terimler araştırması

### Aylık Raporlar

- ✅ İstatistik raporu üretme
- ✅ Trend analizi
- ✅ Risk seviyesi dağılımı

## 🚨 Acil Durum Prosedürü

### Yanlış Pozitif (False Positive)

1. Kelimeyi whitelist'e ekle
2. Database'deki false positive logları temizle
3. Kullanıcıya açıklama e-postası gönder

### Yeni Tehdit Tespiti

1. Kelimeyi database'e ekle
2. Risk seviyesini belirle
3. Test et
4. Deploy et
5. Announcement yap

## 📞 Destek

Sistem hakkında sorularınız için:
- Email: support@takasyap.com
- Documentation: /docs/illegal-filter
- Issue Tracker: GitHub Issues

---

**⚖️ Yasal Uyarı:** Bu sistem Türkiye Cumhuriyeti yasalarına uygun olarak tasarlanmıştır. Tüm yasadışı içerik girişimleri kaydedilir ve gerektiğinde yetkili makamlara bildirilir.
