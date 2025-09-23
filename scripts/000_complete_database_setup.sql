-- Complete Restaurant Database Setup
-- This script drops all existing tables and recreates everything from scratch

-- Drop all existing tables (in correct order to handle foreign key constraints)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS admin_profiles CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;
DROP TABLE IF EXISTS password_reset_tokens CASCADE;

-- Drop any existing storage buckets and policies
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;

-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for menu images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-images');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Allow authenticated users to update" ON storage.objects
FOR UPDATE USING (bucket_id = 'menu-images');

CREATE POLICY "Allow authenticated users to delete" ON storage.objects
FOR DELETE USING (bucket_id = 'menu-images');

-- Create admin_profiles table
CREATE TABLE admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurant_settings table
CREATE TABLE restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value, description) VALUES
('restaurant_name', 'Bella Vista Restaurant', 'Restaurant name'),
('restaurant_phone', '(555) 123-4567', 'Restaurant phone number'),
('restaurant_email', 'info@bellavista.com', 'Restaurant email'),
('restaurant_address', '123 Main Street, City, State 12345', 'Restaurant address'),
('opening_hours', 'Mon-Thu: 11:00 AM - 10:00 PM, Fri-Sat: 11:00 AM - 11:00 PM, Sun: 12:00 PM - 9:00 PM', 'Restaurant opening hours'),
('max_party_size', '12', 'Maximum party size for reservations'),
('reservation_advance_days', '30', 'How many days in advance reservations can be made');

-- Create menu_categories table
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Main Courses', 'Our signature main dishes', 2),
('Desserts', 'Sweet endings to your perfect meal', 3),
('Beverages', 'Refreshing drinks and specialty cocktails', 4);

-- Create menu_items table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    dietary_info TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 20),
    special_requests TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    otp_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token TEXT NOT NULL UNIQUE,
    notification_email TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_menu_items_is_featured ON menu_items(is_featured);
CREATE INDEX idx_menu_categories_is_active ON menu_categories(is_active);
CREATE INDEX idx_menu_categories_display_order ON menu_categories(display_order);
CREATE INDEX idx_menu_items_display_order ON menu_items(display_order);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_email ON reservations(customer_email);

-- Insert sample menu items
DO $$
DECLARE
    appetizers_id UUID;
    mains_id UUID;
    desserts_id UUID;
    beverages_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO appetizers_id FROM menu_categories WHERE name = 'Appetizers';
    SELECT id INTO mains_id FROM menu_categories WHERE name = 'Main Courses';
    SELECT id INTO desserts_id FROM menu_categories WHERE name = 'Desserts';
    SELECT id INTO beverages_id FROM menu_categories WHERE name = 'Beverages';

    -- Insert sample appetizers
    INSERT INTO menu_items (category_id, name, description, price, is_featured, dietary_info, display_order) VALUES
    (appetizers_id, 'Bruschetta Trio', 'Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella', 12.99, true, ARRAY['vegetarian'], 1),
    (appetizers_id, 'Calamari Fritti', 'Crispy fried squid rings served with marinara sauce and lemon', 14.99, false, ARRAY['seafood'], 2),
    (appetizers_id, 'Antipasto Platter', 'Selection of cured meats, cheeses, olives, and roasted vegetables', 18.99, false, ARRAY['gluten-free option'], 3);

    -- Insert sample main courses
    INSERT INTO menu_items (category_id, name, description, price, is_featured, dietary_info, display_order) VALUES
    (mains_id, 'Osso Buco', 'Braised veal shanks with saffron risotto and gremolata', 32.99, true, '{}', 1),
    (mains_id, 'Seafood Linguine', 'Fresh linguine with shrimp, scallops, and mussels in white wine sauce', 28.99, true, ARRAY['seafood'], 2),
    (mains_id, 'Margherita Pizza', 'Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil', 16.99, false, ARRAY['vegetarian'], 3),
    (mains_id, 'Grilled Branzino', 'Mediterranean sea bass with lemon, herbs, and roasted vegetables', 26.99, false, ARRAY['seafood', 'gluten-free'], 4);

    -- Insert sample desserts
    INSERT INTO menu_items (category_id, name, description, price, is_featured, dietary_info, display_order) VALUES
    (desserts_id, 'Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 8.99, true, ARRAY['vegetarian'], 1),
    (desserts_id, 'Panna Cotta', 'Vanilla bean panna cotta with berry compote', 7.99, false, ARRAY['vegetarian', 'gluten-free'], 2),
    (desserts_id, 'Cannoli Siciliani', 'Traditional Sicilian cannoli filled with sweet ricotta and chocolate chips', 9.99, false, ARRAY['vegetarian'], 3);

    -- Insert sample beverages
    INSERT INTO menu_items (category_id, name, description, price, is_featured, dietary_info, display_order) VALUES
    (beverages_id, 'House Wine Selection', 'Red, white, or rosé by the glass', 8.99, false, ARRAY['alcoholic'], 1),
    (beverages_id, 'Aperol Spritz', 'Classic Italian aperitif with Aperol, Prosecco, and soda', 12.99, true, ARRAY['alcoholic'], 2),
    (beverages_id, 'Italian Soda', 'Sparkling water with your choice of syrup', 4.99, false, ARRAY['non-alcoholic'], 3),
    (beverages_id, 'Espresso', 'Traditional Italian espresso', 3.99, false, ARRAY['non-alcoholic'], 4);
END $$;

-- Create a default admin profile
INSERT INTO admin_profiles (first_name, last_name, role) VALUES
('Restaurant', 'Admin', 'admin');

-- Add some sample reservations for testing
INSERT INTO reservations (customer_name, customer_email, customer_phone, reservation_date, reservation_time, party_size, status) VALUES
('John Smith', 'john@example.com', '(555) 123-4567', CURRENT_DATE + INTERVAL '1 day', '19:00:00', 4, 'confirmed'),
('Sarah Johnson', 'sarah@example.com', '(555) 987-6543', CURRENT_DATE + INTERVAL '2 days', '18:30:00', 2, 'pending'),
('Mike Wilson', 'mike@example.com', '(555) 456-7890', CURRENT_DATE + INTERVAL '3 days', '20:00:00', 6, 'confirmed');
