-- ============================================
-- BASIT VERSİYON: get_report_statistics düzeltme
-- ============================================
-- Eğer user_reports tablosu boşsa, bu daha basit versiyon çalışır

CREATE OR REPLACE FUNCTION public.get_report_statistics(p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_reports BIGINT,
  pending_reports BIGINT,
  investigating_reports BIGINT,
  resolved_reports BIGINT,
  dismissed_reports BIGINT,
  by_type JSONB
) AS $$
DECLARE
  v_total BIGINT := 0;
  v_pending BIGINT := 0;
  v_investigating BIGINT := 0;
  v_resolved BIGINT := 0;
  v_dismissed BIGINT := 0;
  v_types JSONB := '{}'::jsonb;
BEGIN
  -- Sayıları hesapla
  SELECT 
    COUNT(*)::BIGINT,
    COUNT(*) FILTER (WHERE status = 'pending')::BIGINT,
    COUNT(*) FILTER (WHERE status = 'investigating')::BIGINT,
    COUNT(*) FILTER (WHERE status = 'resolved')::BIGINT,
    COUNT(*) FILTER (WHERE status = 'dismissed')::BIGINT
  INTO v_total, v_pending, v_investigating, v_resolved, v_dismissed
  FROM public.user_reports
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL;

  -- Tipleri hesapla (sadece kayıt varsa)
  IF v_total > 0 THEN
    SELECT jsonb_object_agg(report_type, cnt)
    INTO v_types
    FROM (
      SELECT report_type, COUNT(*)::BIGINT as cnt
      FROM public.user_reports
      WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
      GROUP BY report_type
    ) sub;
  END IF;

  -- Tek satır döndür
  RETURN QUERY SELECT v_total, v_pending, v_investigating, v_resolved, v_dismissed, COALESCE(v_types, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission
GRANT EXECUTE ON FUNCTION public.get_report_statistics(INTEGER) TO authenticated;
