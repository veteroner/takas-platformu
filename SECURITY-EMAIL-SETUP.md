# 🔐 Güvenlik ve Email Kurulum Rehberi

## 📧 1. Resend.com Kurulumu (Profesyonel Email Gönderici)

### Adım 1: Resend Hesabı Oluştur
1. [https://resend.com](https://resend.com) adresine git
2. **Sign Up** ile ücretsiz hesap oluştur
3. Email adresini doğrula

### Adım 2: API Key Al
1. Dashboard'da **API Keys** bölümüne git
2. **Create API Key** butonuna tıkla
3. İsim ver (örn: "TakaZone Production")
4. API key'i kopyala (bir daha gösterilmeyecek!)

### Adım 3: Domain Ekle (Opsiyonel ama Önerilen)
1. **Domains** bölümüne git
2. **Add Domain** tıkla
3. Domain'ini ekle (örn: `takazone.com`)
4. Verilen DNS kayıtlarını domain sağlayıcına ekle:
   - SPF (TXT)
   - DKIM (TXT)
   - DMARC (TXT)

**Domain yoksa:** `resend.dev` subdomain'i kullanabilirsin (3000 email/gün limit)

---

## 🤖 2. Cloudflare Turnstile Kurulumu (Bot Koruması)

### Adım 1: Cloudflare Hesabı
1. [https://dash.cloudflare.com](https://dash.cloudflare.com) - Giriş yap
2. Sol menüden **Turnstile** seç

### Adım 2: Site Ekle
1. **Add Site** butonuna tıkla
2. Site adı: `TakaZone`
3. Domain: `takazone.com` (veya test için `localhost`)
4. Widget Mode: **Managed** (önerilen)

### Adım 3: Keys'leri Al
Oluşturulduktan sonra 2 key alacaksın:
- **Site Key** (Public) → Frontend'de kullanılacak
- **Secret Key** (Private) → Backend'de kullanılacak

---

## ⚙️ 3. Environment Variables Ayarları

### `.env.local` Dosyası Oluştur

Proje kök dizininde `.env.local` dosyası oluştur:

```bash
# Resend Email
RESEND_API_KEY=re_123456789_YourActualResendAPIKey
FROM_EMAIL=noreply@takazone.com
# veya domain yoksa: noreply@your-subdomain.resend.dev

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Production'da: https://takazone.com
```

### Supabase Environment Variables

Supabase'de de eklemen gerekebilir:
```bash
RESEND_API_KEY=re_123456789_YourActualResendAPIKey
```

---

## 🔧 4. Supabase Email Doğrulama Ayarları

### Adım 1: Authentication Ayarları
1. Supabase Dashboard → **Authentication** → **Settings**
2. **Enable email confirmations** → ✅ Aktif et
3. **Secure email change** → ✅ Aktif et (önerilen)

### Adım 2: Email Templates (Opsiyonel)
Varsayılan Supabase templates yerine custom template kullanacağız ama Supabase'in kendi template'lerini de özelleştirebilirsin:

1. **Email Templates** bölümüne git
2. **Confirm signup** template'ini düzenle
3. Veya otomatik Resend kullan

---

## 🧪 5. Test Etme

### Local Test
```bash
# Development'ta test et
npm run dev
```

1. `http://localhost:3000/login` git
2. **Kayıt Ol** sekmesine geç
3. Form doldur
4. Turnstile widget'ını görmelisin
5. Kayıt ol
6. Email'ini kontrol et (Resend'den gelecek)

### Turnstile Test Modes

**Test için özel keys:**
```bash
# Always passes
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA

# Always fails
NEXT_PUBLIC_TURNSTILE_SITE_KEY=2x00000000000000000000AB
TURNSTILE_SECRET_KEY=2x0000000000000000000000000000000AA

# Interactive (görünür challenge)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=3x00000000000000000000FF
TURNSTILE_SECRET_KEY=3x0000000000000000000000000000000AA
```

---

## 📊 6. Özet: Ücretsiz Limitler

| Servis | Ücretsiz Limit | Yeterli mi? |
|--------|---------------|-------------|
| **Resend** | 3,000 email/gün | ✅ Başlangıç için ideal |
| **Turnstile** | Sınırsız | ✅ Tamamen ücretsiz |
| **Supabase Auth** | 50,000 kullanıcı | ✅ Fazlasıyla yeterli |
| **Rate Limiting** | Built-in | ✅ Ücretsiz |

---

## 🚀 7. Production'a Alma

### Netlify Environment Variables
```bash
# Netlify Dashboard → Site Settings → Environment Variables
RESEND_API_KEY=re_YourProductionKey
FROM_EMAIL=noreply@takazone.com
NEXT_PUBLIC_TURNSTILE_SITE_KEY=YourRealSiteKey
TURNSTILE_SECRET_KEY=YourRealSecretKey
NEXT_PUBLIC_APP_URL=https://takazone.com
```

### GitHub'a Push
```bash
git add .
git commit -m "feat: Email verification & bot protection added"
git push origin main
```

---

## ✅ Güvenlik Katmanları Özeti

1. ✅ **Email Doğrulama** - Resend ile profesyonel
2. ✅ **Bot Koruması** - Cloudflare Turnstile
3. ✅ **Rate Limiting** - IP bazlı kayıt sınırlaması
4. ✅ **Database Sync** - Auth + users tablosu tutarlılığı

**Tümü %100 ücretsiz!** 🎉
