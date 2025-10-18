-- ============================================
-- SADECE NOTIFICATIONS TABLOSU OLUŞTUR
-- Supabase SQL Editor'da çalıştırın
-- ============================================

-- Notifications tablosu
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'system',        -- Sistem bildirimleri
    'match',         -- Yeni eşleşme
    'message',       -- Yeni mesaj
    'like',          -- Beğeni bildirimi
    'trade',         -- Takas talebi
    'warning',       -- Uyarı
    'announcement'   -- Genel duyuru
  )),
  data JSONB,        -- Ek bilgiler (match_id, message_id, etc.)
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  
  -- Push notification bilgileri
  sent_push BOOLEAN DEFAULT FALSE,
  push_sent_at TIMESTAMPTZ,
  push_error TEXT
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcı kendi bildirimlerini güncelleyebilir (read durumu)
CREATE POLICY "Users can update own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sistem bildirimleri oluşturabilir (herkes - çünkü admin panelden gönderiyoruz)
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Kullanıcılar kendi bildirimlerini silebilir
CREATE POLICY "Users can delete own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TEST
-- ============================================
-- Tablo oluşturulduktan sonra bunu çalıştırarak test edin:
-- SELECT * FROM public.notifications LIMIT 1;
