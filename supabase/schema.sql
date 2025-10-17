-- Takas Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  rating DECIMAL(3,2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0
);

-- Items table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clothing', 'toys', 'electronics', 'books', 'sports', 'home', 'other')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  estimated_value INTEGER,
  images TEXT[] NOT NULL DEFAULT '{}',
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'traded', 'deleted')),
  location TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- Swipes table (tracks user swipes)
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- Matches table (when two users swipe right on each other's items)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item1_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  item2_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user1_id < user2_id) -- Ensure unique match pair
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_items_owner_id ON public.items(owner_id);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX idx_swipes_user_id ON public.swipes(user_id);
CREATE INDEX idx_swipes_item_id ON public.swipes(item_id);
CREATE INDEX idx_matches_users ON public.matches(user1_id, user2_id);
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Anyone can view active items" ON public.items FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert own items" ON public.items FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own items" ON public.items FOR DELETE USING (auth.uid() = owner_id);

-- Swipes policies
CREATE POLICY "Users can view own swipes" ON public.swipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own swipes" ON public.swipes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "System can create matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own matches" ON public.matches FOR UPDATE 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON public.messages FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Seeking Preferences (store user's matching preferences)
CREATE TABLE IF NOT EXISTS public.seeking_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  value_min INTEGER,
  value_max INTEGER,
  location_city TEXT,
  filters JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.seeking_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own seeking prefs" ON public.seeking_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own seeking prefs" ON public.seeking_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own seeking prefs" ON public.seeking_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_seeking_prefs_user ON public.seeking_preferences(user_id);

-- Functions

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check for matches after swipe
CREATE OR REPLACE FUNCTION public.check_for_match()
RETURNS TRIGGER AS $$
DECLARE
  other_item_id UUID;
  other_user_id UUID;
  match_exists BOOLEAN;
BEGIN
  -- Only process right swipes
  IF NEW.direction = 'right' THEN
    -- Get the item owner
    SELECT owner_id INTO other_user_id 
    FROM public.items 
    WHERE id = NEW.item_id;
    
    -- Check if other user has swiped right on any of current user's items
    SELECT EXISTS (
      SELECT 1 
      FROM public.swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id 
        AND s.direction = 'right'
        AND i.owner_id = NEW.user_id
    ) INTO match_exists;
    
    -- If match exists, create match record
    IF match_exists THEN
      -- Get the item that was swiped right
      SELECT s.item_id INTO other_item_id
      FROM public.swipes s
      INNER JOIN public.items i ON s.item_id = i.id
      WHERE s.user_id = other_user_id 
        AND s.direction = 'right'
        AND i.owner_id = NEW.user_id
      LIMIT 1;
      
      -- Create match (ensure user1_id < user2_id for uniqueness)
      INSERT INTO public.matches (user1_id, user2_id, item1_id, item2_id)
      VALUES (
        LEAST(NEW.user_id, other_user_id),
        GREATEST(NEW.user_id, other_user_id),
        CASE WHEN NEW.user_id < other_user_id THEN other_item_id ELSE NEW.item_id END,
        CASE WHEN NEW.user_id < other_user_id THEN NEW.item_id ELSE other_item_id END
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to check for matches
CREATE TRIGGER on_swipe_created
  AFTER INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION public.check_for_match();

-- Function to update item view count
CREATE OR REPLACE FUNCTION public.increment_item_views(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.items 
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Consents table to log policy acceptances
CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_key TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip INET,
  user_agent TEXT
);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own consents" ON public.consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents" ON public.consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Simple key/value settings for required policy versions
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text primary key,
  value text not null
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_prefs (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('hourly','daily')),
  categories TEXT[] DEFAULT NULL, -- null => tüm kategoriler
  last_digest_at TIMESTAMPTZ
);

ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notif prefs" ON public.notification_prefs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own notif prefs" ON public.notification_prefs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notif prefs" ON public.notification_prefs
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- PROFANITY FILTER & MODERATION SYSTEM
-- ============================================

-- User violations table (tracks profanity/harassment violations)
CREATE TABLE IF NOT EXISTS public.user_violations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('severe', 'moderate', 'hate')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  content TEXT NOT NULL, -- Original message content (encrypted)
  detected_words TEXT[], -- Words that triggered the filter
  action_taken TEXT NOT NULL CHECK (action_taken IN ('warning', 'ban', 'permanent_ban')),
  ban_until TIMESTAMPTZ, -- When the ban expires (NULL for warnings)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  context JSONB -- Additional context (match_id, etc.)
);

-- Filtered messages log (KVKK compliance - 6 months retention)
CREATE TABLE IF NOT EXISTS public.filtered_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  original_content TEXT NOT NULL, -- Encrypted
  filtered_content TEXT, -- Sanitized version if applicable
  detected_words TEXT[],
  severity TEXT NOT NULL,
  blocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '6 months') -- Auto-delete after 6 months
);

-- User chat ban status (quick lookup for active bans)
CREATE TABLE IF NOT EXISTS public.user_chat_bans (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  banned_until TIMESTAMPTZ NOT NULL,
  ban_count INTEGER DEFAULT 1,
  last_violation_at TIMESTAMPTZ DEFAULT NOW(),
  total_violations INTEGER DEFAULT 1,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_violations_user_id ON public.user_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_violations_created_at ON public.user_violations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_filtered_messages_user_id ON public.filtered_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_filtered_messages_expires_at ON public.filtered_messages(expires_at);
CREATE INDEX IF NOT EXISTS idx_chat_bans_user_id ON public.user_chat_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_bans_banned_until ON public.user_chat_bans(banned_until);

-- RLS Policies
ALTER TABLE public.user_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filtered_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_bans ENABLE ROW LEVEL SECURITY;

-- Only admins can view violations (add admin role check later)
CREATE POLICY "Service role can manage violations" ON public.user_violations
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Users can check their own ban status
CREATE POLICY "Users can view own ban status" ON public.user_chat_bans
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage bans
CREATE POLICY "Service role can manage bans" ON public.user_chat_bans
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Service role can manage filtered messages
CREATE POLICY "Service role can manage filtered messages" ON public.filtered_messages
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Function to check if user is banned from chatting
CREATE OR REPLACE FUNCTION public.is_user_chat_banned(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  ban_record RECORD;
BEGIN
  SELECT * INTO ban_record
  FROM public.user_chat_bans
  WHERE user_id = check_user_id
    AND banned_until > NOW();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's violation count
CREATE OR REPLACE FUNCTION public.get_user_violation_count(check_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  violation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO violation_count
  FROM public.user_violations
  WHERE user_id = check_user_id
    AND created_at > NOW() - INTERVAL '30 days'; -- Last 30 days
  
  RETURN COALESCE(violation_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a violation and apply ban if needed
CREATE OR REPLACE FUNCTION public.record_violation(
  p_user_id UUID,
  p_violation_type TEXT,
  p_severity TEXT,
  p_content TEXT,
  p_detected_words TEXT[],
  p_action_taken TEXT,
  p_ban_until TIMESTAMPTZ,
  p_context JSONB
)
RETURNS UUID AS $$
DECLARE
  violation_id UUID;
BEGIN
  -- Insert violation record
  INSERT INTO public.user_violations (
    user_id, violation_type, severity, content, 
    detected_words, action_taken, ban_until, context
  )
  VALUES (
    p_user_id, p_violation_type, p_severity, p_content,
    p_detected_words, p_action_taken, p_ban_until, p_context
  )
  RETURNING id INTO violation_id;
  
  -- Update or create ban record if applicable
  IF p_ban_until IS NOT NULL THEN
    INSERT INTO public.user_chat_bans (
      user_id, banned_until, reason, total_violations
    )
    VALUES (
      p_user_id, p_ban_until, p_action_taken, 1
    )
    ON CONFLICT (user_id) DO UPDATE SET
      banned_until = GREATEST(public.user_chat_bans.banned_until, p_ban_until),
      ban_count = public.user_chat_bans.ban_count + 1,
      total_violations = public.user_chat_bans.total_violations + 1,
      last_violation_at = NOW(),
      reason = p_action_taken,
      updated_at = NOW();
  END IF;
  
  RETURN violation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-delete expired filtered messages (KVKK compliance)
CREATE OR REPLACE FUNCTION public.cleanup_expired_filtered_messages()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.filtered_messages
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Scheduled job to cleanup expired messages (run daily)
-- Note: This requires pg_cron extension in Supabase
-- Alternatively, can be triggered by Edge Function
CREATE OR REPLACE FUNCTION public.schedule_cleanup_filtered_messages()
RETURNS void AS $$
BEGIN
  PERFORM public.cleanup_expired_filtered_messages();
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- YASADIŞI ÜRÜN FİLTRELEME SİSTEMİ
-- =============================================================================
-- Bu bölüm ürün yükleme sırasında yasadışı içerik girişimlerini loglar
-- Yasal uyum ve güvenlik amacıyla 1 yıl saklanır

-- Yasadışı ürün girişim logları
CREATE TABLE IF NOT EXISTS public.illegal_product_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  detected_words JSONB NOT NULL DEFAULT '[]',
  categories TEXT[] NOT NULL DEFAULT '{}',
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year')
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_user_id ON public.illegal_product_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_created_at ON public.illegal_product_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_risk_level ON public.illegal_product_attempts(risk_level);
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_categories ON public.illegal_product_attempts USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_expires_at ON public.illegal_product_attempts(expires_at);

-- RLS (Row Level Security)
ALTER TABLE public.illegal_product_attempts ENABLE ROW LEVEL SECURITY;

-- Sadece admin görebilir
CREATE POLICY "Admin can view illegal attempts"
  ON public.illegal_product_attempts
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sistem tarafından insert edilebilir
CREATE POLICY "System can insert illegal attempts"
  ON public.illegal_product_attempts
  FOR INSERT
  WITH CHECK (true);

-- Function: Süresi dolan logları temizle (KVKK uyumlu)
CREATE OR REPLACE FUNCTION public.cleanup_expired_illegal_attempts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.illegal_product_attempts
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup action
  RAISE NOTICE 'Deleted % expired illegal product attempt records', deleted_count;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: İstatistikler (Admin dashboard için)
CREATE OR REPLACE FUNCTION public.get_illegal_product_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_attempts BIGINT,
  critical_attempts BIGINT,
  high_risk_attempts BIGINT,
  unique_users BIGINT,
  top_categories TEXT[],
  attempts_by_day JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE risk_level = 'critical') as critical,
      COUNT(*) FILTER (WHERE risk_level = 'high') as high_risk,
      COUNT(DISTINCT user_id) as unique_users
    FROM public.illegal_product_attempts
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
  ),
  category_stats AS (
    SELECT ARRAY_AGG(DISTINCT cat ORDER BY COUNT(*) DESC) as cats
    FROM public.illegal_product_attempts,
    LATERAL UNNEST(categories) as cat
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY cat
    LIMIT 5
  ),
  daily_stats AS (
    SELECT jsonb_object_agg(
      date::TEXT,
      count
    ) as by_day
    FROM (
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM public.illegal_product_attempts
      WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ) daily
  )
  SELECT
    s.total,
    s.critical,
    s.high_risk,
    s.unique_users,
    c.cats,
    d.by_day
  FROM stats s, category_stats c, daily_stats d;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Scheduled cleanup job çağrısı (günlük)
CREATE OR REPLACE FUNCTION public.schedule_cleanup_illegal_attempts()
RETURNS void AS $$
BEGIN
  PERFORM public.cleanup_expired_illegal_attempts();
END;
$$ LANGUAGE plpgsql;

-- Yorum: Otomatik temizleme için Supabase Edge Function kullanılabilir
-- Örnek: Her gece 03:00'te çalışacak şekilde yapılandırılabilir

-- =============================================================================
-- KULLANICI ENGELLEME VE ŞİKAYET SİSTEMİ
-- =============================================================================

-- Kullanıcı engelleme tablosu
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id) -- Kullanıcı kendini engelleyemez
);

-- Kullanıcı şikayetleri tablosu
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'harassment', 'threat', 'spam', 'inappropriate', 'scam', 'other'
  )),
  description TEXT NOT NULL,
  evidence JSONB, -- Screenshots, message IDs, etc.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'investigating', 'resolved', 'dismissed'
  )),
  admin_notes TEXT,
  resolved_by UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mesaj okuma durumu (message read receipts)
-- Messages tablosuna 'read' kolonu zaten var, ek index ekleyelim
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(receiver_id, read) WHERE read = false;

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON public.user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON public.user_blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter ON public.user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported ON public.user_reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status);
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON public.user_reports(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi engellemelerini görebilir
CREATE POLICY "Users can view own blocks"
  ON public.user_blocks
  FOR SELECT
  USING (auth.uid() = blocker_id);

-- Kullanıcı engelleme yapabilir
CREATE POLICY "Users can create blocks"
  ON public.user_blocks
  FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

-- Kullanıcı engelini kaldırabilir
CREATE POLICY "Users can remove own blocks"
  ON public.user_blocks
  FOR DELETE
  USING (auth.uid() = blocker_id);

-- Kullanıcı kendi şikayetlerini görebilir
CREATE POLICY "Users can view own reports"
  ON public.user_reports
  FOR SELECT
  USING (auth.uid() = reporter_id);

-- Kullanıcı şikayet oluşturabilir
CREATE POLICY "Users can create reports"
  ON public.user_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Admin tüm şikayetleri görebilir ve güncelleyebilir
CREATE POLICY "Admin can manage reports"
  ON public.user_reports
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- =============================================================================
-- ENGELLEME VE ŞİKAYET FONKSİYONLARI
-- =============================================================================

-- Function: Kullanıcı engellenmiş mi kontrol et
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

-- Function: Kullanıcıyı engelle
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

-- Function: Engellenmiş kullanıcıları listele
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
    ub.id as block_id,
    u.id as blocked_user_id,
    u.name as blocked_user_name,
    u.avatar as blocked_user_avatar,
    ub.reason,
    ub.created_at as blocked_at
  FROM public.user_blocks ub
  INNER JOIN public.users u ON u.id = ub.blocked_id
  WHERE ub.blocker_id = p_user_id
  ORDER BY ub.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Okunmamış mesaj sayısını getir
CREATE OR REPLACE FUNCTION public.get_unread_message_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unread_count
  FROM public.messages
  WHERE receiver_id = p_user_id
    AND read = false;
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Match başına okunmamış mesaj sayısı
CREATE OR REPLACE FUNCTION public.get_unread_by_match(p_user_id UUID)
RETURNS TABLE (
  match_id UUID,
  unread_count BIGINT,
  last_message_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.match_id,
    COUNT(*) as unread_count,
    MAX(m.created_at) as last_message_at
  FROM public.messages m
  WHERE m.receiver_id = p_user_id
    AND m.read = false
  GROUP BY m.match_id
  ORDER BY MAX(m.created_at) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Şikayet oluştur
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

-- Function: Admin istatistikleri
CREATE OR REPLACE FUNCTION public.get_report_statistics(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_reports BIGINT,
  pending_reports BIGINT,
  resolved_reports BIGINT,
  top_reported_users JSONB,
  reports_by_type JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'pending') as pending,
      COUNT(*) FILTER (WHERE status = 'resolved') as resolved
    FROM public.user_reports
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
  ),
  top_users AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'user_id', reported_id,
        'report_count', cnt
      ) ORDER BY cnt DESC
    ) as users
    FROM (
      SELECT reported_id, COUNT(*) as cnt
      FROM public.user_reports
      WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
      GROUP BY reported_id
      ORDER BY COUNT(*) DESC
      LIMIT 10
    ) t
  ),
  by_type AS (
    SELECT jsonb_object_agg(report_type, cnt) as types
    FROM (
      SELECT report_type, COUNT(*) as cnt
      FROM public.user_reports
      WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
      GROUP BY report_type
    ) t
  )
  SELECT
    s.total,
    s.pending,
    s.resolved,
    u.users,
    t.types
  FROM stats s, top_users u, by_type t;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- MESAJLAŞMA POLİCY GÜNCELLEMELERİ
-- =============================================================================

-- Mevcut message policy'leri kaldır ve yenilerini ekle (engelleme kontrolü ile)
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;

-- Engellenmemiş kullanıcıların mesajlarını görebilme
CREATE POLICY "Users can view unblocked messages"
  ON public.messages
  FOR SELECT
  USING (
    (auth.uid() = sender_id OR auth.uid() = receiver_id)
    AND NOT public.is_user_blocked(sender_id, receiver_id)
  );

-- Engellenmemiş kullanıcılara mesaj gönderebilme
CREATE POLICY "Users can send to unblocked users"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND NOT public.is_user_blocked(sender_id, receiver_id)
  );

-- Kullanıcı kendi mesajlarını okundu olarak işaretleyebilir
CREATE POLICY "Users can mark own messages as read"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- =============================================================================
-- MATCH POLİCY GÜNCELLEMELERİ
-- =============================================================================

-- Engellenen kullanıcılarla match gösterme
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;

CREATE POLICY "Users can view unblocked matches"
  ON public.matches
  FOR SELECT
  USING (
    (auth.uid() = user1_id OR auth.uid() = user2_id)
    AND NOT public.is_user_blocked(user1_id, user2_id)
  );

-- Trigger: Mesaj okunduğunda updated_at güncelle
CREATE OR REPLACE FUNCTION public.update_message_read_time()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.read = false AND NEW.read = true THEN
    NEW.created_at = NOW(); -- You might want a separate 'read_at' column
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_read
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  WHEN (OLD.read = false AND NEW.read = true)
  EXECUTE FUNCTION public.update_message_read_time();


-- ============================================
-- KULLANICI VERİSİ SİLME FONKSİYONU (GDPR/KVKK)
-- ============================================

-- Function: Kullanıcının tüm verilerini sil (GDPR/KVKK Uyumlu)
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id_to_delete UUID)
RETURNS BOOLEAN AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Sadece kullanıcı kendi verisini silebilir
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own data';
  END IF;

  -- 1. Kullanıcının gönderdiği mesajları sil
  DELETE FROM public.messages WHERE sender_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % messages', deleted_count;

  -- 2. Kullanıcının aldığı mesajları sil (opsiyonel - match'in diğer tarafındaki kullanıcı için)
  DELETE FROM public.messages WHERE match_id IN (
    SELECT id FROM public.matches 
    WHERE user1_id = user_id_to_delete OR user2_id = user_id_to_delete
  );

  -- 3. Kullanıcının beğenilerini sil
  DELETE FROM public.likes WHERE user_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % likes', deleted_count;

  -- 4. Kullanıcının eşleşmelerini sil
  DELETE FROM public.matches 
  WHERE user1_id = user_id_to_delete OR user2_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % matches', deleted_count;

  -- 5. Kullanıcının ürünlerinin görsellerini sil (item_images)
  DELETE FROM public.item_images WHERE item_id IN (
    SELECT id FROM public.items WHERE user_id = user_id_to_delete
  );

  -- 6. Kullanıcının ürünlerini sil
  DELETE FROM public.items WHERE user_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % items', deleted_count;

  -- 7. Kullanıcının yaptığı engelleri sil
  DELETE FROM public.user_blocks 
  WHERE blocker_id = user_id_to_delete OR blocked_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % blocks', deleted_count;

  -- 8. Kullanıcının yaptığı şikayetleri sil
  DELETE FROM public.user_reports 
  WHERE reporter_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % reports (as reporter)', deleted_count;

  -- 9. Kullanıcı hakkında yapılan şikayetleri sil
  DELETE FROM public.user_reports 
  WHERE reported_id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % reports (as reported)', deleted_count;

  -- 10. Yasadışı ürün denemelerini sil
  DELETE FROM public.illegal_product_attempts 
  WHERE user_id = user_id_to_delete;

  -- 11. Küfür filtresi kayıtlarını sil
  DELETE FROM public.filtered_messages 
  WHERE user_id = user_id_to_delete;

  -- 12. Kullanıcı profilini sil
  DELETE FROM public.users WHERE id = user_id_to_delete;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted user profile: %', deleted_count;

  -- 13. Auth kullanıcısını sil (Supabase Auth)
  -- NOT: Bu işlem manuel olarak yapılmalı veya Supabase Dashboard'dan
  -- çünkü auth.users tablosu RLS ve fonksiyon izinlerine tabi değil

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting user data: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.delete_user_data(UUID) TO authenticated;

COMMENT ON FUNCTION public.delete_user_data IS 'GDPR/KVKK uyumlu kullanıcı verisi silme fonksiyonu. Kullanıcı sadece kendi verilerini silebilir.';
