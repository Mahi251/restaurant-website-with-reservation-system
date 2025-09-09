-- Fix infinite recursion in admin_profiles RLS policy
-- The issue is that the policy references itself, creating a circular dependency

-- Drop the problematic policy
DROP POLICY IF EXISTS "admin_profiles_admin_only" ON admin_profiles;

-- Create a simpler policy that allows users to read their own profile
-- and allows authenticated users to check if they are admins
CREATE POLICY "admin_profiles_read_own" ON admin_profiles FOR SELECT USING (
  id = auth.uid()
);

-- Allow authenticated users to insert their own profile (for initial setup)
CREATE POLICY "admin_profiles_insert_own" ON admin_profiles FOR INSERT WITH CHECK (
  id = auth.uid()
);

-- For updates and deletes, only allow the user to modify their own profile
CREATE POLICY "admin_profiles_update_own" ON admin_profiles FOR UPDATE USING (
  id = auth.uid()
) WITH CHECK (
  id = auth.uid()
);

CREATE POLICY "admin_profiles_delete_own" ON admin_profiles FOR DELETE USING (
  id = auth.uid()
);

-- Update other policies to use a simpler admin check
-- Instead of checking admin_profiles table, we'll use a function

-- Create a function to check if user is admin (without circular reference)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE id = user_id
  );
$$;

-- Recreate the problematic policies using the function
DROP POLICY IF EXISTS "menu_categories_admin_write" ON menu_categories;
CREATE POLICY "menu_categories_admin_write" ON menu_categories FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "menu_items_admin_write" ON menu_items;
CREATE POLICY "menu_items_admin_write" ON menu_items FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "reservations_admin_all" ON reservations;
CREATE POLICY "reservations_admin_all" ON reservations FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "reservations_customer_read_own" ON reservations;
CREATE POLICY "reservations_customer_read_own" ON reservations FOR SELECT USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  is_admin()
);

DROP POLICY IF EXISTS "restaurant_settings_admin_only" ON restaurant_settings;
CREATE POLICY "restaurant_settings_admin_only" ON restaurant_settings FOR ALL USING (
  is_admin()
);
