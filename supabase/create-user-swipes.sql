-- =============================================
-- USER SWIPES - Beğenilen ve Geçilen Ürünleri Kaydet
-- =============================================

-- 1️⃣ user_swipes tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.user_swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super_like')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: Bir kullanıcı bir ürüne sadece 1 kez swipe yapabilir
  UNIQUE(user_id, item_id)
);

-- 2️⃣ Index'ler (performans için)
CREATE INDEX IF NOT EXISTS idx_user_swipes_user_id ON public.user_swipes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_swipes_item_id ON public.user_swipes(item_id);
CREATE INDEX IF NOT EXISTS idx_user_swipes_action ON public.user_swipes(action);
CREATE INDEX IF NOT EXISTS idx_user_swipes_created_at ON public.user_swipes(created_at DESC);

-- 3️⃣ RLS Policies
ALTER TABLE public.user_swipes ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi swipe'larını görebilir
CREATE POLICY "Users can view own swipes"
  ON public.user_swipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi swipe'larını ekleyebilir
CREATE POLICY "Users can insert own swipes"
  ON public.user_swipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi swipe'larını güncelleyebilir (örn: like → super_like)
CREATE POLICY "Users can update own swipes"
  ON public.user_swipes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi swipe'larını silebilir
CREATE POLICY "Users can delete own swipes"
  ON public.user_swipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4️⃣ Helper fonksiyonlar
-- Kullanıcının beğendiği ürünleri getir
CREATE OR REPLACE FUNCTION public.get_user_liked_items(p_user_id UUID)
RETURNS TABLE (
  item_id UUID,
  item_title TEXT,
  item_images TEXT[],
  item_category TEXT,
  item_estimated_value INTEGER,
  item_location_city TEXT,
  swiped_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id as item_id,
    i.title as item_title,
    i.images as item_images,
    i.category as item_category,
    i.estimated_value as item_estimated_value,
    i.city as item_location_city,
    s.created_at as swiped_at
  FROM public.user_swipes s
  JOIN public.items i ON s.item_id = i.id
  WHERE s.user_id = p_user_id 
    AND s.action = 'like'
    AND i.status = 'active'
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının geçtiği ürünleri getir
CREATE OR REPLACE FUNCTION public.get_user_passed_items(p_user_id UUID)
RETURNS TABLE (
  item_id UUID,
  swiped_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.item_id,
    s.created_at as swiped_at
  FROM public.user_swipes s
  WHERE s.user_id = p_user_id 
    AND s.action = 'pass'
  ORDER BY s.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Swipe sayılarını getir
CREATE OR REPLACE FUNCTION public.get_user_swipe_counts(p_user_id UUID)
RETURNS TABLE (
  likes_count BIGINT,
  passes_count BIGINT,
  super_likes_count BIGINT,
  total_swipes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE action = 'like') as likes_count,
    COUNT(*) FILTER (WHERE action = 'pass') as passes_count,
    COUNT(*) FILTER (WHERE action = 'super_like') as super_likes_count,
    COUNT(*) as total_swipes
  FROM public.user_swipes
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5️⃣ Test sorguları (comment out in production)
-- SELECT * FROM public.get_user_liked_items('user-id');
-- SELECT * FROM public.get_user_passed_items('user-id');
-- SELECT * FROM public.get_user_swipe_counts('user-id');

SELECT '✅ User swipes tablosu başarıyla oluşturuldu!' as status;