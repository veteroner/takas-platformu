# 🚨 ACİL: Backend Fonksiyonları Eksik Hatası

## ❌ Hata Mesajı:
```
POST https://rraatgwihvrxopjahpoh.supabase.co/rest/v1/rpc/create_user_report 404 (Not Found)
Could not find the function public.create_user_report
```

## ✅ HIZLI ÇÖZÜM (2 Dakika)

### 1. Supabase SQL Editor'ü Açın:
**URL:** https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/sql/new

### 2. Aşağıdaki SQL'i Kopyala-Yapıştır-Çalıştır:

```sql
-- user_reports tablosu (eğer yoksa)
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

-- RLS etkinleştir
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- Policy: Kullanıcılar şikayet oluşturabilir
DROP POLICY IF EXISTS "Users can create reports" ON public.user_reports;
CREATE POLICY "Users can create reports"
  ON public.user_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Fonksiyon: Şikayet oluştur
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
  IF p_reporter_id = p_reported_id THEN
    RAISE EXCEPTION 'Cannot report yourself';
  END IF;

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

-- Permission
GRANT EXECUTE ON FUNCTION public.create_user_report(UUID, UUID, TEXT, TEXT, JSONB) TO authenticated;

-- Tamamlandı mesajı
SELECT 'Kurulum başarılı! create_user_report fonksiyonu eklendi.' as message;
```

### 3. RUN Butonuna Tıklayın

### 4. Sayfayı Yenileyin ve Tekrar Deneyin!

---

## 📋 TAM KURULUM İÇİN:

Tüm fonksiyonları kurmak için:
1. `supabase/setup-blocking-reporting.sql` dosyasını açın
2. Tüm içeriği kopyalayın
3. Supabase SQL Editor'de çalıştırın

Bu şunları kuracak:
- ✅ user_blocks tablosu
- ✅ user_reports tablosu
- ✅ 7 adet fonksiyon (engelleme, şikayet, bildirim)
- ✅ RLS policies
- ✅ İndeksler

---

## ⏱️ Tahmini Süre: 2 dakika
