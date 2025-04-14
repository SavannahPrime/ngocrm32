
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
    
    // Log existing buckets
    console.log("Available buckets:", buckets.map(b => b.id).join(", "));
    
    return { 
      success: true, 
      buckets: {
        blogAssets: blogAssetsBucketExists,
        media: mediaBucketExists
      }
    };
  } catch (error) {
    console.error("Error checking buckets:", error);
    return { success: false, error };
  }
};

// Check current authentication status
export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking auth status:", error);
      return { success: false, authenticated: false, error };
    }
    
    return { 
      success: true, 
      authenticated: !!session,
      user: session?.user,
      error: null
    };
  } catch (error) {
    console.error("Error checking auth status:", error);
    return { success: false, authenticated: false, error };
  }
};
