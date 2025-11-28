# Supabase Güvenlik Denetimi (2025-11-16)

## Özet
Platform şemasında RLS büyük oranda etkin. Aşağıdaki alanlarda güçlendirme önerileri mevcut:
- `public.items` SELECT policy yalnızca `status='active'`; kullanıcı kendi pasif/traded kayıtlarını göremiyor (profil ekranında gerekebilir).
- `public.matches` INSERT policy sınırsız; otomatik eşleşme mantığı haricinde manuel kötüye kullanım mümkün.
- Service role (JWT role tabanlı) kontrolleri tutarlı değil: Bazı tablolarda `auth.jwt()->>'role' = 'service_role'` kullanılırken diğerlerinde admin tablosu ile kontrol önerilmemiş.
- KVKK/GDPR silme fonksiyonu `delete_user_data` içinde olmayan tablolar (örn: `notifications`, `fcm_tokens`, `user_activity_log`).
- Blob/storage bucket politikaları repo içinde dokümante edilmemiş (görsel yükleme + kötü amaçlı içerik filtreleme).
- Rate limit veritabanı fonksiyonları yok (sadece app-level middleware). Edge Function seviyesinde IP/User bazlı limit önerilir.

## Tablolara Göre Durum
| Tablo | RLS | Insert Policy | Update Policy | Delete Policy | Notlar |
|-------|-----|---------------|--------------|---------------|--------|
| users | Evet | `own profile` | `own profile` | Yok (silme yok) | Profil silme fonksiyonu üzerinden dolaylı silme |
| items | Evet | `owner` | `owner` | `owner` | SELECT yalnızca aktif; owner kendi traded/deleted kayıtlarını göremeyebilir |
| swipes | Evet | `user_id` | Yok | Yok | Tekil constraint var; flood risk kısmi |
| matches | Evet | `true` | `user1_id or user2_id` | Yok | INSERT doğrulama eksik (özel senaryoda spam match) |
| messages | Evet | Revize edilmiş policies | `receiver read` | Yok | Read receipt için ayrı sütun önerilir |
| seeking_preferences | Evet | `own` | `own` | Yok | Tamam |
| consents | Evet | `own` | Yok | Yok | Tamam |
| app_settings | (RLS script'te ayrı) | Admin | Admin | Admin | İyi |
| notification_prefs | Evet | `own` | `own` | Yok | Tamam |
| notifications | Evet | Sistem insert | `own (read)` | Yok | Kullanıcı kendine ait tüm kayıtları silemeyebilir |
| admin_users | Evet | make_user_admin fonksiyonu | Yok | Yok | Admin role escalation fonksiyonuna audit önerisi |
| fcm_tokens | Evet | `own` | `own` | `own` | Token de-aktivasyonu OK |
| user_activity_log | Evet | Yok | Yok | Yok | Sadece admin view; GDPR purge gerekebilir |
| user_violations | Evet | Service role | Service role | Service role | Kullanıcı kendi violation geçmişini göremiyor (isteğe bağlı) |
| filtered_messages | Evet | Service role | Service role | Service role | KVKK süre dolunca otomatik silme fonksiyonları mevcut |
| user_chat_bans | Evet | Service role | Service role | Service role | Kullanıcı sadece SELECT ban durumu |
| illegal_product_attempts | Evet | System insert | Admin select | Yok | Kullanıcıya geri bildirim entegre edilmemiş |
| user_blocks | Evet | `blocker` | Yok | `blocker` | Tamam |
| user_reports | Evet | `reporter` | Admin | Admin | Tamam |

## Eksikler & Öneriler
1. **Items SELECT genişletme:** Owner kendi traded/deleted item'larını görebilmeli.
2. **Matches INSERT kısıtlama:** Sadece otomatik eşleşme fonksiyonu (trigger context) veya service role.
3. **Unified role check:** Admin işlemleri için `is_admin()` fonksiyonu standardize edilmeli; hardcoded JWT role stringlerinden kaçınılmalı.
4. **Veri Silme (KVKK) genişletme:** `delete_user_data` fonksiyonuna notifications, notification_prefs, fcm_tokens, user_activity_log eklenmeli.
5. **Read receipt sütunu:** Messages tablosuna `read_at TIMESTAMPTZ` ekleyip trigger güncellemesi.
6. **Abuse Koruması:** `swipes` tablosu için son 60 saniyede N adetten fazla swipe engelle (db constraint + trigger veya app-level guard).
7. **Illegal product feedback:** Kullanıcıya (non-sensitive) otomatik uyarı bildirimi eklenmesi (edge function veya trigger).
8. **Activity Log GDPR:** `user_activity_log` için retention (örn: 180 gün) ve cleanup fonksiyonu.
9. **Denormalized counters:** Performans için match/message count fonksiyonları yerine materialized view veya increment tablosu.
10. **Index İnceleme:** Partial index: `messages (receiver_id) WHERE read=false` zaten ekli; `items(status, created_at)` composite eklenebilir.

## Önerilen Ek Politikalar & Fonksiyonlar
Aşağıdaki ek SQL dosyasında (`recommended-policies.sql`) uygulanabilir.

## Önerilen Indeksler
`recommended-indexes.sql` dosyasında eklenmiştir.

## Sonraki Adımlar
- SQL dosyalarını Supabase'te çalıştır.
- Edge Functions ile cron tabanlı temizlik (filtered_messages & illegal_product_attempts) işleyişini doğrula.
- CI pipeline: migration değişikliklerini otomatik deploy (supabase CLI veya SQL file apply).

