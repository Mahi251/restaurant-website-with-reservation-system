-- Add image_url column to all category tables
DO $$
DECLARE
    category_record RECORD;
    table_name TEXT;
BEGIN
    -- Get all categories from menu_categories table
    FOR category_record IN 
        SELECT name FROM menu_categories
    LOOP
        -- Convert category name to valid table name
        table_name := 'menu_' || lower(regexp_replace(category_record.name, '[^a-zA-Z0-9]', '_', 'g'));
        
        -- Add image_url column if it doesn't exist
        EXECUTE format('
            ALTER TABLE %I 
            ADD COLUMN IF NOT EXISTS image_url TEXT
        ', table_name);
    END LOOP;
END $$;

-- Create storage bucket for menu images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the menu-images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
