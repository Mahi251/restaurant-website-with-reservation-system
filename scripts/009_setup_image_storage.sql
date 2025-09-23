-- Simplified to just set up image storage since category tables are created in script 008
-- Create storage bucket for menu images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the menu-images bucket
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY IF NOT EXISTS "Authenticated users can upload menu images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update menu images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete menu images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
