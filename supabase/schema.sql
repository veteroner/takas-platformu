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
