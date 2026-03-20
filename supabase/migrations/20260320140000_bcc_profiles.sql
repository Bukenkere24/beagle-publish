-- BP-407: roles for Blog Command Center (table name avoids colliding with `profiles` / `sp_profiles`)
-- Post in #dev-general and get approval before applying on the shared Supabase project.

CREATE TABLE IF NOT EXISTS public.bcc_profiles (
  id UUID REFERENCES auth.users (id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bcc_profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.bcc_is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bcc_profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

CREATE POLICY "bcc_profiles_select_own_or_admin"
  ON public.bcc_profiles FOR SELECT
  USING (auth.uid() = id OR public.bcc_is_admin());

CREATE POLICY "bcc_profiles_update_own"
  ON public.bcc_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.bcc_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.bcc_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'editor'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_bcc_auth_user_created ON auth.users;

CREATE TRIGGER on_bcc_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.bcc_handle_new_user();

-- Backfill existing users (optional):
-- INSERT INTO public.bcc_profiles (id, email, full_name, role)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', ''), 'editor'
-- FROM auth.users ON CONFLICT (id) DO NOTHING;

-- First admin (run manually after migration):
-- UPDATE public.bcc_profiles SET role = 'admin' WHERE email = 'you@team.com';
