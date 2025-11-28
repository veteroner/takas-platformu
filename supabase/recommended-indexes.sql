-- Additional index recommendations
-- Run after main schema

-- Messages: Composite for receiver unread ordering
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread_created ON public.messages(receiver_id, created_at DESC) WHERE read = false;

-- Matches: Composite for status filtering (if added later)
CREATE INDEX IF NOT EXISTS idx_matches_status_created ON public.matches(status, created_at DESC);

-- Items: Partial index for active items high velocity queries
CREATE INDEX IF NOT EXISTS idx_items_active_created ON public.items(created_at DESC) WHERE status = 'active';

-- user_reports: Partial index for pending cases
CREATE INDEX IF NOT EXISTS idx_user_reports_pending ON public.user_reports(created_at DESC) WHERE status = 'pending';

-- notifications: Partial for unread
CREATE INDEX IF NOT EXISTS idx_notifications_unread_created ON public.notifications(created_at DESC) WHERE read = false;

-- illegal attempts: Partial critical
CREATE INDEX IF NOT EXISTS idx_illegal_attempts_critical ON public.illegal_product_attempts(created_at DESC) WHERE risk_level = 'critical';
