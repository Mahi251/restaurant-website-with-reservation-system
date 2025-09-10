-- Create single admin user system with secret code reset
-- Username: genet@ithiopica.eatery
-- Password: adminpassword.ithiopica
-- Secret reset code: sdF&r7tb61"@M$MM

-- Drop existing password reset table and create new secret code system
DROP TABLE IF EXISTS password_reset_tokens CASCADE;

-- Create admin credentials table to store the single admin user
CREATE TABLE IF NOT EXISTS admin_credentials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  secret_code text NOT NULL,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy that allows access only during authentication
CREATE POLICY "admin_credentials_auth_only" ON admin_credentials
  FOR ALL USING (true); -- We'll handle security in the application layer

-- Insert the single admin user
INSERT INTO admin_credentials (username, password_hash, secret_code)
VALUES (
  'genet@ithiopica.eatery',
  crypt('adminpassword.ithiopica', gen_salt('bf')),
  'sdF&r7tb61"@M$MM'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  secret_code = EXCLUDED.secret_code,
  updated_at = NOW();

-- Function to authenticate admin user
CREATE OR REPLACE FUNCTION authenticate_admin(input_username text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_hash text;
  is_valid boolean := false;
BEGIN
  -- Get stored password hash for the username
  SELECT password_hash INTO stored_hash
  FROM admin_credentials
  WHERE username = input_username;
  
  -- Check if user exists and password matches
  IF stored_hash IS NOT NULL THEN
    is_valid := (stored_hash = crypt(input_password, stored_hash));
  END IF;
  
  RETURN json_build_object(
    'valid', is_valid,
    'username', CASE WHEN is_valid THEN input_username ELSE null END
  );
END;
$$;

-- Function to reset admin credentials using secret code
CREATE OR REPLACE FUNCTION reset_admin_credentials(
  secret_code_input text,
  new_username text DEFAULT NULL,
  new_password text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stored_secret text;
  result json;
BEGIN
  -- Get stored secret code
  SELECT secret_code INTO stored_secret
  FROM admin_credentials
  WHERE username = 'genet@ithiopica.eatery';
  
  -- Verify secret code
  IF stored_secret != secret_code_input THEN
    RETURN json_build_object('error', 'Invalid secret code');
  END IF;
  
  -- Update credentials if provided
  UPDATE admin_credentials SET
    username = COALESCE(new_username, username),
    password_hash = CASE 
      WHEN new_password IS NOT NULL THEN crypt(new_password, gen_salt('bf'))
      ELSE password_hash
    END,
    updated_at = NOW()
  WHERE username = 'genet@ithiopica.eatery' OR username = new_username;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Admin credentials updated successfully'
  );
END;
$$;

-- Update is_admin function to work with new system
CREATE OR REPLACE FUNCTION is_admin_user(check_username text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS(
    SELECT 1 FROM admin_credentials 
    WHERE username = check_username
  );
$$;
