-- ==============================================================================
-- ⛓️ HALKA (Life OS) - Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================
-- Bu betik, Halka işletim sisteminde:
-- 1. Yeni üye olan kullanıcıların sıfır eklentiyle (tamamen temiz ve boş) başlamasını sağlar.
-- 2. Kullanıcıların eklediği eklentileri (user_widgets) ve verilerini (widget_data) buluta kaydeder.
-- 3. Kullanıcı tekrar giriş yaptığında kaldığı yerden devam etmesini sağlar.
-- ==============================================================================

-- 1. KULLANICI PROFİLLERİ (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Kullanıcı',
  title TEXT DEFAULT 'Kişisel Hayat Yöneticisi',
  theme TEXT DEFAULT 'cyber-cyan',
  view_mode TEXT DEFAULT 'cockpit',
  sound_enabled BOOLEAN DEFAULT true,
  last_active_date DATE DEFAULT CURRENT_DATE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AKTİF EKLENTİLER (user_widgets)
-- Yeni kullanıcı açıldığında hiçbir eklenti aktif değildir (is_active = false)
CREATE TABLE IF NOT EXISTS public.user_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_widgets_user_widget_unique UNIQUE (user_id, widget_id)
);

-- 3. EKLENTİ VERİLERİ (widget_data)
-- Kullanıcı su içtiğinde, görev eklediğinde veya pomodoro yaptığında veriler burada saklanır
CREATE TABLE IF NOT EXISTS public.widget_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT widget_data_user_widget_unique UNIQUE (user_id, widget_id)
);

-- İndeksler (Hızlı sorgulama için)
CREATE INDEX IF NOT EXISTS idx_user_widgets_user_id ON public.user_widgets(user_id);
CREATE INDEX IF NOT EXISTS idx_widget_data_user_id ON public.widget_data(user_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) GÜVENLİK POLİTİKALARI
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_data ENABLE ROW LEVEL SECURITY;

-- Profiles: Kullanıcı yalnızca kendi profilini görebilir ve güncelleyebilir
DROP POLICY IF EXISTS "Profiles user isolation" ON public.profiles;
CREATE POLICY "Profiles user isolation" ON public.profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User Widgets: Kullanıcı yalnızca kendi eklentilerini yönetebilir
DROP POLICY IF EXISTS "User widgets isolation" ON public.user_widgets;
CREATE POLICY "User widgets isolation" ON public.user_widgets
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Widget Data: Kullanıcı yalnızca kendi eklenti verilerini yönetebilir
DROP POLICY IF EXISTS "Widget data isolation" ON public.widget_data;
CREATE POLICY "Widget data isolation" ON public.widget_data
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. YENİ KULLANICI TETİKLEYİCİSİ (handle_new_user)
-- Yeni üyelik açıldığında:
-- - Sadece profil oluşturulur.
-- - HİÇBİR varsayılan eklenti veya sahte veri EKLENMEZ.
-- - Kullanıcı halkayı tertemiz açar.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email ILIKE '%admin%' THEN 'admin'
      ELSE 'user'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı bağla
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. ESKİ/TEST HESAPLARINDAKİ SAHTE EKLENTİLERİ TEMİZLEME (Hızlı Temizlik)
-- Eğer önceki testlerde eklenen sahte verileri (1250ml su, otomatik görevler)
-- tamamen temizlemek istiyorsanız aşağıdaki 2 satırı da SQL Editor'da çalıştırabilirsiniz:
-- ==============================================================================
DELETE FROM public.user_widgets;
DELETE FROM public.widget_data;

