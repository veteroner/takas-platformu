Hardcoded Turkish strings report

Scanned directories: `src/app`, `src/components`, `src/lib`, `src/middleware.ts`

Summary: Found many UI strings hardcoded in React components and pages. Below is a prioritized list of files that contain hardcoded Turkish UI text (non-locale files). These should be replaced with `t('...')` calls and the corresponding keys added to locale JSONs.

High-priority files (visible in UI / top pages):
- src/app/not-found.tsx — "Sayfa bulunamadı", "Aradığınız sayfa taşınmış ...", "Anasayfaya dön"
- src/app/login/page.tsx — Terms & privacy text, buttons: "Hesap Oluştur", "Giriş Yap", "Hesap Oluşturuluyor..."
- src/app/reset-password/page.tsx — many strings (placeholders, strength labels, errors)
- src/app/profile/page.tsx — quick action labels and profile copy like "Henüz değerlendirme yok..."
- src/app/profile/ratings/page.tsx — "Değerlendirmelerim", "Henüz Değerlendirme Yok"
- src/app/preferences/page.tsx — category labels, city list, section headers like "Akıllı Eşleştirme"
- src/app/notifications/page.tsx — mock notification messages with Turkish text
- src/app/matches/page.tsx — comments / section titles, sample locations

Components with hardcoded UI text (should be localized):
- src/components/DesktopLayout.tsx (nav labels, search placeholder)
- src/components/Footer.tsx (footer links & legal text)
- src/components/VersionGate.tsx (update messages)
- src/components/ProductFilterWarning.tsx (legal warning text)
- src/components/RatingModal.tsx (rating labels, placeholders, alerts)
- src/components/NetworkProvider.tsx / OfflineScreen.tsx (offline messages and tips)
- src/components/MatchToast.tsx ("Eşleştiniz!", "Hemen mesajlaşmaya başlayın!")
- src/components/MessageFilterWarning.tsx (ban messages, "İhlal sayısı")

Library / middleware with UI/strings to consider:
- src/middleware.ts — rate-limit message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.'
- src/lib/utils.ts — time-ago strings (e.g., 'Şimdi', 'X dakika önce') — consider returning localized strings via i18n
- src/lib/theme.ts, src/lib/userSettings.ts — developer comments in Turkish (optional)

Notes:
- `src/lib/profanity-database.ts` intentionally contains Turkish profanity lists — keep as-is (it's data, not UI labels).
- Locale JSON files (src/locales/**) contain Turkish translations; ensure any new keys are added across all locales.

Suggested next steps:
1. Auto-replace high-priority UI strings with `t('namespace.key')` and add keys to locale files.
2. For `utils.ts` time formatting, delegate to i18n (e.g., `t('time.now')` / relative time helpers) instead of hardcoded Turkish.
3. Run `npm run build` locally and fix any JSON syntax issues reported by Turbopack before pushing.
4. Push changes and re-run Netlify deploy.

If you want, I can start auto-fixing the top-priority files now (I will create commits, run the build, and push). Reply with `auto-fix` to proceed, or `report-only` to review this report first.
