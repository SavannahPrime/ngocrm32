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

export interface TribeType {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LeaderType {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  featured?: boolean | null;
  tribe_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MemberType {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  address?: string | null;
  tribe_id?: string | null;
  join_date?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// Helper function to validate YouTube URL
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to validate Google Drive URL
export const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Function to extract YouTube video ID
export const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Function to convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

// Function to convert Google Drive URL to embed URL
export const getGoogleDriveEmbedUrl = (url: string): string | null => {
  // Extract the file ID from a Google Drive URL
  const regex = /\/d\/([^/]+)/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return null;
};
