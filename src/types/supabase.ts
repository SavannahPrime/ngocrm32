
// Define types based on your Supabase tables structure
export interface MemberType {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  join_date: string | null;
  is_active: boolean;
  notes: string | null;
  tribe_id: string | null;
  created_at: string;
}

export interface SermonType {
  id: string;
  title: string;
  description: string | null;
  preacher: string | null;
  scripture_reference: string | null;
  audio_url: string | null;
  video_url: string | null;
  notes_url: string | null;
  date: string;
  type: string; // 'sermon' or 'blog' or other types
  content: string | null; // Full content for blog posts
  image_url: string | null;
  tags: string[] | null;
  featured: boolean;
  created_at: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  end_time: string | null;
  location: string | null;
  recurring: boolean;
  recurring_pattern: string | null;
  image_url: string | null;
  registration_url: string | null;
  featured: boolean;
  created_at: string;
}

export interface LeaderType {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  tribe_id: string | null;
  featured: boolean;
  created_at: string;
}

export interface TribeType {
  id: string;
  name: string;
  description: string | null;
  leader_id: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  created_at: string;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  status: string;
  funding_goal: number;
  funding_current: number;
  image_url: string;
  start_date: string;
  end_date: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}
