-- ============================================
-- SADECE TABLOLAR: user_blocks ve user_reports
-- ============================================
-- Önce tabloları oluştur, sonra fonksiyonları ekle

-- 1. Kullanıcı Engelleme Tablosu
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- 2. Kullanıcı Şikayetleri Tablosu
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

-- 3. İndeksler
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker_id ON public.user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked_id ON public.user_blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter_id ON public.user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_id ON public.user_reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON public.user_reports(created_at DESC);

-- 4. RLS Aktif Et
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can view own blocks" ON public.user_blocks;
CREATE POLICY "Users can view own blocks"
  ON public.user_blocks FOR SELECT
  USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can create blocks" ON public.user_blocks;
CREATE POLICY "Users can create blocks"
  ON public.user_blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can remove own blocks" ON public.user_blocks;
CREATE POLICY "Users can remove own blocks"
  ON public.user_blocks FOR DELETE
  USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can view own reports" ON public.user_reports;
CREATE POLICY "Users can view own reports"
  ON public.user_reports FOR SELECT
  USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can create reports" ON public.user_reports;
CREATE POLICY "Users can create reports"
  ON public.user_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- ✅ Tablolar hazır!
