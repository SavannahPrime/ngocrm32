
// Temporary type definitions for Supabase tables
// This file will be used until the auto-generated types are properly updated

export interface SermonType {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  content: string;
  video_url?: string | null;
  image_url?: string | null;
  featured?: boolean | null;
  tags?: string[] | null;
  type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}
