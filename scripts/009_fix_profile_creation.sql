-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create improved profile creation function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name text;
BEGIN
  -- Extract full name from metadata or use email as fallback
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.email,
    'User'
  );
  
  -- Insert the new profile
  INSERT INTO public.profiles (
    id,
    full_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    v_full_name,
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET updated_at = NOW();
  
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail - allow signup to complete
  RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is properly configured on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies that might conflict
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
DROP POLICY IF EXISTS "Allow self profile update" ON profiles;
DROP POLICY IF EXISTS "Allow self profile read" ON profiles;

-- Create new clear policies
CREATE POLICY "public_profiles_read"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "public_profiles_update"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "public_profiles_insert"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
