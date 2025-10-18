-- ============================================
-- APP_SETTINGS RLS POLİTİKASI DÜZELTMESİ
-- Admin panelden ayarları kaydetmek için
-- ============================================

-- Önce mevcut politikaları temizle
DROP POLICY IF EXISTS "Enable read access for all users" ON public.app_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.app_settings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.app_settings;

-- Yeni politikalar: Admin panel için tam erişim
CREATE POLICY "Anyone can read app_settings"
  ON public.app_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert app_settings"
  ON public.app_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update app_settings"
  ON public.app_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Test query
SELECT * FROM public.app_settings LIMIT 5;
