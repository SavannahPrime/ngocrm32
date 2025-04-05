
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, ProjectType, EventType, SermonType } from "@/types/supabase";

// Define context types
interface NGOContextType {
  volunteers: MemberType[];
  projects: ProjectType[];
  sermons: SermonType[];  // Keeping for blog posts
  events: EventType[];
  addVolunteer: (volunteer: Partial<MemberType>) => Promise<boolean>;
  getFeaturedSermons: () => SermonType[];
  getFeaturedEvents: () => EventType[];
  getFeaturedBlogPosts: () => SermonType[];
  isLoading: boolean;
}

// Create the context
const NGOContext = createContext<NGOContextType | undefined>(undefined);

// Provider component
export const NGOProvider = ({ children }: { children: React.ReactNode }) => {
  const [volunteers, setVolunteers] = useState<MemberType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching NGO data from Supabase...");
      
      // Fetch volunteers (previously members)
      const { data: volunteersData, error: volunteersError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (volunteersError) {
        console.error("Error fetching volunteers:", volunteersError);
        throw volunteersError;
      }
      setVolunteers(volunteersData as MemberType[] || []);
      console.log("Volunteers fetched:", volunteersData ? volunteersData.length : 0);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        throw projectsError;
      }
      setProjects(projectsData as ProjectType[] || []);
      console.log("Projects fetched:", projectsData ? projectsData.length : 0);
      
      // Try to fetch sermons (blog posts), but don't fail if the table doesn't exist yet
      try {
        const { data: sermonsData, error: sermonsError } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'blog')
          .order('date', { ascending: false });
        
        if (sermonsError) {
          console.error("Error fetching blog posts:", sermonsError);
        } else {
          setSermons(sermonsData as SermonType[] || []);
          console.log("Blog posts fetched:", sermonsData ? sermonsData.length : 0);
        }
      } catch (error) {
        console.error("Could not fetch blog posts:", error);
        setSermons([]);
      }
      
      // Try to fetch events, but don't fail if the table doesn't exist yet
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
        } else {
          setEvents(eventsData as EventType[] || []);
          console.log("Events fetched:", eventsData ? eventsData.length : 0);
        }
      } catch (error) {
        console.error("Could not fetch events:", error);
        setEvents([]);
      }
      
      console.log("NGO data fetch completed");
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load NGO data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Add a new volunteer
  const addVolunteer = async (volunteer: Partial<MemberType>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if required field is present
      if (!volunteer.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Volunteer name is required.",
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: volunteer.name,
          email: volunteer.email || null,
          phone: volunteer.phone || null,
          birth_date: volunteer.birth_date || null,
          address: volunteer.address || null,
          join_date: volunteer.join_date || new Date().toISOString(),
          is_active: volunteer.is_active ?? true
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setVolunteers(prev => [...prev, data[0] as MemberType]);
      }
      
      toast({
        title: "Success",
        description: "New volunteer added successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new volunteer. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get featured sermons
  const getFeaturedSermons = (): SermonType[] => {
    return sermons.filter(sermon => sermon.featured);
  };

  // Get featured events
  const getFeaturedEvents = (): EventType[] => {
    return events.filter(event => event.featured);
  };

  // Get featured blog posts
  const getFeaturedBlogPosts = (): SermonType[] => {
    return sermons.filter(sermon => sermon.featured && sermon.type === 'blog');
  };

  const value = {
    volunteers,
    projects,
    sermons,
    events,
    addVolunteer,
    getFeaturedSermons,
    getFeaturedEvents,
    getFeaturedBlogPosts,
    isLoading
  };

  return (
    <NGOContext.Provider value={value}>
      {children}
    </NGOContext.Provider>
  );
};

// Hook for using the NGO context
export const useNGO = () => {
  const context = useContext(NGOContext);
  if (context === undefined) {
    throw new Error("useNGO must be used within a NGOProvider");
  }
  return context;
};
