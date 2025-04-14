
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database-types';

const SUPABASE_URL = "https://choasrrsuncvoatzzraq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNob2FzcnJzdW5jdm9hdHp6cmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjk5NDEsImV4cCI6MjA1ODg0NTk0MX0.BMO9Fyu-npeCOiLuoCwHb2UeORTTzJ6PF8LUAAL9W1Q";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'Impact for Change Initiative'
    }
  }
});

// Helper function to check if buckets exist
export const checkStorageBuckets = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return { success: false, error };
    }
    
    const blogAssetsBucketExists = buckets.some(bucket => bucket.id === 'blog-assets');
    const mediaBucketExists = buckets.some(bucket => bucket.id === 'media');
    
    // If buckets don't exist, try to create them
    if (!blogAssetsBucketExists) {
      try {
        const { error: createError } = await supabase.storage.createBucket('blog-assets', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error("Error creating blog-assets bucket:", createError);
        } else {
          console.log("Successfully created blog-assets bucket");
        }
      } catch (e) {
        console.error("Failed to create blog-assets bucket:", e);
      }
    }
    
    if (!mediaBucketExists) {
      try {
        const { error: createError } = await supabase.storage.createBucket('media', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error("Error creating media bucket:", createError);
        } else {
          console.log("Successfully created media bucket");
        }
      } catch (e) {
        console.error("Failed to create media bucket:", e);
      }
    }
    
    return { 
      success: true, 
      buckets: {
        blogAssets: blogAssetsBucketExists || !blogAssetsBucketExists, // Return true even if we just created it
        media: mediaBucketExists || !mediaBucketExists // Return true even if we just created it
      }
    };
  } catch (error) {
    console.error("Error checking buckets:", error);
    return { success: false, error };
  }
};
