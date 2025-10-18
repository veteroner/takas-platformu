-- =============================================
-- OKUNMAMIŞ MESAJ FONKSİYONLARI DÜZELTMESİ
-- Hata: column m.read_at does not exist
-- Çözüm: read_at yerine read kullan
-- =============================================

-- 1️⃣ Toplam okunmamış mesaj sayısı
DROP FUNCTION IF EXISTS public.get_unread_message_count(UUID);

CREATE OR REPLACE FUNCTION public.get_unread_message_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  -- ✅ DOĞRU: read kolonu kullanılıyor (read_at DEĞİL!)
  SELECT COUNT(*) INTO unread_count
  FROM public.messages
  WHERE receiver_id = p_user_id
    AND read = false;
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2️⃣ Match başına okunmamış mesaj sayısı
DROP FUNCTION IF EXISTS public.get_unread_by_match(UUID);

CREATE OR REPLACE FUNCTION public.get_unread_by_match(p_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  unread_count BIGINT,
  last_message_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.match_id,
    COUNT(*) as unread_count,
    MAX(m.created_at) as last_message_at  -- ✅ DOĞRU: created_at kullanılıyor
  FROM public.messages m
  WHERE m.receiver_id = p_user_id
    AND m.read = false  -- ✅ DOĞRU: read kullanılıyor (read_at DEĞİL!)
  GROUP BY m.match_id
  ORDER BY MAX(m.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3️⃣ Permission'lar
GRANT EXECUTE ON FUNCTION public.get_unread_message_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_by_match(UUID) TO authenticated;


-- 4️⃣ Test sorguları
-- Mesaj tablosu yapısını kontrol et
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Fonksiyonları test et (kendi user_id'nizi kullanın)
-- SELECT * FROM get_unread_message_count('YOUR-USER-ID');
-- SELECT * FROM get_unread_by_match('YOUR-USER-ID');


-- 5️⃣ Trigger düzeltmeleri (eğer read_at trigger'ı varsa kaldır)
-- Eski trigger'ı temizle
DROP TRIGGER IF EXISTS set_message_read_time ON public.messages;
DROP FUNCTION IF EXISTS public.update_message_read_time();

-- Yeni trigger: read boolean değiştiğinde updated_at'ı güncelle
CREATE OR REPLACE FUNCTION public.update_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read != OLD.read THEN
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_read_timestamp
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_message_timestamp();


SELECT '✅ Okunmamış mesaj fonksiyonları ve trigger başarıyla güncellendi!' as status;
