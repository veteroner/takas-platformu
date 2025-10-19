-- =============================================
-- USER METADATA - Bio, Location, Phone için JSONB kolonu
-- =============================================

-- 1️⃣ users tablosuna metadata kolonu ekle
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2️⃣ Metadata için index ekle (GIN index for JSON queries)
CREATE INDEX IF NOT EXISTS idx_users_metadata ON public.users USING GIN (metadata);

-- 3️⃣ Metadata şeması örneği (dokümantasyon amaçlı)
COMMENT ON COLUMN public.users.metadata IS 'User metadata: {
  "bio": "string",
  "location": "string", 
  "phone": "string",
  "birthdate": "date",
  "gender": "string",
  "interests": ["string"],
  "social_links": {
    "instagram": "string",
    "twitter": "string"
  }
}';

-- 4️⃣ Metadata güncelleme fonksiyonu (helper)
CREATE OR REPLACE FUNCTION public.update_user_metadata(
  p_user_id UUID,
  p_key TEXT,
  p_value TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_metadata JSONB;
BEGIN
  -- Mevcut metadata'yı al
  SELECT metadata INTO v_metadata
  FROM public.users
  WHERE id = p_user_id;
  
  -- Null ise boş obje oluştur
  IF v_metadata IS NULL THEN
    v_metadata := '{}'::jsonb;
  END IF;
  
  -- Key'i güncelle
  v_metadata := jsonb_set(v_metadata, ARRAY[p_key], to_jsonb(p_value), true);
  
  -- Geri kaydet
  UPDATE public.users
  SET metadata = v_metadata
  WHERE id = p_user_id;
  
  RETURN v_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5️⃣ Test sorguları
-- Örnek metadata ekleme
-- SELECT update_user_metadata('user-id', 'bio', 'Merhaba ben John!');
-- SELECT update_user_metadata('user-id', 'location', 'İstanbul');
-- SELECT update_user_metadata('user-id', 'phone', '+90 555 123 4567');

-- Metadata okuma
-- SELECT 
--   id,
--   name,
--   email,
--   metadata->>'bio' as bio,
--   metadata->>'location' as location,
--   metadata->>'phone' as phone
-- FROM public.users
-- WHERE id = 'user-id';

SELECT '✅ User metadata kolonu başarıyla eklendi!' as status;
