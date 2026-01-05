-- =============================================
-- RATING SYSTEM - Karşılıklı Değerlendirme Sistemi
-- =============================================

-- 1️⃣ user_ratings tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rater_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: Bir kullanıcı bir match'te bir kişiye sadece 1 kez puan verebilir
  UNIQUE(rater_id, match_id)
);

-- 2️⃣ Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_user_ratings_rater_id ON public.user_ratings(rater_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_rated_user_id ON public.user_ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_match_id ON public.user_ratings(match_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_created_at ON public.user_ratings(created_at DESC);

-- 3️⃣ RLS Policies
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendilerine verilen puanları görebilir
CREATE POLICY "Users can view ratings given to them"
  ON public.user_ratings
  FOR SELECT
  USING (auth.uid() = rated_user_id OR auth.uid() = rater_id);

-- Kullanıcılar sadece kendi puanlarını ekleyebilir
CREATE POLICY "Users can insert own ratings"
  ON public.user_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = rater_id);

-- Kullanıcılar kendi puanlarını güncelleyebilir (24 saat içinde)
CREATE POLICY "Users can update own ratings within 24h"
  ON public.user_ratings
  FOR UPDATE
  USING (
    auth.uid() = rater_id 
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- 4️⃣ matches tablosuna yeni kolonlar ekle
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS user1_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user2_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 5️⃣ Helper fonksiyonlar

-- Kullanıcının ortalama puanını hesapla
CREATE OR REPLACE FUNCTION public.get_user_average_rating(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_avg_rating NUMERIC;
BEGIN
  SELECT AVG(rating)::NUMERIC(3,1) INTO v_avg_rating
  FROM public.user_ratings
  WHERE rated_user_id = p_user_id;
  
  -- Eğer hiç puan yoksa 5.0 döndür (yeni kullanıcılar için)
  RETURN COALESCE(v_avg_rating, 5.0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının toplam aldığı puan sayısını al
CREATE OR REPLACE FUNCTION public.get_user_rating_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO v_count
  FROM public.user_ratings
  WHERE rated_user_id = p_user_id;
  
  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Match'te her iki taraf da puanlama yaptı mı kontrol et
CREATE OR REPLACE FUNCTION public.check_match_both_rated(p_match_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_rating_count INTEGER;
  v_match_exists BOOLEAN;
BEGIN
  -- Match var mı kontrol et
  SELECT EXISTS(SELECT 1 FROM public.matches WHERE id = p_match_id) INTO v_match_exists;
  
  IF NOT v_match_exists THEN
    RETURN false;
  END IF;
  
  -- Her iki taraf da puanlama yaptı mı?
  SELECT COUNT(*)::INTEGER INTO v_rating_count
  FROM public.user_ratings
  WHERE match_id = p_match_id;
  
  RETURN v_rating_count >= 2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının bu match'te puanlama yapıp yapmadığını kontrol et
CREATE OR REPLACE FUNCTION public.user_has_rated_match(p_user_id UUID, p_match_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM public.user_ratings
    WHERE rater_id = p_user_id 
      AND match_id = p_match_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Match'i tamamla (her iki taraf onayladığında)
CREATE OR REPLACE FUNCTION public.complete_match(p_match_id UUID, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_match RECORD;
  v_both_confirmed BOOLEAN;
BEGIN
  -- Match bilgilerini al
  SELECT * INTO v_match
  FROM public.matches
  WHERE id = p_match_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Match bulunamadı'
    );
  END IF;
  
  -- Kullanıcının onayını güncelle
  IF v_match.user1_id = p_user_id THEN
    UPDATE public.matches 
    SET user1_confirmed = true
    WHERE id = p_match_id;
  ELSIF v_match.user2_id = p_user_id THEN
    UPDATE public.matches 
    SET user2_confirmed = true
    WHERE id = p_match_id;
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Bu match size ait değil'
    );
  END IF;
  
  -- Her iki taraf da onayladı mı kontrol et
  SELECT user1_confirmed AND user2_confirmed INTO v_both_confirmed
  FROM public.matches
  WHERE id = p_match_id;
  
  -- Her ikisi de onayladıysa match'i tamamla
  IF v_both_confirmed THEN
    UPDATE public.matches
    SET status = 'completed',
        completed_at = NOW()
    WHERE id = p_match_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Takas tamamlandı! Lütfen birbirinizi puanlayın.',
      'both_confirmed', true,
      'show_rating_modal', true
    );
  ELSE
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Onayınız kaydedildi. Diğer tarafın onayı bekleniyor.',
      'both_confirmed', false,
      'show_rating_modal', false
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6️⃣ Trigger: Match tamamlandığında notification gönder
CREATE OR REPLACE FUNCTION public.notify_match_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer match completed oldu ve her iki taraf da henüz puanlamadıysa bildirim gönder
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- User1'e bildirim
    IF NOT public.user_has_rated_match(NEW.user1_id, NEW.id) THEN
      INSERT INTO public.notifications (user_id, type, title, message, data)
      VALUES (
        NEW.user1_id,
        'rating_required',
        'Takası Puanla',
        'Tamamlanan takasınız için lütfen karşı tarafı puanlayın!',
        jsonb_build_object('match_id', NEW.id)
      );
    END IF;
    
    -- User2'ye bildirim
    IF NOT public.user_has_rated_match(NEW.user2_id, NEW.id) THEN
      INSERT INTO public.notifications (user_id, type, title, message, data)
      VALUES (
        NEW.user2_id,
        'rating_required',
        'Takası Puanla',
        'Tamamlanan takasınız için lütfen karşı tarafı puanlayın!',
        jsonb_build_object('match_id', NEW.id)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_match_completed ON public.matches;

CREATE TRIGGER trigger_notify_match_completed
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_match_completed();

-- 7️⃣ Test sorguları (comment out in production)
-- Ortalama puan al
-- SELECT public.get_user_average_rating('user-id');

-- Puan sayısı al
-- SELECT public.get_user_rating_count('user-id');

-- Match'te her iki taraf da puanladı mı?
-- SELECT public.check_match_both_rated('match-id');

-- Kullanıcı bu match'i puanladı mı?
-- SELECT public.user_has_rated_match('user-id', 'match-id');

SELECT '✅ Rating system başarıyla oluşturuldu!' as status;
