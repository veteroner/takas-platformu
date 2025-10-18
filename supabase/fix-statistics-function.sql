-- ============================================
-- FIX: get_report_statistics fonksiyonu
-- ============================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın
-- "aggregate function calls cannot be nested" hatasını düzeltir

-- Function 7: Şikayet istatistikleri (Admin için) - FIXED VERSION
DROP FUNCTION IF EXISTS public.get_report_statistics(INTEGER);

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

-- Grant permission
GRANT EXECUTE ON FUNCTION public.get_report_statistics(INTEGER) TO authenticated;

-- Test query (opsiyonel - çalışıp çalışmadığını görmek için)
-- SELECT * FROM public.get_report_statistics(30);
