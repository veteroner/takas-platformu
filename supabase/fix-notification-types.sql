-- ============================================================================
-- FIX: Notification Types için Rating System Type'ları Ekle
-- ============================================================================
-- Problem: Rating system için 'rating_required' ve 'match_completed' type'ları
--          notifications tablosunun CHECK constraint'inde tanımlı değil
-- Çözüm: Constraint'i DROP edip yeni type'larla tekrar oluştur
-- ============================================================================

-- 1️⃣ Mevcut constraint'i kaldır
ALTER TABLE public.notifications 
  DROP CONSTRAINT IF EXISTS notifications_type_check;

-- 2️⃣ Yeni constraint'i ekle (rating system type'larıyla)
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check 
  CHECK (type IN (
    'system',           -- Sistem bildirimleri
    'match',            -- Yeni eşleşme
    'message',          -- Yeni mesaj
    'like',             -- Beğeni bildirimi
    'trade',            -- Takas talebi
    'warning',          -- Uyarı
    'announcement',     -- Genel duyuru
    'rating_required',  -- 🆕 Puanlama gerekli (Rating System)
    'match_completed'   -- 🆕 Takas tamamlandı (Rating System)
  ));

-- 3️⃣ Kontrol et
SELECT '✅ Notification type constraint güncellendi!' as status;

-- Test: Yeni type'larla notification eklenebilir mi?
DO $$
BEGIN
  -- Test notification ekle
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (
    (SELECT id FROM public.users LIMIT 1), -- İlk user
    'rating_required',
    'Test Bildirimi',
    'Rating required notification testi',
    '{}'::jsonb
  );
  
  -- Test notification'ı sil
  DELETE FROM public.notifications WHERE title = 'Test Bildirimi';
  
  RAISE NOTICE '✅ Test başarılı: rating_required type''ı çalışıyor!';
END $$;
