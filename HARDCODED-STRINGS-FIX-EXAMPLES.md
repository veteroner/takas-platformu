# 🛠️ HARDCODED STRINGS - FIX EXAMPLES

## Quick Copy-Paste Fixes for Developers

---

## 1. `/src/app/upload/page.tsx`

### Fix #1: Image Optimization Progress (Line 295)

**BEFORE:**
```tsx
setOptimizationProgress(`Resim ${i + 1}/${filesToProcess.length} optimize ediliyor...`)
```

**AFTER:**
```tsx
setOptimizationProgress(t('optimizingImage', { count: i + 1, total: filesToProcess.length }))
```

**Translation file additions:**
```json
// public/locales/tr/upload.json
{
  "optimizingImage": "{{count}} / {{total}} optimize ediliyor..."
}

// public/locales/en/upload.json
{
  "optimizingImage": "Optimizing {{count}} / {{total}}..."
}
```

---

### Fix #2: Camera Error Alert (Lines 155-165)

**BEFORE:**
```tsx
const errorDetails = `
📸 KAMERA HATASI

Hata: ${err?.message || 'Bilinmeyen hata'}

Kod: ${err?.code || 'N/A'}

Tip: ${err?.name || 'Error'}

Platform: ${Capacitor.getPlatform()}

Native: ${Capacitor.isNativePlatform() ? 'Evet' : 'Hayır'}

WebPath: ${err?.webPath || 'N/A'}

Stack: ${err?.stack?.substring(0, 200) || 'N/A'}
  `.trim()

setError(`${t('cameraErrorLabel')} ${userMessage}`)

if (Capacitor.isNativePlatform()) {
  alert(errorDetails)
}
```

**AFTER:**
```tsx
const errorDetails = t('errors.cameraDetails', {
  message: err?.message || t('errors.unknown'),
  code: err?.code || 'N/A',
  type: err?.name || 'Error',
  platform: Capacitor.getPlatform(),
  isNative: Capacitor.isNativePlatform() ? t('common:yes') : t('common:no'),
  webPath: err?.webPath || 'N/A',
  stack: err?.stack?.substring(0, 200) || 'N/A'
})

setError(t('errors.cameraFailed', { message: userMessage }))

if (Capacitor.isNativePlatform()) {
  alert(errorDetails)
}
```

**Translation additions:**
```json
// public/locales/tr/upload.json
{
  "errors": {
    "cameraDetails": "📸 KAMERA HATASI\n\nHata: {{message}}\n\nKod: {{code}}\n\nTip: {{type}}\n\nPlatform: {{platform}}\n\nNative: {{isNative}}\n\nWebPath: {{webPath}}\n\nStack: {{stack}}",
    "cameraFailed": "Kamera hatası: {{message}}",
    "unknown": "Bilinmeyen hata"
  }
}

// public/locales/en/upload.json
{
  "errors": {
    "cameraDetails": "📸 CAMERA ERROR\n\nError: {{message}}\n\nCode: {{code}}\n\nType: {{type}}\n\nPlatform: {{platform}}\n\nNative: {{isNative}}\n\nWebPath: {{webPath}}\n\nStack: {{stack}}",
    "cameraFailed": "Camera error: {{message}}",
    "unknown": "Unknown error"
  }
}

// public/locales/tr/common.json (add these)
{
  "yes": "Evet",
  "no": "Hayır"
}

// public/locales/en/common.json (add these)
{
  "yes": "Yes",
  "no": "No"
}
```

---

## 2. `/src/app/login/page.tsx`

### Fix: Consent Text (Lines 266-292)

**BEFORE:**
```tsx
{/* Consents (Register only) */}
{isRegister && (
  <div className="space-y-3 text-white/90">
    <label className="flex items-start gap-3">
      <input required type="checkbox" className="mt-1" />
      <span>
        <Link className="underline" href={policyRoutes.terms}>{t('termsLink')}</Link>,{' '}
        <Link className="underline" href={policyRoutes.kvkk}>{t('kvkkLink')}</Link> ve{' '}
        <Link className="underline" href={policyRoutes.privacy}>{t('privacyLink')}</Link>'nı okudum, kabul ediyorum.
      </span>
    </label>
    <label className="flex items-start gap-3">
      <input name="consent_marketing" type="checkbox" className="mt-1" />
      <span>
        Pazarlama/kişiselleştirme amaçlı işlenmesine <Link className="underline" href={policyRoutes.consent}>açık rıza</Link> veriyorum (opsiyonel).
      </span>
    </label>
    <label className="flex items-start gap-3">
      <input name="consent_email" type="checkbox" className="mt-1" />
      <span>
        Ticari elektronik ileti almayı kabul ediyorum (opsiyonel).
      </span>
    </label>
  </div>
)}
```

**AFTER:**
```tsx
{/* Consents (Register only) */}
{isRegister && (
  <div className="space-y-3 text-white/90">
    <label className="flex items-start gap-3">
      <input required type="checkbox" className="mt-1" />
      <span>
        {t('consents.termsAcceptance', {
          terms: <Link className="underline" href={policyRoutes.terms}>{t('termsLink')}</Link>,
          kvkk: <Link className="underline" href={policyRoutes.kvkk}>{t('kvkkLink')}</Link>,
          privacy: <Link className="underline" href={policyRoutes.privacy}>{t('privacyLink')}</Link>
        })}
      </span>
    </label>
    <label className="flex items-start gap-3">
      <input name="consent_marketing" type="checkbox" className="mt-1" />
      <span>
        {t('consents.marketing', {
          link: <Link className="underline" href={policyRoutes.consent}>{t('consents.consentLink')}</Link>
        })}
      </span>
    </label>
    <label className="flex items-start gap-3">
      <input name="consent_email" type="checkbox" className="mt-1" />
      <span>
        {t('consents.email')}
      </span>
    </label>
  </div>
)}
```

**Translation additions:**
```json
// public/locales/tr/login.json
{
  "consents": {
    "termsAcceptance": "{{terms}}, {{kvkk}} ve {{privacy}}'nı okudum, kabul ediyorum.",
    "marketing": "Pazarlama/kişiselleştirme amaçlı işlenmesine {{link}} veriyorum (opsiyonel).",
    "consentLink": "açık rıza",
    "email": "Ticari elektronik ileti almayı kabul ediyorum (opsiyonel)."
  }
}

// public/locales/en/login.json
{
  "consents": {
    "termsAcceptance": "I have read and accept {{terms}}, {{kvkk}} and {{privacy}}.",
    "marketing": "I consent to processing for marketing/personalization purposes {{link}} (optional).",
    "consentLink": "explicit consent",
    "email": "I accept to receive commercial electronic messages (optional)."
  }
}
```

---

## 3. `/src/app/forgot-password/page.tsx`

### Fix #1: Email Placeholder (Line 109)

**BEFORE:**
```tsx
<input
  type="email"
  placeholder="E-posta adresiniz"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="..."
/>
```

**AFTER:**
```tsx
<input
  type="email"
  placeholder={t('emailPlaceholder')}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="..."
/>
```

---

### Fix #2: Button States (Lines 123-125)

**BEFORE:**
```tsx
{isLoading ? (
  <>
    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
    Gönderiliyor...
  </>
) : (
  'Sıfırlama Linki Gönder'
)}
```

**AFTER:**
```tsx
{isLoading ? (
  <>
    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
    {t('sending')}
  </>
) : (
  t('sendResetLink')
)}
```

---

### Fix #3: Info Text (Line 131)

**BEFORE:**
```tsx
<p className="text-white/70 text-sm text-center">
  🔒 Hesabınıza kayıtlı e-posta adresini kullanın
</p>
```

**AFTER:**
```tsx
<p className="text-white/70 text-sm text-center">
  {t('emailHint')}
</p>
```

---

### Fix #4: Footer Text (Lines 140-145)

**BEFORE:**
```tsx
<p className="text-center text-white/60 text-sm mt-6">
  Hesabınız yok mu?{' '}
  <Link href="/login" className="text-white hover:underline">
    Kayıt olun
  </Link>
</p>
```

**AFTER:**
```tsx
<p className="text-center text-white/60 text-sm mt-6">
  {t('noAccount')}{' '}
  <Link href="/login" className="text-white hover:underline">
    {t('signUp')}
  </Link>
</p>
```

**Complete translation file:**
```json
// public/locales/tr/forgot-password.json
{
  "emailPlaceholder": "E-posta adresiniz",
  "sending": "Gönderiliyor...",
  "sendResetLink": "Sıfırlama Linki Gönder",
  "emailHint": "🔒 Hesabınıza kayıtlı e-posta adresini kullanın",
  "noAccount": "Hesabınız yok mu?",
  "signUp": "Kayıt olun"
}

// public/locales/en/forgot-password.json
{
  "emailPlaceholder": "Your email address",
  "sending": "Sending...",
  "sendResetLink": "Send Reset Link",
  "emailHint": "🔒 Use your registered email address",
  "noAccount": "Don't have an account?",
  "signUp": "Sign up"
}
```

---

## 4. `/src/app/chat/[id]/page.tsx`

### Fix #1: Loading States (Lines 257, 267)

**BEFORE:**
```tsx
<p className="text-gray-600">Yükleniyor...</p>
```

**AFTER:**
```tsx
<p className="text-gray-600">{t('common:loading')}</p>
```

---

### Fix #2: Desktop Layout Title (Line 277)

**BEFORE:**
```tsx
<DesktopLayout title="Sohbet" maxWidth="7xl">
```

**AFTER:**
```tsx
<DesktopLayout title={t('chatTitle')} maxWidth="7xl">
```

**Translation addition:**
```json
// public/locales/tr/messages.json (add this key)
{
  "chatTitle": "Sohbet"
}

// public/locales/en/messages.json
{
  "chatTitle": "Chat"
}
```

---

### Fix #3: Console Messages (Throughout the file)

**BEFORE:**
```tsx
console.log('📨 Yeni mesaj geldi:', payload.new)
console.log('⚠️ Duplicate mesaj engellendi:', newMsg.id)
console.log('✏️ Mesaj güncellendi:', payload.new)
console.log('🔔 Subscription durumu:', status)
console.log('✅ Real-time mesajlaşma aktif!')
console.log('🔌 Subscription kapatılıyor...')
```

**AFTER:**
```tsx
console.log('📨 New message received:', payload.new)
console.log('⚠️ Duplicate message blocked:', newMsg.id)
console.log('✏️ Message updated:', payload.new)
console.log('🔔 Subscription status:', status)
console.log('✅ Real-time messaging active!')
console.log('🔌 Closing subscription...')
```

---

## 5. `/src/app/settings/page.tsx`

### Fix: Account Deletion Alert (Line 455)

**BEFORE:**
```tsx
const handleDeleteAccount = () => {
  alert('Hesap silme işlemi gerçek uygulamada API çağrısı yapacak')
  setShowDeleteConfirm(false)
}
```

**AFTER:**
```tsx
const handleDeleteAccount = () => {
  alert(t('settings:account.deleteAccountPlaceholder'))
  setShowDeleteConfirm(false)
}
```

**Translation addition:**
```json
// public/locales/tr/settings.json
{
  "account": {
    "deleteAccountPlaceholder": "Hesap silme işlemi gerçek uygulamada API çağrısı yapacak"
  }
}

// public/locales/en/settings.json
{
  "account": {
    "deleteAccountPlaceholder": "Account deletion will call API in production app"
  }
}
```

---

## 6. `/src/app/reset-password/page.tsx`

### Fix: Error Fallback (Line 102)

**BEFORE:**
```tsx
const errorMessage = err instanceof Error ? err.message : 'Şifre güncellenirken bir hata oluştu'
setError(errorMessage)
```

**AFTER:**
```tsx
const errorMessage = err instanceof Error ? err.message : t('errors.updateFailed')
setError(errorMessage)
```

**Translation addition:**
```json
// public/locales/tr/forgot-password.json
{
  "errors": {
    "updateFailed": "Şifre güncellenirken bir hata oluştu"
  }
}

// public/locales/en/forgot-password.json
{
  "errors": {
    "updateFailed": "An error occurred while updating password"
  }
}
```

---

## 📋 TESTING CHECKLIST

After applying each fix:

```tsx
// 1. Test in Turkish
localStorage.setItem('i18nextLng', 'tr')
window.location.reload()

// 2. Test in English
localStorage.setItem('i18nextLng', 'en')
window.location.reload()

// 3. Test in all other languages (de, ar, da)

// 4. Check console for missing translation warnings:
// Expected: No "[i18next]" warnings
```

---

## 🚨 COMMON PITFALLS

### ❌ Don't do this:
```tsx
// Inline string concatenation
<p>{"Toplam: " + count + " ürün"}</p>
```

### ✅ Do this instead:
```tsx
// Use translation with interpolation
<p>{t('totalItems', { count })}</p>
```

---

### ❌ Don't do this:
```tsx
// Hardcoded conditional text
{isSuccess ? 'Başarılı' : 'Başarısız'}
```

### ✅ Do this instead:
```tsx
// Translated conditional
{t(isSuccess ? 'success' : 'failed')}
```

---

### ❌ Don't do this:
```tsx
// Alert without translation
alert('İşlem başarılı!')
```

### ✅ Do this instead:
```tsx
// Translated alert
alert(t('operationSuccess'))
```

---

## 🎯 QUICK REFERENCE: useTranslation Hook

```tsx
import { useTranslation } from 'react-i18next'

export default function MyPage() {
  // Single namespace
  const { t } = useTranslation('upload')
  
  // Multiple namespaces
  const { t } = useTranslation(['upload', 'common'])
  
  // Usage examples:
  t('key')                           // Simple
  t('key', { name: 'John' })        // Interpolation
  t('common:loading')               // Other namespace
  t('key', { defaultValue: 'Fallback' })  // With fallback
  t('items', { count: 5 })          // Pluralization
}
```

---

## 💡 PRO TIPS

1. **Always use namespace prefix for clarity:**
   ```tsx
   // Good
   t('upload:errors.cameraFailed')
   
   // Also good (when namespace is in useTranslation)
   const { t } = useTranslation('upload')
   t('errors.cameraFailed')
   ```

2. **Keep translation keys organized:**
   ```
   upload.json
   ├── errors
   │   ├── cameraFailed
   │   ├── galleryFailed
   │   └── unknown
   ├── labels
   │   ├── title
   │   └── description
   └── buttons
       ├── upload
       └── cancel
   ```

3. **Use Trans component for complex JSX:**
   ```tsx
   import { Trans } from 'react-i18next'
   
   <Trans i18nKey="consents.terms">
     I accept <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy</Link>
   </Trans>
   ```

---

## 🔄 MIGRATION SCRIPT

For bulk find/replace operations, use this approach:

```bash
# Find all hardcoded Turkish strings in page files
grep -r "className.*>" src/app/**/page.tsx | grep -E "(Yükleniyor|Gönder|Kaydet)"

# Find alert/confirm calls
grep -r "alert\|confirm" src/app/**/page.tsx

# Find console.log with Turkish
grep -r "console.log.*[ğışçüöĞİŞÇÜÖ]" src/app/**/page.tsx
```

---

Need help? Check the full audit report: [HARDCODED-STRINGS-AUDIT-REPORT.md](./HARDCODED-STRINGS-AUDIT-REPORT.md)
