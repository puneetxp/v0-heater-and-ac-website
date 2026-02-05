-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "public_profiles_read" ON profiles;
DROP POLICY IF EXISTS "public_profiles_update" ON profiles;
DROP POLICY IF EXISTS "Users can insert their profile" ON profiles;

-- Drop and recreate the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the trigger function with proper error handling
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now())
  ON CONFLICT (id) DO UPDATE SET
    email = new.email,
    updated_at = now();
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error creating profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (for manual creation if needed)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow system to create profiles during signup (via trigger)
CREATE POLICY "System can create profiles"
ON profiles FOR INSERT
WITH CHECK (true);

-- Verify trigger is in place
SELECT COUNT(*) as trigger_count FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created' AND event_object_table = 'users';
