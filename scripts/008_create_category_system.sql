-- Complete rewrite to create the entire category system properly
-- Create menu_categories table first
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO menu_categories (name, display_order) VALUES
    ('Appetizers', 1),
    ('Main Courses', 2),
    ('Desserts', 3),
    ('Beverages', 4)
ON CONFLICT (name) DO NOTHING;

-- Function to create category table
CREATE OR REPLACE FUNCTION create_category_table(category_name TEXT)
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
BEGIN
    -- Convert category name to valid table name
    table_name := 'menu_' || lower(regexp_replace(category_name, '[^a-zA-Z0-9]', '_', 'g'));
    
    -- Create the table
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            image_url TEXT,
            available BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
    ', table_name);
    
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Create policies
    EXECUTE format('CREATE POLICY "Enable read access for all users" ON %I FOR SELECT USING (true)', table_name);
    EXECUTE format('CREATE POLICY "Enable insert for authenticated users" ON %I FOR INSERT WITH CHECK (auth.role() = ''authenticated'')', table_name);
    EXECUTE format('CREATE POLICY "Enable update for authenticated users" ON %I FOR UPDATE USING (auth.role() = ''authenticated'')', table_name);
    EXECUTE format('CREATE POLICY "Enable delete for authenticated users" ON %I FOR DELETE USING (auth.role() = ''authenticated'')', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rename category table
CREATE OR REPLACE FUNCTION rename_category_table(old_name TEXT, new_name TEXT)
RETURNS VOID AS $$
DECLARE
    old_table_name TEXT;
    new_table_name TEXT;
BEGIN
    old_table_name := 'menu_' || lower(regexp_replace(old_name, '[^a-zA-Z0-9]', '_', 'g'));
    new_table_name := 'menu_' || lower(regexp_replace(new_name, '[^a-zA-Z0-9]', '_', 'g'));
    
    EXECUTE format('ALTER TABLE %I RENAME TO %I', old_table_name, new_table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to drop category table
CREATE OR REPLACE FUNCTION drop_category_table(category_name TEXT)
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
BEGIN
    table_name := 'menu_' || lower(regexp_replace(category_name, '[^a-zA-Z0-9]', '_', 'g'));
    EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create tables for default categories
DO $$
DECLARE
    category_record RECORD;
BEGIN
    FOR category_record IN SELECT name FROM menu_categories LOOP
        PERFORM create_category_table(category_record.name);
    END LOOP;
END $$;
