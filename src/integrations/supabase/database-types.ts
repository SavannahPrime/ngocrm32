export type TablesNames = 'events' | 'sermons' | 'tribes' | 'members' | 'leaders' | 'programs' | 'projects' | 'team_members';

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string | null;
          date: string;
          description: string;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          location: string;
          time: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          description: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          location: string;
          time: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          description?: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          location?: string;
          time?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      sermons: {
        Row: {
          content: string;
          created_at: string | null;
          date: string;
          featured: boolean | null;
          id: string;
          image_url: string | null;
          preacher: string;
          scripture: string;
          tags: string[] | null;
          title: string;
          type: string | null;
          updated_at: string | null;
          video_url: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          date: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          preacher: string;
          scripture: string;
          tags?: string[] | null;
          title: string;
          type?: string | null;
          updated_at?: string | null;
          video_url?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          date?: string;
          featured?: boolean | null;
          id?: string;
          image_url?: string | null;
          preacher?: string;
          scripture?: string;
          tags?: string[] | null;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
          video_url?: string | null;
        };
        Relationships: [];
      };
      tribes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          birth_date: string | null;
          address: string | null;
          tribe_id: string | null;
          join_date: string | null;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
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
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          birth_date?: string | null;
          address?: string | null;
          tribe_id?: string | null;
          join_date?: string | null;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_tribe_id_fkey";
            columns: ["tribe_id"];
            referencedRelation: "tribes";
            referencedColumns: ["id"];
          }
        ];
      };
      leaders: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string | null;
          image_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          featured: boolean | null;
          tribe_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
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
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          bio?: string | null;
          image_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          featured?: boolean | null;
          tribe_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "leaders_tribe_id_fkey";
            columns: ["tribe_id"];
            referencedRelation: "tribes";
            referencedColumns: ["id"];
          }
        ];
      };
      // Add new table types
      programs: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string | null;
          category: string | null;
          participants: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: string | null;
          category?: string | null;
          participants?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: string | null;
          category?: string | null;
          participants?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          status: string | null;
          funding_goal: number | null;
          funding_current: number | null;
          image_url: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          status?: string | null;
          funding_goal?: number | null;
          funding_current?: number | null;
          image_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          status?: string | null;
          funding_goal?: number | null;
          funding_current?: number | null;
          image_url?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          position: string;
          bio: string | null;
          image_url: string | null;
          email: string | null;
          phone: string | null;
          display_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          position: string;
          bio?: string | null;
          image_url?: string | null;
          email?: string | null;
          phone?: string | null;
          display_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          position?: string;
          bio?: string | null;
          image_url?: string | null;
          email?: string | null;
          phone?: string | null;
          display_order?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      media_library: {
        Row: {
          created_at: string | null;
          file_name: string;
          id: string;
          size: number;
          type: string;
          uploaded_by: string;
          url: string;
        };
        Insert: {
          created_at?: string | null;
          file_name: string;
          id?: string;
          size: number;
          type: string;
          uploaded_by: string;
          url: string;
        };
        Update: {
          created_at?: string | null;
          file_name?: string;
          id?: string;
          size?: number;
          type?: string;
          uploaded_by?: string;
          url?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author_id: string;
          content: string;
          created_at: string | null;
          featured_image_url: string | null;
          id: string;
          status: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string | null;
          featured_image_url?: string | null;
          id?: string;
          status?: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string | null;
          featured_image_url?: string | null;
          id?: string;
          status?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
