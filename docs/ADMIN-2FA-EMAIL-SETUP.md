# Admin 2FA E-posta Kurulumu

## 1. Resend API Key Alma

1. [resend.com](https://resend.com) adresine gidin
2. Ücretsiz hesap oluşturun (ayda 3000 e-posta ücretsiz)
3. Dashboard > API Keys > Create API Key
4. Key'i kopyalayın

## 2. Supabase'de Secret Ekleme

```bash
# Supabase CLI ile
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
supabase secrets set FROM_EMAIL=noreply@takazone.app
```

Veya Supabase Dashboard'dan:
1. Project Settings > Edge Functions > Secrets
2. `RESEND_API_KEY` ekleyin
3. `FROM_EMAIL` ekleyin (opsiyonel, varsayılan: noreply@takazone.app)

## 3. Domain Doğrulama (Opsiyonel ama Önerilen)

Resend'de kendi domain'inizi doğrulayın:
1. Resend Dashboard > Domains > Add Domain
2. DNS kayıtlarını ekleyin (DKIM, SPF)
3. Doğrulamayı bekleyin

## 4. Edge Function Deploy

```bash
# Proje klasöründe
cd /Users/onerozbey/Desktop/Takas-platform

# Supabase CLI kurulu değilse
npm install -g supabase

# Login
supabase login

# Projeye bağlan
supabase link --project-ref YOUR_PROJECT_REF

# Edge Function deploy
supabase functions deploy send-admin-otp
```

## 5. Test Etme

```bash
# Edge Function'ı test et
curl -X POST 'https://YOUR_PROJECT.supabase.co/functions/v1/send-admin-otp' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@example.com", "code": "123456"}'
```

## 6. Environment Variables

Netlify'da (veya hosting provider'da):
- `NODE_ENV=production` olduğundan emin olun
- Diğer Supabase env'ler zaten ayarlı olmalı

---

## Alternatif: SMTP Kullanımı

Resend yerine SMTP kullanmak isterseniz Edge Function'ı güncelleyin:

```typescript
// Nodemailer veya benzeri SMTP client kullanın
const transporter = nodemailer.createTransport({
  host: Deno.env.get('SMTP_HOST'),
  port: 587,
  auth: {
    user: Deno.env.get('SMTP_USER'),
    pass: Deno.env.get('SMTP_PASS'),
  },
})
```

---

## Sorun Giderme

### E-posta gitmiyor
1. Supabase Dashboard > Edge Functions > Logs kontrol edin
2. `RESEND_API_KEY` doğru ayarlandığından emin olun
3. Resend Dashboard'da e-posta limiti kontrol edin

### "Email service not configured" hatası
- Supabase secret'ları kontrol edin:
  ```bash
  supabase secrets list
  ```

### Spam klasörüne düşüyor
- Domain doğrulaması yapın (DKIM, SPF, DMARC)
- Resend'de verified domain kullanın
