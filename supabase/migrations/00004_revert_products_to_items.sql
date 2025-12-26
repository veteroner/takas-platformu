-- =====================================================
-- Products tablosunu Items'a geri döndür
-- HIZLI ÇÖZÜM: Kodda items kullanıldığı için
-- =====================================================

-- 1. Products tablosunu Items olarak yeniden adlandır
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'products' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.products RENAME TO items;
    RAISE NOTICE 'Products tablosu items olarak yeniden adlandırıldı';
  ELSE
    RAISE NOTICE 'Products tablosu bulunamadı, zaten items olabilir';
  END IF;
END $$;

-- 2. user_id'yi owner_id olarak geri döndür (eğer user_id varsa)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'items' 
      AND column_name = 'user_id' 
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.items RENAME COLUMN user_id TO owner_id;
    RAISE NOTICE 'user_id owner_id olarak yeniden adlandırıldı';
  END IF;
END $$;

-- 3. Foreign key kontrolü ve güncelleme
DO $$
BEGIN
  -- Eski products_user_id_fkey varsa sil
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_user_id_fkey' 
      AND table_name = 'items'
  ) THEN
    ALTER TABLE public.items DROP CONSTRAINT products_user_id_fkey;
    RAISE NOTICE 'products_user_id_fkey constraint silindi';
  END IF;
  
  -- Yeni items_owner_id_fkey yoksa ekle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'items_owner_id_fkey' 
      AND table_name = 'items'
  ) THEN
    ALTER TABLE public.items 
    ADD CONSTRAINT items_owner_id_fkey 
    FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'items_owner_id_fkey constraint eklendi';
  END IF;
END $$;

-- 4. Index'leri güncelle
DO $$
BEGIN
  -- Eski index'leri sil
  DROP INDEX IF EXISTS idx_products_user_id;
  DROP INDEX IF EXISTS idx_products_status;
  DROP INDEX IF EXISTS idx_products_category;
  DROP INDEX IF EXISTS idx_products_created_at;
  
  -- Yeni index'leri oluştur (yoksa)
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_items_owner_id'
  ) THEN
    CREATE INDEX idx_items_owner_id ON public.items(owner_id);
    RAISE NOTICE 'idx_items_owner_id oluşturuldu';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_items_status'
  ) THEN
    CREATE INDEX idx_items_status ON public.items(status);
    RAISE NOTICE 'idx_items_status oluşturuldu';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_items_category'
  ) THEN
    CREATE INDEX idx_items_category ON public.items(category);
    RAISE NOTICE 'idx_items_category oluşturuldu';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_items_created_at'
  ) THEN
    CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
    RAISE NOTICE 'idx_items_created_at oluşturuldu';
  END IF;
END $$;

-- 5. RLS Policies'i güncelle
DO $$
BEGIN
  -- Eski policy'leri sil (varsa)
  DROP POLICY IF EXISTS "Anyone can view active products" ON public.items;
  DROP POLICY IF EXISTS "Users can insert own products" ON public.items;
  DROP POLICY IF EXISTS "Users can update own products" ON public.items;
  DROP POLICY IF EXISTS "Users can delete own products" ON public.items;
  
  -- Yeni policy'leri oluştur
  CREATE POLICY "Anyone can view active items" 
    ON public.items FOR SELECT 
    USING (status = 'active');
  
  CREATE POLICY "Users can insert own items" 
    ON public.items FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);
  
  CREATE POLICY "Users can update own items" 
    ON public.items FOR UPDATE 
    USING (auth.uid() = owner_id);
  
  CREATE POLICY "Users can delete own items" 
    ON public.items FOR DELETE 
    USING (auth.uid() = owner_id);
  
  RAISE NOTICE 'RLS policies güncellendi';
END $$;

-- 6. Foreign key'leri kontrol et (diğer tablolarda)
DO $$
BEGIN
  -- swipes tablosundaki foreign key
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name LIKE '%swipes%product%'
  ) THEN
    ALTER TABLE public.swipes DROP CONSTRAINT IF EXISTS swipes_product_id_fkey;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'swipes_item_id_fkey'
    ) THEN
      ALTER TABLE public.swipes 
      ADD CONSTRAINT swipes_item_id_fkey 
      FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;
    END IF;
  END IF;
  
  -- matches tablosundaki foreign key'ler
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'matches' 
      AND column_name LIKE 'product%_id'
  ) THEN
    -- product1_id ve product2_id varsa item1_id ve item2_id olarak değiştir
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'matches' 
        AND column_name = 'product1_id'
    ) THEN
      ALTER TABLE public.matches RENAME COLUMN product1_id TO item1_id;
    END IF;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'matches' 
        AND column_name = 'product2_id'
    ) THEN
      ALTER TABLE public.matches RENAME COLUMN product2_id TO item2_id;
    END IF;
  END IF;
END $$;

-- Başarı mesajı
DO $$
BEGIN
  RAISE NOTICE '✅ Migration tamamlandı: products → items';
  RAISE NOTICE '✅ owner_id geri yüklendi';
  RAISE NOTICE '✅ Tüm foreign key''ler güncellendi';
  RAISE NOTICE '✅ Index''ler yeniden oluşturuldu';
  RAISE NOTICE '✅ RLS policies güncellendi';
END $$;
