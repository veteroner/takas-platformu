-- ============================================
-- KONTROL SORGUSU: Tablolar var mı?
-- ============================================
-- Önce bunu çalıştır - hangi tabloların var olduğunu görelim

-- 1. user_reports tablosu var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_reports'
) as user_reports_exists;

-- 2. user_blocks tablosu var mı?
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_blocks'
) as user_blocks_exists;

-- 3. Hangi fonksiyonlar var?
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%report%' OR routine_name LIKE '%block%'
ORDER BY routine_name;
