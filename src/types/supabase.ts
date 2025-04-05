
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
  notes?: string | null; // Made optional with ?
  tribe_id: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SermonType {
  id: string;
  title: string;
  description?: string | null; // Made optional
  preacher: string | null;
  scripture?: string | null; // Added this field which exists in the DB
  scripture_reference?: string | null; // Made optional
  audio_url?: string | null; // Made optional
  video_url: string | null;
  notes_url?: string | null; // Made optional
  date: string;
  type: string; // 'sermon' or 'blog' or other types
  content: string | null; // Full content for blog posts
  image_url: string | null;
  tags: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  end_time?: string | null; // Made optional
  location: string | null;
  recurring?: boolean; // Made optional
  recurring_pattern?: string | null; // Made optional
  image_url: string | null;
  registration_url?: string | null; // Made optional
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LeaderType {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  image_url: string | null;
  email?: string | null; // Made optional
  contact_email: string | null;
  contact_phone: string | null;
  tribe_id: string | null;
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TribeType {
  id: string;
  name: string;
  description: string | null;
  leader_id?: string | null; // Made optional
  meeting_day?: string | null; // Made optional
  meeting_time?: string | null; // Made optional
  meeting_location?: string | null; // Made optional
  created_at: string;
  updated_at?: string;
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

// Utility functions for embedding media
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

export const getYouTubeEmbedUrl = (url: string): string => {
  // Handle youtu.be format
  if (url.includes('youtu.be')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  
  // Handle youtube.com format
  if (url.includes('watch?v=')) {
    const id = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  
  // Already an embed url
  return url;
};

export const getGoogleDriveEmbedUrl = (url: string): string => {
  // Check if it's already an embed URL
  if (url.includes('/preview')) {
    return url;
  }
  
  // Convert to embed URL
  if (url.includes('/view')) {
    return url.replace('/view', '/preview');
  }
  
  // Handle file ID format
  if (url.includes('id=')) {
    const id = url.split('id=')[1].split('&')[0];
    return `https://drive.google.com/file/d/${id}/preview`;
  }
  
  return url;
};
