# 🎯 HARDCODED STRINGS - QUICK REFERENCE

## ⚡ IMMEDIATE ACTION ITEMS (High Priority)

### 1. `/src/app/upload/page.tsx`
**Lines:** 155, 220, 295, 455  
**Issues:**
- Camera/Gallery error alert messages (Turkish)
- Image optimization progress text
- Account deletion placeholder

**Fix Example:**
```tsx
// Line 295 - BEFORE:
setOptimizationProgress(`Resim ${i + 1}/${filesToProcess.length} optimize ediliyor...`)

// AFTER:
setOptimizationProgress(t('optimizingImage', { count: i + 1, total: filesToProcess.length }))
```

---

### 2. `/src/app/login/page.tsx` ⚠️ LEGAL COMPLIANCE
**Lines:** 266-292  
**Issues:** Consent text hardcoded in Turkish

**Fix Example:**
```tsx
// BEFORE:
<span>
  <Link href={policyRoutes.terms}>{t('termsLink')}</Link>,{' '}
  <Link href={policyRoutes.kvkk}>{t('kvkkLink')}</Link> ve{' '}
  <Link href={policyRoutes.privacy}>{t('privacyLink')}</Link>'nı okudum, kabul ediyorum.
</span>

// AFTER:
<span>
  {t('consents.terms', { 
    terms: <Link href={policyRoutes.terms}>{t('termsLink')}</Link>,
    kvkk: <Link href={policyRoutes.kvkk}>{t('kvkkLink')}</Link>,
    privacy: <Link href={policyRoutes.privacy}>{t('privacyLink')}</Link>
  })}
</span>
```

---

### 3. `/src/app/forgot-password/page.tsx`
**Lines:** 109, 123-125, 131, 140  
**Issues:**
- Email placeholder
- Button states
- Info text
- Footer text

**Fix Example:**
```tsx
// Line 109 - BEFORE:
<input placeholder="E-posta adresiniz" />

// AFTER:
<input placeholder={t('emailPlaceholder')} />
```

---

### 4. `/src/app/chat/[id]/page.tsx`
**Lines:** 257, 267, 277  
**Issues:**
- Loading text (appears twice)
- Desktop layout title

**Fix Example:**
```tsx
// Line 257 - BEFORE:
<p className="text-gray-600">Yükleniyor...</p>

// AFTER:
<p className="text-gray-600">{t('common:loading')}</p>
```

---

## 🔴 CRITICAL ISSUES SUMMARY

| File | Line | Current | Issue | Priority |
|------|------|---------|-------|----------|
| upload/page.tsx | 155 | `📸 KAMERA HATASI` | Error alert in Turkish | 🔴 HIGH |
| upload/page.tsx | 295 | `Resim optimize ediliyor...` | Progress text | 🔴 HIGH |
| login/page.tsx | 266-292 | Consent forms | Legal compliance | 🔴 CRITICAL |
| forgot-password/page.tsx | 109-145 | All text | User-facing UI | 🔴 HIGH |
| chat/[id]/page.tsx | 257, 267 | `Yükleniyor...` | Loading states | 🟡 MEDIUM |
| admin/page.tsx | ALL | Turkish | Entire admin panel | 🟡 MEDIUM |

---

## 📋 REQUIRED TRANSLATION KEYS

### Add to `/public/locales/*/upload.json`:
```json
{
  "optimizingImage": "Optimizing {{count}} / {{total}}...",
  "errors": {
    "cameraDetails": "📸 CAMERA ERROR\n\nError: {{message}}\nCode: {{code}}",
    "galleryDetails": "🖼️ GALLERY ERROR\n\nError: {{message}}\nCode: {{code}}"
  }
}
```

### Add to `/public/locales/*/login.json`:
```json
{
  "consents": {
    "terms": "I have read and accept {terms}, {kvkk} and {privacy}",
    "marketing": "I consent to marketing/personalization (optional)",
    "email": "I accept commercial messages (optional)"
  }
}
```

### Add to `/public/locales/*/forgot-password.json`:
```json
{
  "emailPlaceholder": "Your email address",
  "sending": "Sending...",
  "sendResetLink": "Send Reset Link",
  "emailHint": "🔒 Use your registered email",
  "noAccount": "Don't have an account?",
  "signUp": "Sign up"
}
```

### Create `/public/locales/*/admin.json`:
```json
{
  "dashboard": {
    "welcome": "Welcome 👋",
    "subtitle": "Track platform status",
    "metrics": {
      "totalUsers": "Total Users",
      "activeItems": "Active Items",
      "totalMatches": "Total Matches"
    }
  }
}
```

---

## ⏱️ TIME ESTIMATES

| Task | Time | Impact |
|------|------|--------|
| forgot-password fixes | 10 min | ⭐⭐⭐ High |
| chat loading states | 5 min | ⭐⭐⭐ High |
| upload progress text | 15 min | ⭐⭐⭐ High |
| **login consent text** | 20 min | ⭐⭐⭐⭐⭐ CRITICAL |
| upload error alerts | 30 min | ⭐⭐ Medium |
| admin panel | 6-8 hrs | ⭐ Low |
| console messages | 2-3 hrs | ⭐ Low |

**Quick Wins Total: ~50 minutes for major UX improvements**

---

## ✅ VERIFICATION CHECKLIST

After fixing each file:

- [ ] All user-facing text uses `t()`
- [ ] No hardcoded Turkish/English strings
- [ ] Alerts/confirms translated
- [ ] Placeholders translated
- [ ] Error messages translated
- [ ] Success messages translated
- [ ] Button labels translated
- [ ] Validation messages translated
- [ ] Console logs in English (or removed)
- [ ] Test all 5 languages (tr, en, de, ar, da)

---

## 🚀 DEPLOYMENT STEPS

1. **Create translation files** (30 min)
   - Add missing keys to all 5 language files
   - Verify JSON syntax

2. **Update components** (2-4 hrs)
   - Replace hardcoded strings
   - Add useTranslation hooks
   - Test interpolation

3. **Test thoroughly** (1 hr)
   - Switch between languages
   - Check all user flows
   - Verify fallbacks work

4. **Deploy** (15 min)
   - Commit changes
   - Deploy to staging
   - Verify in production

**Total: 3-5 hours for complete fix**

---

## 📞 CONTACTS

- **Translation Reviews:** Content team
- **Legal Text:** Legal department (for consent forms)
- **QA Testing:** QA team
- **Emergency Issues:** Development team lead

---

See full report: [HARDCODED-STRINGS-AUDIT-REPORT.md](./HARDCODED-STRINGS-AUDIT-REPORT.md)
