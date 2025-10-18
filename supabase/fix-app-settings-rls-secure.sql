-- ============================================
-- APP_SETTINGS RLS POLİTİKASI (GÜVENLİ VERSİYON)
-- Sadece admin kullanıcıları değiştirebilir
-- ============================================

-- Önce admin_users tablosu var mı kontrol et
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin kontrol fonksiyonu
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Auth kullanıcısı var mı?
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Admin kullanıcı mı?
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = auth.uid() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Enable read access for all users" ON public.app_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.app_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.app_settings;
DROP POLICY IF EXISTS "Anyone can read app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Authenticated users can insert app_settings" ON public.app_settings;
DROP POLICY IF EXISTS "Authenticated users can update app_settings" ON public.app_settings;

-- Yeni güvenli politikalar
CREATE POLICY "Everyone can read app_settings"
  ON public.app_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert app_settings"
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update app_settings"
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin kullanıcı ekle (kendi email'inizi yazın)
-- ⚠️ ÖNEMLİ: Auth'dan kendi user_id'nizi bulup buraya yazın
-- SELECT id, email FROM auth.users WHERE email = 'sizin@email.com';

-- Örnek:
-- INSERT INTO public.admin_users (user_id, email, role)
-- VALUES (
--   'YOUR-USER-ID-HERE',  -- auth.users tablosundan bulun
--   'sizin@email.com',
--   'super_admin'
-- ) ON CONFLICT (user_id) DO NOTHING;

-- Test
SELECT * FROM public.app_settings LIMIT 5;
