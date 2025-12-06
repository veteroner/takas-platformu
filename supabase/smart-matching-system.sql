-- =====================================================
-- AKILLI EŞLEŞTİRME SİSTEMİ - Takas Platform
-- Beden, yaş, kategori bazlı eşleştirme
-- =====================================================

-- 1. Item Attributes Table (Ürün özellikleri)
CREATE TABLE IF NOT EXISTS public.item_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  
  -- Kıyafet özellikleri
  size_eu TEXT, -- '32', '34', '36', '38', '40', '42', '44', '46', '48', '50'
  size_text TEXT, -- 'XS', 'S', 'M', 'L', 'XL', 'XXL'
  gender TEXT CHECK (gender IN ('male', 'female', 'unisex', 'kids_boy', 'kids_girl', 'baby')),
  age_group TEXT CHECK (age_group IN ('baby', 'toddler', 'kids', 'teen', 'adult')),
  season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter', 'all_season')),
  style TEXT CHECK (style IN ('casual', 'sport', 'elegant', 'vintage', 'streetwear', 'classic')),
  color TEXT,
  brand TEXT,
  
  -- Oyuncak özellikleri
  toy_age_min INTEGER,
  toy_age_max INTEGER,
  toy_type TEXT CHECK (toy_type IN ('educational', 'activity', 'plush', 'building', 'electronic', 'outdoor', 'puzzle', 'board_game', 'vehicle', 'doll', 'action_figure')),
  toy_gender TEXT CHECK (toy_gender IN ('boys', 'girls', 'unisex')),
  
  -- Kitap özellikleri
  book_genre TEXT,
  book_language TEXT DEFAULT 'tr',
  book_age_group TEXT CHECK (book_age_group IN ('children', 'young_adult', 'adult')),
  
  -- Genel
  condition_score INTEGER CHECK (condition_score >= 1 AND condition_score <= 10),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(item_id)
);

-- 2. User Matching Preferences (Kullanıcı tercihleri)
CREATE TABLE IF NOT EXISTS public.user_matching_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Kendi bedenleri
  my_size_text TEXT,
  my_gender TEXT CHECK (my_gender IN ('male', 'female')),
  
  -- Çocuk bilgileri
  has_children BOOLEAN DEFAULT false,
  children_info JSONB DEFAULT '[]'::jsonb,
  
  -- Tercihler
  preferred_categories TEXT[] DEFAULT '{}',
  size_tolerance INTEGER DEFAULT 1,
  seeking_toy_age_min INTEGER,
  seeking_toy_age_max INTEGER,
  preferred_city TEXT,
  max_distance_km INTEGER DEFAULT 50,
  accept_shipping BOOLEAN DEFAULT true,
  min_condition_score INTEGER DEFAULT 5,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_item_attrs_item ON public.item_attributes(item_id);
CREATE INDEX IF NOT EXISTS idx_item_attrs_size ON public.item_attributes(size_text);
CREATE INDEX IF NOT EXISTS idx_item_attrs_toy_age ON public.item_attributes(toy_age_min, toy_age_max);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user ON public.user_matching_preferences(user_id);

-- RLS
ALTER TABLE public.item_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matching_preferences ENABLE ROW LEVEL SECURITY;

-- Item Attributes Policies
CREATE POLICY "Anyone can view item attributes" ON public.item_attributes 
  FOR SELECT USING (true);

CREATE POLICY "Item owners can manage attributes" ON public.item_attributes 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.items WHERE items.id = item_attributes.item_id AND items.owner_id = auth.uid())
  );

-- User Preferences Policies
CREATE POLICY "Users can view own preferences" ON public.user_matching_preferences 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON public.user_matching_preferences 
  FOR ALL USING (auth.uid() = user_id);

-- Beden Uyumluluk Fonksiyonu
CREATE OR REPLACE FUNCTION public.calculate_size_score(
  user_size TEXT,
  item_size TEXT,
  tolerance INTEGER DEFAULT 1
) RETURNS INTEGER AS $$
DECLARE
  size_order TEXT[] := ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  user_idx INTEGER;
  item_idx INTEGER;
  size_diff INTEGER;
BEGIN
  user_idx := array_position(size_order, user_size);
  item_idx := array_position(size_order, item_size);
  
  IF user_idx IS NULL OR item_idx IS NULL THEN RETURN 0; END IF;
  
  size_diff := ABS(user_idx - item_idx);
  
  IF size_diff = 0 THEN RETURN 25;
  ELSIF size_diff <= tolerance THEN RETURN 20;
  ELSIF size_diff = 2 THEN RETURN 10;
  ELSE RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Yaş Uyumluluk Fonksiyonu
CREATE OR REPLACE FUNCTION public.calculate_age_score(
  child_age INTEGER,
  toy_min INTEGER,
  toy_max INTEGER
) RETURNS INTEGER AS $$
BEGIN
  IF child_age >= toy_min AND child_age <= toy_max THEN RETURN 15;
  ELSIF child_age >= toy_min - 1 AND child_age <= toy_max + 1 THEN RETURN 10;
  ELSE RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- GRANTs
GRANT ALL ON public.item_attributes TO authenticated;
GRANT ALL ON public.user_matching_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_size_score TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_age_score TO authenticated;
