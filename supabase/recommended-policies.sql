-- Recommended Policy & Function Additions (Apply after existing schema)

-- 1. Items: Allow owner to see own non-active items
DROP POLICY IF EXISTS "Anyone can view active items" ON public.items;
CREATE POLICY "Owner sees all + others see active" ON public.items
  FOR SELECT USING (
    (status = 'active') OR (auth.uid() = owner_id)
  );

-- 2. Matches: Restrict insert to service role or via trigger context
DROP POLICY IF EXISTS "System can create matches" ON public.matches;
CREATE POLICY "Service or trigger can create matches" ON public.matches
  FOR INSERT WITH CHECK (
    auth.jwt()->>'role' = 'service_role'
  );
-- NOTE: Trigger-based inserts run as table owner; ensure role mapping.

-- 3. Messages: Add read_at column & adjust trigger
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.update_message_read_time()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.read = false AND NEW.read = true THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_message_read ON public.messages;
CREATE TRIGGER on_message_read
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  WHEN (OLD.read = false AND NEW.read = true)
  EXECUTE FUNCTION public.update_message_read_time();

-- 4. Expanded delete_user_data GDPR coverage
CREATE OR REPLACE FUNCTION public.delete_user_data(user_id_to_delete UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() != user_id_to_delete THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Delete from optional tables (check existence)
  DELETE FROM public.notifications WHERE user_id = user_id_to_delete;
  DELETE FROM public.notification_prefs WHERE user_id = user_id_to_delete;
  DELETE FROM public.fcm_tokens WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_activity_log WHERE user_id = user_id_to_delete;
  
  -- Delete swipes, matches, messages (from main schema)
  DELETE FROM public.swipes WHERE user_id = user_id_to_delete;
  DELETE FROM public.messages WHERE sender_id = user_id_to_delete OR receiver_id = user_id_to_delete;
  DELETE FROM public.matches WHERE user1_id = user_id_to_delete OR user2_id = user_id_to_delete;
  DELETE FROM public.items WHERE owner_id = user_id_to_delete;
  
  -- Finally delete user profile
  DELETE FROM public.users WHERE id = user_id_to_delete;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.delete_user_data(UUID) TO authenticated;

-- 5. Activity log retention cleanup (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activity_log') THEN
    ALTER TABLE public.user_activity_log ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '180 days');
    CREATE INDEX IF NOT EXISTS idx_activity_expires_at ON public.user_activity_log(expires_at);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_activity()
RETURNS INTEGER AS $$
DECLARE c INT; BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activity_log') THEN
    DELETE FROM public.user_activity_log WHERE expires_at < NOW();
    GET DIAGNOSTICS c = ROW_COUNT;
    RETURN c;
  END IF;
  RETURN 0;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. items composite index for status + created_at
CREATE INDEX IF NOT EXISTS idx_items_status_created_at ON public.items(status, created_at DESC);

-- 7. Swipe abuse guard (approximate - limit per minute)
CREATE OR REPLACE FUNCTION public.guard_swipe_rate()
RETURNS TRIGGER AS $$
DECLARE cnt INT; BEGIN
  SELECT COUNT(*) INTO cnt FROM public.swipes
  WHERE user_id = NEW.user_id AND created_at > NOW() - INTERVAL '60 seconds';
  IF cnt >= 120 THEN
    RAISE EXCEPTION 'Too many swipes, slow down';
  END IF;
  RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_swipe_rate_guard ON public.swipes;
CREATE TRIGGER on_swipe_rate_guard
  BEFORE INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION public.guard_swipe_rate();

-- 8. Illegal product attempt feedback notification
CREATE OR REPLACE FUNCTION public.notify_illegal_attempt()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_notification(
    NEW.user_id::UUID,
    '🚫 Yasaklı İçerik Uyarısı',
    'Yüklemeye çalıştığınız içerik kurallarımıza aykırı. Lütfen yönergeleri inceleyin.',
    'warning',
    jsonb_build_object('attempt_id', NEW.id)
  );
  RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_illegal_attempt_created ON public.illegal_product_attempts;
CREATE TRIGGER on_illegal_attempt_created
  AFTER INSERT ON public.illegal_product_attempts
  FOR EACH ROW EXECUTE FUNCTION public.notify_illegal_attempt();

-- 9. Standardized admin check (replace jwt role checks later)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$ BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example: Replace policies manually
-- ALTER POLICY "Admin can view illegal attempts" ON public.illegal_product_attempts USING (public.is_admin());

