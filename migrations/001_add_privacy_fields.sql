-- Migration: Kişisel Veri Gizliliği için User Tablosu Güncelleme
-- Tarih: 2026-01-05
-- Amaç: KVKK ve GDPR uyumluluğu için firstName, lastName, displayName alanları ekleme

-- 1. Yeni kolonları ekle
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS display_name VARCHAR(50);

-- 2. Mevcut 'name' verisini firstName ve displayName'e migrate et
UPDATE users 
SET 
  first_name = CASE 
    WHEN first_name IS NULL THEN SPLIT_PART(name, ' ', 1)
    ELSE first_name 
  END,
  last_name = CASE 
    WHEN last_name IS NULL THEN COALESCE(SPLIT_PART(name, ' ', 2), '')
    ELSE last_name
  END,
  display_name = CASE 
    WHEN display_name IS NULL THEN SPLIT_PART(name, ' ', 1)
    ELSE display_name
  END
WHERE first_name IS NULL OR last_name IS NULL OR display_name IS NULL;

-- 3. İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_users_display_name ON users(display_name);
CREATE INDEX IF NOT EXISTS idx_users_first_name ON users(first_name);

-- 4. Yorum ekle (dokümantasyon)
COMMENT ON COLUMN users.first_name IS 'Kullanıcının adı - diğer kullanıcılara gösterilir';
COMMENT ON COLUMN users.last_name IS 'Kullanıcının soyadı - gizli tutulur, sadece admin/yasal işlemler için';
COMMENT ON COLUMN users.display_name IS 'Görüntüleme adı - varsayılan olarak firstName ile aynı';
COMMENT ON COLUMN users.name IS 'DEPRECATED: Geriye uyumluluk için saklanır, yeni sistemde kullanmayın';

-- 5. Güvenlik: Row Level Security (RLS) politikası
-- Sadece kendi first_name ve display_name'ini görebilir, başkalarının last_name'ini göremez

-- Önce varolan politikaları kontrol et
DO $$ 
BEGIN
    -- last_name için özel politika: sadece kendi soyadını görebilir
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'users_last_name_privacy'
    ) THEN
        -- Bu politika last_name kolonunu korur
        -- Not: Gerçek implementasyon için Supabase RLS kurallarını kullanın
        RAISE NOTICE 'Privacy policy uyarısı: last_name kolonu için RLS politikası manuel olarak Supabase dashboard''dan eklenmelidir';
    END IF;
END $$;

-- 6. Verification: Migrate edilen veri kontrolü
DO $$ 
DECLARE
    total_users INTEGER;
    migrated_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_users FROM users;
    SELECT COUNT(*) INTO migrated_users FROM users WHERE first_name IS NOT NULL;
    
    RAISE NOTICE 'Migration Özeti:';
    RAISE NOTICE 'Toplam kullanıcı: %', total_users;
    RAISE NOTICE 'Migrate edilen: %', migrated_users;
    
    IF total_users != migrated_users THEN
        RAISE WARNING 'Bazı kullanıcılar migrate edilemedi! Manuel kontrol gerekli.';
    ELSE
        RAISE NOTICE '✅ Tüm kullanıcılar başarıyla migrate edildi!';
    END IF;
END $$;

-- 7. Rollback script (gerekirse geri alma için)
-- Aşağıdaki komutları yorum satırından çıkararak çalıştırabilirsiniz:
/*
ALTER TABLE users 
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS display_name;

DROP INDEX IF EXISTS idx_users_display_name;
DROP INDEX IF EXISTS idx_users_first_name;
*/
