-- ============================================
-- COMPLETE MISSING TABLES FOR TAKAS PLATFORM
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- NOTIFICATIONS TABLE (Push ve In-App Bildirimler)
-- =============================================================================

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

-- Sistem bildirimleri oluşturabilir
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- ADMIN USERS TABLE (Admin Yönetimi)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'moderator')),
  permissions JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id),
  last_login TIMESTAMPTZ
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Sadece admin'ler görebilir
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- FCM TOKENS TABLE (Push Notification Tokens)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON public.fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON public.fcm_tokens(token);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_active ON public.fcm_tokens(user_id, is_active) WHERE is_active = true;

-- RLS
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi token'larını yönetebilir
CREATE POLICY "Users can manage own tokens"
  ON public.fcm_tokens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- USER ACTIVITY LOG (Kullanıcı Aktivite Takibi)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.user_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_action ON public.user_activity_log(action);

-- RLS
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- Sadece admin'ler görebilir
CREATE POLICY "Admins can view activity log"
  ON public.user_activity_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- NOTIFICATION FUNCTIONS
-- =============================================================================

-- Function: Bildirim oluştur
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (p_user_id, p_title, p_message, p_type, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Okunmamış bildirim sayısı
CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unread_count
  FROM public.notifications
  WHERE user_id = p_user_id
    AND read = false;
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Tüm bildirimleri okundu işaretle
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications
  SET read = true,
      read_at = NOW()
  WHERE user_id = p_user_id
    AND read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Eski bildirimleri temizle (30 günden eski)
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND read = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- MATCH BILDIRIMI TRIGGER
-- =============================================================================

-- Yeni match olduğunda her iki kullanıcıya da bildirim gönder
CREATE OR REPLACE FUNCTION public.notify_new_match()
RETURNS TRIGGER AS $$
DECLARE
  user1_name TEXT;
  user2_name TEXT;
BEGIN
  -- Kullanıcı isimlerini al
  SELECT name INTO user1_name FROM public.users WHERE id = NEW.user1_id;
  SELECT name INTO user2_name FROM public.users WHERE id = NEW.user2_id;
  
  -- User1'e bildirim
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (
    NEW.user1_id,
    '🎉 Yeni Eşleşme!',
    user2_name || ' ile eşleştin! Hemen mesajlaşmaya başla.',
    'match',
    jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user2_id)
  );
  
  -- User2'ye bildirim
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (
    NEW.user2_id,
    '🎉 Yeni Eşleşme!',
    user1_name || ' ile eşleştin! Hemen mesajlaşmaya başla.',
    'match',
    jsonb_build_object('match_id', NEW.id, 'other_user_id', NEW.user1_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger ekle
DROP TRIGGER IF EXISTS on_match_created ON public.matches;
CREATE TRIGGER on_match_created
  AFTER INSERT ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_match();

-- =============================================================================
-- MESAJ BILDIRIMI TRIGGER
-- =============================================================================

-- Yeni mesaj geldiğinde alıcıya bildirim gönder
CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
BEGIN
  -- Gönderen kişinin ismini al
  SELECT name INTO sender_name FROM public.users WHERE id = NEW.sender_id;
  
  -- Alıcıya bildirim gönder
  INSERT INTO public.notifications (user_id, title, message, type, data)
  VALUES (
    NEW.receiver_id,
    '💬 Yeni Mesaj',
    sender_name || ': ' || LEFT(NEW.content, 50) || CASE WHEN LENGTH(NEW.content) > 50 THEN '...' ELSE '' END,
    'message',
    jsonb_build_object(
      'match_id', NEW.match_id,
      'message_id', NEW.id,
      'sender_id', NEW.sender_id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger ekle
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_message();

-- =============================================================================
-- ADMIN HELPER FUNCTIONS
-- =============================================================================

-- Function: Kullanıcıyı admin yap
CREATE OR REPLACE FUNCTION public.make_user_admin(
  p_user_id UUID,
  p_role TEXT DEFAULT 'admin',
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
BEGIN
  INSERT INTO public.admin_users (user_id, role, created_by)
  VALUES (p_user_id, p_role, COALESCE(p_created_by, auth.uid()))
  ON CONFLICT (user_id) DO UPDATE
  SET role = p_role,
      created_by = COALESCE(p_created_by, auth.uid());
  
  RETURN p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Admin kontrolü
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id UUID;
BEGIN
  check_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Platform istatistikleri
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_users_7d BIGINT,
  total_items BIGINT,
  active_items BIGINT,
  total_matches BIGINT,
  total_messages BIGINT,
  new_users_today BIGINT,
  new_items_today BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.users WHERE updated_at > NOW() - INTERVAL '7 days') as active_users_7d,
    (SELECT COUNT(*) FROM public.items) as total_items,
    (SELECT COUNT(*) FROM public.items WHERE status = 'active') as active_items,
    (SELECT COUNT(*) FROM public.matches) as total_matches,
    (SELECT COUNT(*) FROM public.messages) as total_messages,
    (SELECT COUNT(*) FROM public.users WHERE created_at > CURRENT_DATE) as new_users_today,
    (SELECT COUNT(*) FROM public.items WHERE created_at > CURRENT_DATE) as new_items_today;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- APP SETTINGS İÇİN DEFAULT DEĞERLER
-- =============================================================================

-- App settings tablosuna varsayılan değerleri ekle
INSERT INTO public.app_settings (key, value)
VALUES 
  ('app_name', 'TakasYap'),
  ('support_email', 'support@takasyap.com'),
  ('min_ios_version', '1.0.0'),
  ('min_android_version', '1.0.0'),
  ('push_enabled', 'true'),
  ('maintenance_mode', 'false'),
  ('rate_limit_per_minute', '100'),
  ('max_items_per_user', '50'),
  ('match_notification_enabled', 'true'),
  ('message_notification_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- USERS TABLOSUNA EKSIK KOLONLAR
-- =============================================================================

-- last_active kolonu ekle
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT NOW();

-- İndeks ekle
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active DESC);

-- Function: Last active güncelle
CREATE OR REPLACE FUNCTION public.update_last_active()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET last_active = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TEMIZLEME VE BAKIM FONKSİYONLARI
-- =============================================================================

-- Function: Tüm eski verileri temizle
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS TABLE (
  notifications_deleted INTEGER,
  filtered_messages_deleted INTEGER,
  illegal_attempts_deleted INTEGER
) AS $$
DECLARE
  notif_count INTEGER;
  filtered_count INTEGER;
  illegal_count INTEGER;
BEGIN
  -- Eski bildirimleri temizle
  notif_count := public.cleanup_old_notifications();
  
  -- Eski filtrelenmiş mesajları temizle
  filtered_count := public.cleanup_expired_filtered_messages();
  
  -- Eski yasadışı ürün denemelerini temizle
  illegal_count := public.cleanup_expired_illegal_attempts();
  
  RETURN QUERY SELECT notif_count, filtered_count, illegal_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Authenticated kullanıcılara fonksiyon izinleri ver
GRANT EXECUTE ON FUNCTION public.create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_unread_notification_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_last_active TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Service role'e tüm izinleri ver
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- =============================================================================
-- COMMENTS (Dokümantasyon)
-- =============================================================================

COMMENT ON TABLE public.notifications IS 'Kullanıcı bildirimleri - push ve in-app';
COMMENT ON TABLE public.admin_users IS 'Admin yetkilendirme tablosu';
COMMENT ON TABLE public.fcm_tokens IS 'Firebase Cloud Messaging token\'ları';
COMMENT ON TABLE public.user_activity_log IS 'Kullanıcı aktivite logları - audit trail';

COMMENT ON FUNCTION public.create_notification IS 'Yeni bildirim oluştur';
COMMENT ON FUNCTION public.get_unread_notification_count IS 'Okunmamış bildirim sayısını getir';
COMMENT ON FUNCTION public.cleanup_old_data IS 'Eski verileri temizle - günlük çalıştırılmalı';

-- =============================================================================
-- FİNAL NOTES
-- =============================================================================

-- Bu script çalıştırıldıktan sonra:
-- 1. Admin panelden bir kullanıcıyı admin yapın:
--    SELECT public.make_user_admin('USER_ID_HERE', 'admin');
--
-- 2. Test bildirimi gönderin:
--    SELECT public.create_notification(
--      'USER_ID_HERE',
--      'Test Bildirimi',
--      'Bu bir test mesajıdır',
--      'system'
--    );
--
-- 3. İstatistikleri kontrol edin:
--    SELECT * FROM public.get_platform_stats();
