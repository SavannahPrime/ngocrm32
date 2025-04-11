
-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'Blog Assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up policies to allow public access to the bucket
CREATE POLICY "Allow public read access" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'blog-assets');

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'blog-assets');

-- Allow users to update their own objects
CREATE POLICY "Allow users to update their own objects" 
ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'blog-assets' AND auth.uid() = owner);

-- Allow users to delete their own objects
CREATE POLICY "Allow users to delete their own objects" 
ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'blog-assets' AND auth.uid() = owner);
