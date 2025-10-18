-- =============================================
-- MESAJ GÖRÜLDÜ ÖZELLİĞİ (WhatsApp Style)
-- "✓" gönderildi, "✓✓" görüldü
-- =============================================

-- 1️⃣ messages tablosuna read_at kolonu ekle (eğer yoksa)
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- 2️⃣ Mevcut okunmuş mesajlar için read_at'ı güncelle
UPDATE public.messages 
SET read_at = created_at 
WHERE read = true AND read_at IS NULL;

-- 3️⃣ Trigger: read = true olduğunda otomatik read_at ekle
CREATE OR REPLACE FUNCTION public.set_message_read_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer read false'dan true'ya geçiyorsa
  IF NEW.read = true AND (OLD.read = false OR OLD.read IS NULL) THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eski trigger'ı kaldır, yenisini ekle
DROP TRIGGER IF EXISTS auto_set_message_read_at ON public.messages;
CREATE TRIGGER auto_set_message_read_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  WHEN (NEW.read = true AND OLD.read = false)
  EXECUTE FUNCTION public.set_message_read_at();

-- 4️⃣ Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON public.messages(read_at) WHERE read_at IS NOT NULL;

-- 5️⃣ RLS Policy güncelle (eğer varsa)
-- Kullanıcılar sadece kendi mesajlarının read_at değerini görebilir
-- (Zaten mevcut RLS'de bu korunuyor olmalı)

-- Test sorguları
SELECT 
  id,
  content,
  read,
  read_at,
  created_at,
  CASE 
    WHEN read_at IS NOT NULL THEN '✓✓ Görüldü'
    WHEN read = true THEN '✓✓ Okundu'
    ELSE '✓ Gönderildi'
  END as status
FROM public.messages
ORDER BY created_at DESC
LIMIT 5;

SELECT '✅ Mesaj görüldü özelliği başarıyla eklendi!' as status;
