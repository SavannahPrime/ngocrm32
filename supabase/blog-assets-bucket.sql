
-- Create a storage bucket for blog assets (images & videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'Blog Assets', TRUE);

-- Allow public access to the bucket
CREATE POLICY "Public Access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-assets');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-assets' AND auth.role() = 'authenticated');
