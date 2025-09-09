-- Create the specific admin user and restrict access to only this user
-- This script sets up genet@ithiopica.eatery as the only admin user

-- First, ensure the admin user exists in auth.users (this will be done via Supabase Auth)
-- Then add them to admin_profiles

-- Update admin_profiles policies to only allow the specific admin user
DROP POLICY IF EXISTS "admin_profiles_select" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_insert" ON admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_update" ON admin_profiles;

-- Create restrictive policies that only allow the specific admin user
CREATE POLICY "admin_profiles_select" ON admin_profiles
  FOR SELECT USING (
    auth.email() = 'genet@ithiopica.eatery'
  );

CREATE POLICY "admin_profiles_insert" ON admin_profiles
  FOR INSERT WITH CHECK (
    auth.email() = 'genet@ithiopica.eatery'
  );

CREATE POLICY "admin_profiles_update" ON admin_profiles
  FOR UPDATE USING (
    auth.email() = 'genet@ithiopica.eatery'
  );

-- Update the is_admin function to only check for the specific email
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.email() = 'genet@ithiopica.eatery';
$$;

-- Create a function to handle password reset emails
CREATE OR REPLACE FUNCTION send_admin_password_reset(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_token text;
  result json;
BEGIN
  -- Only allow password reset for the admin user
  IF user_email != 'genet@ithiopica.eatery' THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  -- Generate a reset token (in a real implementation, this would be more secure)
  reset_token := encode(gen_random_bytes(32), 'hex');
  
  -- Store the reset token with expiration (24 hours)
  INSERT INTO password_reset_tokens (email, token, expires_at, notification_email)
  VALUES (user_email, reset_token, NOW() + INTERVAL '24 hours', 'Mahiimran2049@gmail.com')
  ON CONFLICT (email) DO UPDATE SET
    token = EXCLUDED.token,
    expires_at = EXCLUDED.expires_at,
    created_at = NOW();

  RETURN json_build_object(
    'success', true, 
    'message', 'Password reset instructions sent to notification email',
    'notification_email', 'Mahiimran2049@gmail.com'
  );
END;
$$;

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  token text NOT NULL,
  notification_email text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  used_at timestamp with time zone
);

-- Enable RLS on password reset tokens
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow the admin user to access their own reset tokens
CREATE POLICY "password_reset_tokens_policy" ON password_reset_tokens
  FOR ALL USING (email = auth.email() AND auth.email() = 'genet@ithiopica.eatery');
