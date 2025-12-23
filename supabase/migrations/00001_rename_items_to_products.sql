-- =====================================================
-- Items tablosunu Products'a dönüştür
-- Moderation sistemi için hazırlık
-- =====================================================

-- NOT: Bu migration idempotent olarak tasarlandı
-- Birden fazla çalıştırılabilir, hata vermez

-- 1. Items tablosunu Products olarak yeniden adlandır (eğer varsa)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'items' AND table_schema = 'public') THEN
    ALTER TABLE public.items RENAME TO products;
  END IF;
END $$;

-- 2. Owner_id'yi user_id olarak yeniden adlandır (eğer owner_id varsa)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
      AND column_name = 'owner_id' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN owner_id TO user_id;
  END IF;
END $$;

-- 3. Foreign key kontrolü ve güncelleme
DO $$
BEGIN
  -- Eski items_owner_id_fkey varsa sil
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'items_owner_id_fkey' 
      AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products DROP CONSTRAINT items_owner_id_fkey;
  END IF;
  
  -- Yeni products_user_id_fkey yoksa ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_user_id_fkey' 
      AND table_name = 'products'
  ) THEN
    ALTER TABLE public.products 
    ADD CONSTRAINT products_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. İndeksleri yeniden adlandır (eğer varlarsa)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_owner_id') THEN
    ALTER INDEX idx_items_owner_id RENAME TO idx_products_owner_id;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_status') THEN
    ALTER INDEX idx_items_status RENAME TO idx_products_status;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_category') THEN
    ALTER INDEX idx_items_category RENAME TO idx_products_category;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_created_at') THEN
    ALTER INDEX idx_items_created_at RENAME TO idx_products_created_at;
  END IF;
END $$;

-- 5. owner_id indeksini user_id'ye dönüştür
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_owner_id') THEN
    DROP INDEX idx_products_owner_id;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_user_id') THEN
    CREATE INDEX idx_products_user_id ON public.products(user_id);
  END IF;
END $$;

-- 6. RLS Politikalarını güncelle
DO $$
BEGIN
  -- Eski item politikalarını sil
  DROP POLICY IF EXISTS "Anyone can view active items" ON public.products;
  DROP POLICY IF EXISTS "Users can insert own items" ON public.products;
  DROP POLICY IF EXISTS "Users can update own items" ON public.products;
  DROP POLICY IF EXISTS "Users can delete own items" ON public.products;
  
  -- Yeni product politikalarını sil (varsa)
  DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
  DROP POLICY IF EXISTS "Users can insert own products" ON public.products;
  DROP POLICY IF EXISTS "Users can update own products" ON public.products;
  DROP POLICY IF EXISTS "Users can delete own products" ON public.products;
  
  -- Politikaları yeniden oluştur
  CREATE POLICY "Anyone can view active products" ON public.products 
    FOR SELECT USING (status = 'active');

  CREATE POLICY "Users can insert own products" ON public.products 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own products" ON public.products 
    FOR UPDATE USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete own products" ON public.products 
    FOR DELETE USING (auth.uid() = user_id);
END $$;

-- =====================================================
-- Migration Tamamlandı ✅
-- Artık moderation migration'ını çalıştırabilirsiniz
-- =====================================================
