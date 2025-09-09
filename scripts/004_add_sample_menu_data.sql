-- Add sample menu categories and items for testing

-- Insert menu categories
INSERT INTO menu_categories (name, description, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', 1),
('Soups & Salads', 'Fresh soups and crisp salads', 2),
('Main Courses', 'Our signature entrees and specialties', 3),
('Pasta & Risotto', 'Handmade pasta and creamy risottos', 4),
('Desserts', 'Sweet endings to your perfect meal', 5),
('Beverages', 'Wines, cocktails, and refreshing drinks', 6);

-- Get category IDs for reference
DO $$
DECLARE
    appetizers_id UUID;
    soups_salads_id UUID;
    mains_id UUID;
    pasta_id UUID;
    desserts_id UUID;
    beverages_id UUID;
BEGIN
    SELECT id INTO appetizers_id FROM menu_categories WHERE name = 'Appetizers';
    SELECT id INTO soups_salads_id FROM menu_categories WHERE name = 'Soups & Salads';
    SELECT id INTO mains_id FROM menu_categories WHERE name = 'Main Courses';
    SELECT id INTO pasta_id FROM menu_categories WHERE name = 'Pasta & Risotto';
    SELECT id INTO desserts_id FROM menu_categories WHERE name = 'Desserts';
    SELECT id INTO beverages_id FROM menu_categories WHERE name = 'Beverages';

    -- Insert appetizers
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (appetizers_id, 'Bruschetta Trio', 'Three varieties of our signature bruschetta with fresh tomatoes, burrata, and prosciutto', 14.00, true, true, ARRAY['gluten'], ARRAY['vegetarian']),
    (appetizers_id, 'Burrata Caprese', 'Creamy burrata with heirloom tomatoes, fresh basil, and aged balsamic', 16.00, true, false, ARRAY['dairy'], ARRAY['vegetarian', 'gluten-free']),
    (appetizers_id, 'Crispy Calamari', 'Golden fried squid rings with marinara and lemon aioli', 15.00, true, false, ARRAY['seafood', 'gluten'], NULL),
    (appetizers_id, 'Charcuterie Board', 'Selection of artisanal meats, cheeses, olives, and accompaniments', 22.00, true, true, ARRAY['dairy', 'nuts'], NULL);

    -- Insert soups & salads
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (soups_salads_id, 'Tuscan White Bean Soup', 'Hearty soup with cannellini beans, vegetables, and fresh herbs', 12.00, true, false, NULL, ARRAY['vegetarian', 'vegan', 'gluten-free']),
    (soups_salads_id, 'Caesar Salad', 'Crisp romaine, parmesan, croutons, and our house-made caesar dressing', 13.00, true, false, ARRAY['dairy', 'gluten', 'eggs'], ARRAY['vegetarian']),
    (soups_salads_id, 'Arugula & Pear Salad', 'Baby arugula, roasted pears, candied walnuts, and gorgonzola', 15.00, true, true, ARRAY['dairy', 'nuts'], ARRAY['vegetarian', 'gluten-free']),
    (soups_salads_id, 'Mediterranean Bowl', 'Quinoa, chickpeas, cucumber, tomatoes, olives, and tahini dressing', 14.00, true, false, ARRAY['sesame'], ARRAY['vegetarian', 'vegan', 'gluten-free']);

    -- Insert main courses
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (mains_id, 'Grilled Branzino', 'Whole Mediterranean sea bass with lemon, herbs, and roasted vegetables', 28.00, true, true, ARRAY['fish'], ARRAY['gluten-free']),
    (mains_id, 'Osso Buco', 'Braised veal shank with saffron risotto and gremolata', 34.00, true, true, ARRAY['dairy'], NULL),
    (mains_id, 'Chicken Parmigiana', 'Breaded chicken breast with marinara, mozzarella, and spaghetti', 24.00, true, false, ARRAY['gluten', 'dairy'], NULL),
    (mains_id, 'Lamb Rack', 'Herb-crusted rack of lamb with roasted potatoes and mint chimichurri', 36.00, true, false, NULL, ARRAY['gluten-free']),
    (mains_id, 'Eggplant Parmigiana', 'Layers of eggplant, marinara, and fresh mozzarella', 21.00, true, false, ARRAY['dairy', 'gluten'], ARRAY['vegetarian']);

    -- Insert pasta & risotto
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (pasta_id, 'Lobster Ravioli', 'House-made ravioli filled with lobster in a creamy tomato sauce', 32.00, true, true, ARRAY['shellfish', 'gluten', 'dairy', 'eggs'], NULL),
    (pasta_id, 'Spaghetti Carbonara', 'Classic Roman pasta with pancetta, eggs, pecorino, and black pepper', 19.00, true, false, ARRAY['gluten', 'dairy', 'eggs'], NULL),
    (pasta_id, 'Mushroom Risotto', 'Creamy arborio rice with wild mushrooms and truffle oil', 23.00, true, true, ARRAY['dairy'], ARRAY['vegetarian', 'gluten-free']),
    (pasta_id, 'Penne Arrabbiata', 'Spicy tomato sauce with garlic, red peppers, and fresh basil', 17.00, true, false, ARRAY['gluten'], ARRAY['vegetarian', 'vegan']),
    (pasta_id, 'Seafood Linguine', 'Fresh clams, mussels, and shrimp in white wine garlic sauce', 26.00, true, false, ARRAY['shellfish', 'gluten'], NULL);

    -- Insert desserts
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (desserts_id, 'Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', 9.00, true, true, ARRAY['gluten', 'dairy', 'eggs'], ARRAY['vegetarian']),
    (desserts_id, 'Panna Cotta', 'Vanilla bean panna cotta with seasonal berry compote', 8.00, true, false, ARRAY['dairy'], ARRAY['vegetarian', 'gluten-free']),
    (desserts_id, 'Chocolate Lava Cake', 'Warm chocolate cake with molten center and vanilla gelato', 10.00, true, true, ARRAY['gluten', 'dairy', 'eggs'], ARRAY['vegetarian']),
    (desserts_id, 'Cannoli Siciliani', 'Traditional Sicilian pastry shells filled with sweet ricotta', 7.00, true, false, ARRAY['gluten', 'dairy'], ARRAY['vegetarian']),
    (desserts_id, 'Gelato Selection', 'Three scoops of our house-made gelato', 6.00, true, false, ARRAY['dairy'], ARRAY['vegetarian', 'gluten-free']);

    -- Insert beverages
    INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, allergens, dietary_info) VALUES
    (beverages_id, 'House Wine Selection', 'Red or white wine by the glass', 8.00, true, false, ARRAY['sulfites'], NULL),
    (beverages_id, 'Negroni', 'Classic Italian cocktail with gin, Campari, and sweet vermouth', 12.00, true, true, NULL, NULL),
    (beverages_id, 'Aperol Spritz', 'Refreshing aperitif with Aperol, prosecco, and soda', 10.00, true, false, ARRAY['sulfites'], NULL),
    (beverages_id, 'Italian Soda', 'Sparkling water with your choice of fruit syrup', 4.00, true, false, NULL, ARRAY['vegan']),
    (beverages_id, 'Espresso', 'Traditional Italian espresso', 3.00, true, false, NULL, ARRAY['vegan']),
    (beverages_id, 'Limoncello', 'Traditional Italian lemon liqueur', 6.00, true, false, NULL, NULL);

END $$;
