-- Seed Initial Restaurant Data
-- This script populates the database with sample menu items and settings

-- Insert default restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value, description) VALUES
('restaurant_name', 'Bella Vista Restaurant', 'Restaurant name displayed on the website'),
('restaurant_phone', '(555) 123-4567', 'Main restaurant phone number'),
('restaurant_email', 'info@bellavista.com', 'Main restaurant email'),
('restaurant_address', '123 Main Street, Downtown, NY 10001', 'Restaurant address'),
('opening_hours', '{"monday": "5:00 PM - 10:00 PM", "tuesday": "5:00 PM - 10:00 PM", "wednesday": "5:00 PM - 10:00 PM", "thursday": "5:00 PM - 10:00 PM", "friday": "5:00 PM - 11:00 PM", "saturday": "4:00 PM - 11:00 PM", "sunday": "4:00 PM - 9:00 PM"}', 'Restaurant operating hours'),
('max_party_size', '12', 'Maximum party size for reservations'),
('reservation_advance_days', '30', 'How many days in advance reservations can be made'),
('otp_expiry_minutes', '15', 'OTP expiry time in minutes')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Salads', 'Fresh, crisp salads made with seasonal ingredients', 2),
('Main Courses', 'Our signature entrees and hearty main dishes', 3),
('Pasta', 'Handmade pasta dishes with authentic Italian flavors', 4),
('Desserts', 'Sweet endings to your perfect meal', 5),
('Beverages', 'Carefully curated wine list and specialty drinks', 6)
ON CONFLICT DO NOTHING;

-- Get category IDs for menu items (using a more robust approach)
DO $$
DECLARE
    appetizer_id UUID;
    salad_id UUID;
    main_id UUID;
    pasta_id UUID;
    dessert_id UUID;
    beverage_id UUID;
BEGIN
    SELECT id INTO appetizer_id FROM menu_categories WHERE name = 'Appetizers';
    SELECT id INTO salad_id FROM menu_categories WHERE name = 'Salads';
    SELECT id INTO main_id FROM menu_categories WHERE name = 'Main Courses';
    SELECT id INTO pasta_id FROM menu_categories WHERE name = 'Pasta';
    SELECT id INTO dessert_id FROM menu_categories WHERE name = 'Desserts';
    SELECT id INTO beverage_id FROM menu_categories WHERE name = 'Beverages';

    -- Insert sample menu items
    INSERT INTO menu_items (category_id, name, description, price, is_featured, allergens, dietary_info, display_order) VALUES
    -- Appetizers
    (appetizer_id, 'Bruschetta Trio', 'Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella', 14.99, true, ARRAY['gluten'], ARRAY['vegetarian'], 1),
    (appetizer_id, 'Calamari Fritti', 'Crispy fried squid rings served with marinara sauce and lemon', 16.99, false, ARRAY['seafood'], ARRAY[], 2),
    (appetizer_id, 'Antipasto Platter', 'Selection of cured meats, cheeses, olives, and roasted vegetables', 22.99, true, ARRAY['dairy'], ARRAY[], 3),
    
    -- Salads
    (salad_id, 'Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and our house Caesar dressing', 13.99, false, ARRAY['dairy', 'gluten'], ARRAY[], 1),
    (salad_id, 'Arugula & Pear Salad', 'Fresh arugula with sliced pears, candied walnuts, and gorgonzola cheese', 15.99, true, ARRAY['nuts', 'dairy'], ARRAY['vegetarian'], 2),
    
    -- Main Courses
    (main_id, 'Grilled Salmon', 'Atlantic salmon with lemon herb butter, served with seasonal vegetables', 28.99, true, ARRAY['fish'], ARRAY['gluten-free'], 1),
    (main_id, 'Ribeye Steak', '12oz prime ribeye with garlic mashed potatoes and asparagus', 42.99, true, ARRAY['dairy'], ARRAY['gluten-free'], 2),
    (main_id, 'Chicken Parmigiana', 'Breaded chicken breast with marinara sauce and melted mozzarella', 24.99, false, ARRAY['gluten', 'dairy'], ARRAY[], 3),
    
    -- Pasta
    (pasta_id, 'Spaghetti Carbonara', 'Classic Roman pasta with pancetta, eggs, and pecorino cheese', 19.99, true, ARRAY['gluten', 'dairy'], ARRAY[], 1),
    (pasta_id, 'Lobster Ravioli', 'House-made ravioli filled with lobster in a creamy tomato sauce', 32.99, true, ARRAY['seafood', 'gluten', 'dairy'], ARRAY[], 2),
    (pasta_id, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic, red peppers, and fresh basil', 17.99, false, ARRAY['gluten'], ARRAY['vegan'], 3),
    
    -- Desserts
    (dessert_id, 'Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 9.99, true, ARRAY['dairy', 'gluten'], ARRAY['vegetarian'], 1),
    (dessert_id, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla gelato', 11.99, true, ARRAY['dairy', 'gluten'], ARRAY['vegetarian'], 2),
    
    -- Beverages
    (beverage_id, 'House Wine Selection', 'Ask your server about our rotating selection of wines by the glass', 8.99, false, ARRAY[], ARRAY[], 1),
    (beverage_id, 'Italian Soda', 'Sparkling water with your choice of fruit syrup', 4.99, false, ARRAY[], ARRAY['vegan'], 2);
    
END $$;
