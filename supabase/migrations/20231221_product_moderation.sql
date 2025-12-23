-- =====================================================
-- Apple Moderasyon Sistemi - Database Migration
-- Oluşturma Tarihi: 21 Aralık 2025
-- Amaç: Kullanıcı tarafından oluşturulan içerik moderasyonu
-- =====================================================

-- 1. Products tablosuna status kolonları ekle
-- =====================================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed', 'pending')),
ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS removal_reason TEXT;

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_removed_at ON products(removed_at) WHERE removed_at IS NOT NULL;

COMMENT ON COLUMN products.status IS 'Ürün durumu: active=aktif, sold=satıldı, removed=kaldırıldı, pending=onay bekliyor';
COMMENT ON COLUMN products.removal_reason IS 'Kaldırma nedeni: auto_moderation, admin_action, user_request';


-- 2. Ürün Şikayetleri Tablosu
-- =====================================================

CREATE TABLE IF NOT EXISTS product_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'inappropriate_content',  -- Uygunsuz içerik
    'illegal_item',          -- Yasadışı ürün
    'scam',                  -- Dolandırıcılık
    'fake_item',             -- Sahte ürün
    'spam',                  -- Spam
    'other'                  -- Diğer
  )),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',               -- Beklemede
    'auto_removed',          -- Otomatik kaldırıldı
    'dismissed'              -- Reddedildi
  )),
  auto_removed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Aynı kullanıcı aynı ürünü sadece 1 kez şikayet edebilir
  CONSTRAINT unique_product_reporter UNIQUE(product_id, reporter_id)
);

-- İndeksler
CREATE INDEX idx_product_reports_product ON product_reports(product_id);
CREATE INDEX idx_product_reports_reporter ON product_reports(reporter_id);
CREATE INDEX idx_product_reports_status ON product_reports(status);
CREATE INDEX idx_product_reports_created ON product_reports(created_at DESC);

COMMENT ON TABLE product_reports IS 'Kullanıcıların ürünler hakkında yaptığı şikayetler';


-- 3. Kaldırılan Ürünler Log Tablosu
-- =====================================================

CREATE TABLE IF NOT EXISTS removed_products_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  product_owner_id UUID NOT NULL REFERENCES users(id),
  removal_reason TEXT NOT NULL CHECK (removal_reason IN (
    'auto_threshold',    -- Otomatik threshold (3+ şikayet)
    'illegal_content',   -- Yasadışı içerik filtresi
    'admin_action',      -- Admin aksiyonu
    'user_request'       -- Kullanıcı isteği
  )),
  report_count INTEGER DEFAULT 0,
  removed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  product_data JSONB,  -- Ürün snapshot (daha sonra gözden geçirmek için)
  restored_at TIMESTAMPTZ,
  restoration_reason TEXT
);

-- İndeksler
CREATE INDEX idx_removed_products_product ON removed_products_log(product_id);
CREATE INDEX idx_removed_products_owner ON removed_products_log(product_owner_id);
CREATE INDEX idx_removed_products_removed_at ON removed_products_log(removed_at DESC);
CREATE INDEX idx_removed_products_reason ON removed_products_log(removal_reason);

COMMENT ON TABLE removed_products_log IS 'Kaldırılan ürünlerin tarihçesi ve nedenleri';


-- 4. Row Level Security (RLS) Politikaları
-- =====================================================

ALTER TABLE product_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE removed_products_log ENABLE ROW LEVEL SECURITY;

-- Product Reports RLS Politikaları
-- Kullanıcılar kendi şikayetlerini görebilir
CREATE POLICY "Users can view own reports" ON product_reports
  FOR SELECT
  USING (auth.uid()::text = reporter_id::text);

-- Kullanıcılar şikayet oluşturabilir
CREATE POLICY "Users can create reports" ON product_reports
  FOR INSERT
  WITH CHECK (auth.uid()::text = reporter_id::text);

-- Ürün sahipleri kendi ürünlerine yapılan şikayetleri görebilir
CREATE POLICY "Product owners can view reports on their products" ON product_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_reports.product_id
        AND products.user_id::text = auth.uid()::text
    )
  );

-- Removed Products Log RLS Politikaları
-- Kullanıcılar kendi ürünlerinin loglarını görebilir
CREATE POLICY "Users can view own product removal logs" ON removed_products_log
  FOR SELECT
  USING (auth.uid()::text = product_owner_id::text);


-- 5. Otomatik Threshold Kontrolü Fonksiyonu
-- =====================================================

CREATE OR REPLACE FUNCTION check_product_reports_threshold()
RETURNS TRIGGER AS $$
DECLARE
  report_count INTEGER;
  threshold INTEGER;
  product_owner_id UUID;
  product_title TEXT;
  product_snapshot JSONB;
BEGIN
  -- Threshold değerini app_settings tablosundan al, yoksa default 3 kullan
  SELECT value::integer INTO threshold
  FROM app_settings
  WHERE key = 'auto_moderation_threshold'
  LIMIT 1;
  
  -- Eğer ayar bulunamazsa default değer kullan
  threshold := COALESCE(threshold, 3);
  
  -- Ürün için bekleyen toplam UNIQUE şikayet sayısını al
  SELECT COUNT(DISTINCT reporter_id) INTO report_count
  FROM product_reports
  WHERE product_id = NEW.product_id 
    AND status = 'pending';
  
  -- Threshold aşıldıysa
  IF report_count >= threshold THEN
    -- Ürün bilgilerini al
    SELECT 
      COALESCE(user_id, owner_id) as owner_id, 
      title, 
      row_to_json(products.*) 
    INus, product_snapshot
    FROM products
    WHERE id = NEW.product_id;
    
    -- Eğer ürün zaten kaldırılmışsa, tekrar işlem yapma
    IF EXISTS (
      SELECT 1 FROM products 
      WHERE id = NEW.product_id 
        AND status = 'removed'
    ) THEN
      RETURN NEW;
    END IF;
    
    -- Ürünü "removed" olarak işaretle
    UPDATE products
    SET 
      status = 'removed',
      removed_at = NOW(),
      removal_reason = 'auto_moderation'
    WHERE id = NEW.product_id;
    
    -- Tüm bekleyen raporları "auto_removed" olarak güncelle
    UPDATE product_reports
    SET 
      status = 'auto_removed',
      auto_removed_at = NOW()
    WHERE product_id = NEW.product_id 
      AND status = 'pending';
    
    -- Kaldırma işlemini logla
    INSERT INTO removed_products_log (
      product_id,
      product_owner_id,
      removal_reason,
      report_count,
      product_data
    ) VALUES (
      NEW.product_id,
      product_owner_id,
      'auto_threshold',
      report_count,
      product_snapshot
    );
    
    -- Kullanıcıya bildirim gönder
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      data,
      read,
      created_at
    ) VALUES (
      product_owner_id,
      'product_removed',
      'Ürününüz Kaldırıldı',
      format('"%s" adlı ürününüz, %s kullanıcı şikayeti nedeniyle otomatik olarak kaldırıldı. Detaylar için ayarlar sayfasını ziyaret edin.', product_title, report_count),
      jsonb_build_object(
        'product_id', NEW.product_id, 
        'report_count', report_count,
        'removal_reason', 'auto_moderation'
      ),
      false,
      NOW()
    );
    
    RAISE NOTICE 'Product % auto-removed after % reports', NEW.product_id, report_count;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_product_reports_threshold() IS 'Ürün şikayet sayısı threshold aştığında otomatik kaldırır';


-- 6. Trigger Oluştur
-- =====================================================

DROP TRIGGER IF EXISTS trigger_check_product_reports ON product_reports;
CREATE TRIGGER trigger_check_product_reports
AFTER INSERT ON product_reports
FOR EACH ROW
EXECUTE FUNCTION check_product_reports_threshold();


-- 7. Admin Bildirim Fonksiyonu (Opsiyonel)
-- =====================================================

CREATE OR REPLACE FUNCTION notify_admin_product_removed()
RETURNS TRIGGER AS $$
BEGIN
  -- Log mesajı (webhook entegrasyonu için hazır)
  RAISE NOTICE 'Admin notification: Product % removed with % reports', NEW.product_id, NEW.report_count;
  
  -- Gelecekte webhook entegrasyonu buraya eklenebilir:
  -- PERFORM net.http_post(
  --   url := 'YOUR_WEBHOOK_URL',
  --   headers := '{"Content-Type": "application/json"}'::jsonb,
  --   body := jsonb_build_object(
  --     'event', 'product_auto_removed',
  --     'product_id', NEW.product_id,
  --     'report_count', NEW.report_count,
  --     'removed_at', NEW.removed_at
  --   )
  -- );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION notify_admin_product_removed() IS 'Admin bildirimi gönderir (webhook/email)';

-- Trigger
DROP TRIGGER IF EXISTS trigger_notify_admin ON removed_products_log;
CREATE TRIGGER trigger_notify_admin
AFTER INSERT ON removed_products_log
FOR EACH ROW
WHEN (NEW.removal_reason IN ('auto_threshold', 'illegal_content'))
EXECUTE FUNCTION notify_admin_product_removed();


-- =====================================================
-- Migration Tamamlandı ✅
-- =====================================================
-- 
-- Özet:
-- ✅ Products tablosuna status kolonları eklendi
-- ✅ product_reports tablosu oluşturuldu
-- ✅ removed_products_log tablosu oluşturuldu
-- ✅ RLS politikaları ayarlandı
-- ✅ Otomatik threshold fonksiyonu eklendi
-- ✅ Trigger'lar oluşturuldu
-- ✅ Admin bildirim sistemi hazır
--
-- Sonraki Adım: Backend API endpoint'leri oluştur
-- =====================================================
