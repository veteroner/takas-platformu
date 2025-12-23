-- =====================================================
-- Moderasyon Threshold Ayarı
-- =====================================================
-- Bu dosya otomatik moderasyon sistemi için
-- varsayılan threshold değerini app_settings tablosuna ekler
--
-- Kullanım: Supabase SQL Editor'de çalıştırın
-- =====================================================

-- app_settings tablosunu oluştur (yoksa)
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eksik kolonları ekle (mevcut tablo için)
DO $$ 
BEGIN
  -- description kolonu yoksa ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_settings' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE app_settings ADD COLUMN description TEXT;
  END IF;
  
  -- updated_at kolonu yoksa ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_settings' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE app_settings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Moderasyon threshold ayarını ekle
INSERT INTO app_settings (key, value, description)
VALUES (
  'auto_moderation_threshold',
  '3',
  'Bir ürünün otomatik olarak kaldırılması için gereken minimum şikayet sayısı'
)
ON CONFLICT (key) DO UPDATE
SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- RLS politikası (herkes okuyabilir, sadece admin yazabilir)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can read app_settings" ON app_settings;
CREATE POLICY "Everyone can read app_settings" ON app_settings
  FOR SELECT
  USING (true);

-- Yazma işlemleri sadece service_role ile (server-side) yapılmalıdır.
-- Not: Service role anahtarı RLS'i bypass eder; bu policy ekstra koruma sağlar.
DROP POLICY IF EXISTS "Service role can modify app_settings" ON app_settings;
CREATE POLICY "Service role can modify app_settings" ON app_settings
  FOR ALL
  USING ((auth.jwt()->>'role') = 'service_role')
  WITH CHECK ((auth.jwt()->>'role') = 'service_role');

COMMENT ON TABLE app_settings IS 'Uygulama genelinde kullanılan dinamik ayarlar';
COMMENT ON COLUMN app_settings.key IS 'Ayar anahtarı (unique)';
COMMENT ON COLUMN app_settings.value IS 'Ayar değeri (TEXT - parse edilebilir)';

-- Description kolonu varsa yorum ekle
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'app_settings' 
    AND column_name = 'description'
  ) THEN
    COMMENT ON COLUMN app_settings.description IS 'Ayar açıklaması';
  END IF;
END $$;

-- Diğer faydalı default ayarlar
INSERT INTO app_settings (key, value, description)
VALUES 
  ('maintenance_mode', 'false', 'Bakım modu aktif mi?'),
  ('min_app_version_ios', '1.0.0', 'iOS için minimum uygulama versiyonu'),
  ('min_app_version_android', '1.0.0', 'Android için minimum uygulama versiyonu')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- Tamamlandı ✅
-- =====================================================
