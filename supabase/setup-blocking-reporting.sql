-- ============================================
-- SUPABASE SQL SETUP - ENGELLEME VE ŞİKAYET SİSTEMİ
-- ============================================
-- Bu SQL dosyasını Supabase Dashboard > SQL Editor'de çalıştırın
-- URL: https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/sql/new

-- ============================================
-- 1. TABLOLAR (Users ve diğer temel tablolar zaten var varsayımıyla)
-- ============================================

-- Kullanıcı Engelleme Tablosu
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Kullanıcı Şikayetleri Tablosu
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('harassment', 'threat', 'spam', 'inappropriate', 'scam', 'other')),
  description TEXT NOT NULL,
  evidence JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. İNDEKSLER
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker_id ON public.user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_id ON public.user_blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter_id ON public.user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_id ON public.user_reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON public.user_reports(created_at DESC);

-- ============================================
-- 3. RLS (Row Level Security)
-- ============================================

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- User Blocks Policies
DROP POLICY IF EXISTS "Users can view own blocks" ON public.user_blocks;
CREATE POLICY "Users can view own blocks"
  ON public.user_blocks
  FOR SELECT
  USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can create blocks" ON public.user_blocks;
CREATE POLICY "Users can create blocks"
  ON public.user_blocks
  FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can remove own blocks" ON public.user_blocks;
CREATE POLICY "Users can remove own blocks"
  ON public.user_blocks
  FOR DELETE
  USING (auth.uid() = blocker_id);

-- User Reports Policies
DROP POLICY IF EXISTS "Users can view own reports" ON public.user_reports;
CREATE POLICY "Users can view own reports"
  ON public.user_reports
  FOR SELECT
  USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can create reports" ON public.user_reports;
CREATE POLICY "Users can create reports"
  ON public.user_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- 4. FONKSİYONLAR
-- ============================================

-- Function 1: Kullanıcı engellenmiş mi kontrol et
CREATE OR REPLACE FUNCTION public.is_user_blocked(
  p_user1_id UUID,
  p_user2_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_blocks
    WHERE (blocker_id = p_user1_id AND blocked_id = p_user2_id)
       OR (blocker_id = p_user2_id AND blocked_id = p_user1_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Kullanıcıyı engelle
CREATE OR REPLACE FUNCTION public.block_user(
  p_blocker_id UUID,
  p_blocked_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  block_id UUID;
BEGIN
  -- Kendini engellemeyi önle
  IF p_blocker_id = p_blocked_id THEN
    RAISE EXCEPTION 'Cannot block yourself';
  END IF;

  -- Engelleme kaydı oluştur
  INSERT INTO public.user_blocks (blocker_id, blocked_id, reason)
  VALUES (p_blocker_id, p_blocked_id, p_reason)
  ON CONFLICT (blocker_id, blocked_id) DO NOTHING
  RETURNING id INTO block_id;

  -- Aktif match'leri kapat
  UPDATE public.matches
  SET status = 'rejected',
      updated_at = NOW()
  WHERE (user1_id = p_blocker_id AND user2_id = p_blocked_id)
     OR (user1_id = p_blocked_id AND user2_id = p_blocker_id)
     AND status IN ('pending', 'accepted');

  RETURN block_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Engellenmiş kullanıcıları listele
CREATE OR REPLACE FUNCTION public.get_blocked_users(p_user_id UUID)
RETURNS TABLE (
  block_id UUID,
  blocked_user_id UUID,
  blocked_user_name TEXT,
  blocked_user_avatar TEXT,
  reason TEXT,
  blocked_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ub.id,
    u.id,
    u.name,
    u.avatar_url,
    ub.reason,
    ub.created_at
  FROM public.user_blocks ub
  JOIN public.users u ON u.id = ub.blocked_id
  WHERE ub.blocker_id = p_user_id
  ORDER BY ub.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Okunmamış mesaj sayısı
CREATE OR REPLACE FUNCTION public.get_unread_message_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.messages m
    JOIN public.matches mt ON mt.id = m.match_id
    WHERE (mt.user1_id = p_user_id OR mt.user2_id = p_user_id)
      AND m.sender_id != p_user_id
      AND m.read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 5: Match başına okunmamış mesaj sayısı
CREATE OR REPLACE FUNCTION public.get_unread_by_match(p_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.match_id,
    COUNT(*)::BIGINT
  FROM public.messages m
  JOIN public.matches mt ON mt.id = m.match_id
  WHERE (mt.user1_id = p_user_id OR mt.user2_id = p_user_id)
    AND m.sender_id != p_user_id
    AND m.read_at IS NULL
  GROUP BY m.match_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 6: Kullanıcı şikayeti oluştur
CREATE OR REPLACE FUNCTION public.create_user_report(
  p_reporter_id UUID,
  p_reported_id UUID,
  p_report_type TEXT,
  p_description TEXT,
  p_evidence JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  report_id UUID;
BEGIN
  -- Kendini şikayet etmeyi önle
  IF p_reporter_id = p_reported_id THEN
    RAISE EXCEPTION 'Cannot report yourself';
  END IF;

  -- Şikayet kaydı oluştur
  INSERT INTO public.user_reports (
    reporter_id, reported_id, report_type, description, evidence
  )
  VALUES (
    p_reporter_id, p_reported_id, p_report_type, p_description, p_evidence
  )
  RETURNING id INTO report_id;

  RETURN report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 7: Şikayet istatistikleri (Admin için)
CREATE OR REPLACE FUNCTION public.get_report_statistics(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_reports BIGINT,
  pending_reports BIGINT,
  investigating_reports BIGINT,
  resolved_reports BIGINT,
  dismissed_reports BIGINT,
  by_type JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH report_counts AS (
    SELECT 
      COUNT(*)::BIGINT as total,
      COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending,
      COUNT(*) FILTER (WHERE status = 'investigating')::BIGINT as investigating,
      COUNT(*) FILTER (WHERE status = 'resolved')::BIGINT as resolved,
      COUNT(*) FILTER (WHERE status = 'dismissed')::BIGINT as dismissed
    FROM public.user_reports
    WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
  ),
  type_counts AS (
    SELECT jsonb_object_agg(report_type, type_count) as types
    FROM (
      SELECT report_type, COUNT(*)::BIGINT as type_count
      FROM public.user_reports
      WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
      GROUP BY report_type
    ) t
  )
  SELECT 
    COALESCE(rc.total, 0),
    COALESCE(rc.pending, 0),
    COALESCE(rc.investigating, 0),
    COALESCE(rc.resolved, 0),
    COALESCE(rc.dismissed, 0),
    COALESCE(tc.types, '{}'::jsonb)
  FROM report_counts rc
  CROSS JOIN type_counts tc;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 8: Mesaj okuma zamanı güncelle (trigger için)
CREATE OR REPLACE FUNCTION public.update_message_read_time()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Mesaj okuma zamanı
DROP TRIGGER IF EXISTS set_message_read_time ON public.messages;
CREATE TRIGGER set_message_read_time
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_message_read_time();

-- ============================================
-- 5. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION public.is_user_blocked(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.block_user(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_blocked_users(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_message_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_by_match(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_report(UUID, UUID, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_report_statistics(INTEGER) TO authenticated;

-- ============================================
-- ✅ KURULUM TAMAMLANDI!
-- ============================================

-- Kontrol sorguları:
-- SELECT * FROM public.user_blocks;
-- SELECT * FROM public.user_reports;
-- SELECT public.get_report_statistics(30);
