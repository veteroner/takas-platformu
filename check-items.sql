-- Supabase SQL Editor'a yapıştır
SELECT 
  id,
  title,
  owner_id,
  status,
  created_at
FROM items
ORDER BY created_at DESC;
