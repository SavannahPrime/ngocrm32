
-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'Blog Assets', true)
ON CONFLICT (id) DO NOTHING;

-- Clear all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON storage.objects;

-- Set up policies to allow public access to the bucket
CREATE POLICY "Allow public read access" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'blog-assets');

-- Allow any authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'blog-assets');

-- Allow any authenticated users to update files
CREATE POLICY "Allow authenticated users to update" 
ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'blog-assets');

-- Allow any authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete" 
ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'blog-assets');
