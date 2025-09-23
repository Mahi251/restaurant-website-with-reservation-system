-- Create menu_categories table with proper names
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories for Ithiopica Coffee & Eatery
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Coffee & Beverages', 'Premium Ethiopian coffee and refreshing drinks', 2),
('Main Courses', 'Hearty and flavorful main dishes', 3),
('Traditional Ethiopian', 'Authentic Ethiopian cuisine and specialties', 4),
('Desserts', 'Sweet endings to your dining experience', 5),
('Breakfast', 'Fresh breakfast options to start your day', 6)
ON CONFLICT (name) DO NOTHING;

-- Update existing menu_items to use category names instead of UUIDs
-- First, let's see what categories exist and map them to proper names
UPDATE menu_items 
SET category = 'Main Courses' 
WHERE category IS NOT NULL AND category != 'Main Courses' AND category != 'Appetizers' AND category != 'Coffee & Beverages' AND category != 'Traditional Ethiopian' AND category != 'Desserts' AND category != 'Breakfast';
