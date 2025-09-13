-- Complete Database Reset and Recreation Script
-- This script drops all existing tables and recreates the entire database schema
-- for the restaurant website with reservations system

-- ============================================================================
-- DROP ALL EXISTING TABLES (in reverse dependency order)
-- ============================================================================

-- Drop tables that reference other tables first
DROP TABLE IF EXISTS admin_credentials CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;

-- Drop any remaining functions
DROP FUNCTION IF EXISTS authenticate_admin(text, text) CASCADE;
DROP FUNCTION IF EXISTS reset_admin_credentials(text, text, text) CASCADE;
DROP FUNCTION IF EXISTS is_admin_user(text) CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS send_admin_password_reset(text) CASCADE;

-- ============================================================================
-- CREATE ALL TABLES
-- ============================================================================

-- 1. Restaurant Settings Table (for admin configuration)
CREATE TABLE restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Menu Categories Table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Menu Items Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  allergens TEXT[], -- Array of allergen information
  dietary_info TEXT[], -- Array of dietary information (vegan, gluten-free, etc.)
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reservations Table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  otp_code VARCHAR(6),
  otp_verified BOOLEAN DEFAULT false,
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Admin Credentials Table (for hardcoded admin authentication)
CREATE TABLE admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  secret_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Admin Profiles Table (extends auth.users for admin functionality)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES
-- ============================================================================

-- Menu Categories Policies (public read, admin write)
CREATE POLICY "menu_categories_public_read" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_categories_admin_write" ON menu_categories FOR ALL USING (true); -- Simplified for hardcoded auth

-- Menu Items Policies (public read, admin write)
CREATE POLICY "menu_items_public_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_admin_write" ON menu_items FOR ALL USING (true); -- Simplified for hardcoded auth

-- Reservations Policies (public insert, admin manage all)
CREATE POLICY "reservations_public_insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_public_select" ON reservations FOR SELECT USING (true);
CREATE POLICY "reservations_public_update" ON reservations FOR UPDATE USING (true);

-- Restaurant Settings Policies (admin only)
CREATE POLICY "restaurant_settings_admin_only" ON restaurant_settings FOR ALL USING (true); -- Simplified for hardcoded auth

-- Admin Credentials Policies (allow access for authentication)
CREATE POLICY "admin_credentials_auth_access" ON admin_credentials FOR ALL USING (true);

-- Admin Profiles Policies (simplified)
CREATE POLICY "admin_profiles_access" ON admin_profiles FOR ALL USING (true);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_featured ON menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);

CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON menu_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_categories_is_active ON menu_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_otp_code ON reservations(otp_code);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);

CREATE INDEX IF NOT EXISTS idx_restaurant_settings_key ON restaurant_settings(setting_key);

-- ============================================================================
-- CREATE AUTHENTICATION FUNCTIONS
-- ============================================================================

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

-- ============================================================================
-- INSERT INITIAL DATA
-- ============================================================================

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

-- Insert default restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value, description) VALUES
('restaurant_name', 'Ithiopica Eatery', 'Restaurant name displayed on the website'),
('restaurant_phone', '(555) 123-4567', 'Main restaurant phone number'),
('restaurant_email', 'info@ithiopica.eatery', 'Main restaurant email'),
('restaurant_address', '123 Main Street, Downtown, NY 10001', 'Restaurant address'),
('opening_hours', '{"monday": "5:00 PM - 10:00 PM", "tuesday": "5:00 PM - 10:00 PM", "wednesday": "5:00 PM - 10:00 PM", "thursday": "5:00 PM - 10:00 PM", "friday": "5:00 PM - 11:00 PM", "saturday": "4:00 PM - 11:00 PM", "sunday": "4:00 PM - 9:00 PM"}', 'Restaurant operating hours'),
('max_party_size', '12', 'Maximum party size for reservations'),
('reservation_advance_days', '30', 'How many days in advance reservations can be made'),
('otp_expiry_minutes', '15', 'OTP expiry time in minutes')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious Ethiopian appetizers', 1),
('Traditional Dishes', 'Authentic Ethiopian main courses and specialties', 2),
('Vegetarian', 'Plant-based Ethiopian dishes and sides', 3),
('Beverages', 'Traditional Ethiopian drinks and modern selections', 4),
('Desserts', 'Sweet endings to your Ethiopian dining experience', 5)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
DO $$
DECLARE
    appetizers_id UUID;
    traditional_id UUID;
    vegetarian_id UUID;
    beverages_id UUID;
    desserts_id UUID;
BEGIN
    SELECT id INTO appetizers_id FROM menu_categories WHERE name = 'Appetizers';
    SELECT id INTO traditional_id FROM menu_categories WHERE name = 'Traditional Dishes';
    SELECT id INTO vegetarian_id FROM menu_categories WHERE name = 'Vegetarian';
    SELECT id INTO beverages_id FROM menu_categories WHERE name = 'Beverages';
    SELECT id INTO desserts_id FROM menu_categories WHERE name = 'Desserts';

    -- Insert appetizers
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (appetizers_id, 'Sambusa', 'Crispy pastry filled with lentils and spices', 8.99, true, true, ARRAY['gluten'], ARRAY['vegetarian']),
    (appetizers_id, 'Kitfo Tartare', 'Ethiopian-style beef tartare with mitmita spice', 12.99, true, false, NULL, NULL);

    -- Insert traditional dishes
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (traditional_id, 'Doro Wot', 'Traditional chicken stew with berbere spice and hard-boiled eggs', 18.99, true, true, ARRAY['eggs'], NULL),
    (traditional_id, 'Kitfo', 'Ethiopian beef tartare served with injera bread', 22.99, true, true, NULL, NULL),
    (traditional_id, 'Tibs', 'Sautéed beef with onions, peppers, and Ethiopian spices', 19.99, true, false, NULL, NULL);

    -- Insert vegetarian dishes
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (vegetarian_id, 'Vegetarian Combo', 'Assortment of lentil stews, vegetables, and salads', 16.99, true, true, NULL, ARRAY['vegetarian', 'vegan']),
    (vegetarian_id, 'Shiro', 'Ground chickpea stew with berbere spice', 14.99, true, false, NULL, ARRAY['vegetarian', 'vegan']);

    -- Insert beverages
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (beverages_id, 'Ethiopian Coffee', 'Traditional coffee ceremony with freshly roasted beans', 6.99, true, true, NULL, ARRAY['vegan']),
    (beverages_id, 'Tej', 'Traditional Ethiopian honey wine', 8.99, true, false, NULL, NULL);

    -- Insert desserts
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (desserts_id, 'Honey Cake', 'Traditional Ethiopian honey cake with spices', 7.99, true, false, ARRAY['gluten', 'eggs'], ARRAY['vegetarian']);

END $$;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

-- Add a completion indicator
INSERT INTO restaurant_settings (setting_key, setting_value, description) VALUES
('database_initialized', 'true', 'Indicates that the database has been properly initialized')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = 'true',
  updated_at = NOW();
