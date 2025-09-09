-- Restaurant Tables Schema
-- This script creates all necessary tables for the restaurant website

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
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

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
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

-- Restaurant Settings Table (for admin configuration)
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table (extends auth.users for admin functionality)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Menu Categories (public read, admin write)
CREATE POLICY "menu_categories_public_read" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_categories_admin_write" ON menu_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- RLS Policies for Menu Items (public read, admin write)
CREATE POLICY "menu_items_public_read" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_admin_write" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- RLS Policies for Reservations (customers can create, admins can manage all)
CREATE POLICY "reservations_public_insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_admin_all" ON reservations FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);
CREATE POLICY "reservations_customer_read_own" ON reservations FOR SELECT USING (
  customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- RLS Policies for Restaurant Settings (admin only)
CREATE POLICY "restaurant_settings_admin_only" ON restaurant_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- RLS Policies for Admin Profiles (admin only)
CREATE POLICY "admin_profiles_admin_only" ON admin_profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_featured ON menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_otp_code ON reservations(otp_code);
