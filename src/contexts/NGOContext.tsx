
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, SermonType, EventType, LeaderType, ProjectType } from "@/types/supabase";

// Define context types
interface NGOContextType {
  members: MemberType[];
  volunteers: MemberType[];
  leaders: LeaderType[];
  projects: ProjectType[];
  events: EventType[];
  addMember: (member: Partial<MemberType>) => Promise<boolean>;
  getFeaturedProjects: () => ProjectType[];
  getFeaturedEvents: () => EventType[];
  getFeaturedBlogPosts: () => SermonType[];
  isLoading: boolean;
}

// Create the context
const NGOContext = createContext<NGOContextType | undefined>(undefined);

// Provider component
export const NGOProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [volunteers, setVolunteers] = useState<MemberType[]>([]);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching NGO data from Supabase...");
      
      // Fetch members/volunteers
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (membersError) {
        console.error("Error fetching members:", membersError);
        throw membersError;
      }
      
      // Split into members and volunteers based on a field (you might need to adjust this logic)
      const allMembers = membersData as MemberType[] || [];
      setMembers(allMembers);
      setVolunteers(allMembers.filter(m => m.is_active)); // Example filter
      console.log("Members/volunteers fetched:", allMembers ? allMembers.length : 0);
      
      // Fetch leaders
      const { data: leadersData, error: leadersError } = await supabase
        .from('leaders')
        .select('*')
        .order('name');
      
      if (leadersError) {
        console.error("Error fetching leaders:", leadersError);
        throw leadersError;
      }
      setLeaders(leadersData as LeaderType[] || []);
      console.log("Leaders fetched:", leadersData ? leadersData.length : 0);
      
      // Try to fetch projects
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
        } else {
          // Normalize project data to match our ProjectType interface
          const processedProjects = (projectsData || []).map(project => ({
            id: project.id,
            title: project.title || project.name || "",
            description: project.description || "",
            status: project.status || "active",
            funding_goal: project.funding_goal || project.budget || 0,
            funding_current: project.funding_current || 0,
            image_url: project.image_url,
            start_date: project.start_date,
            end_date: project.end_date,
            featured: project.featured ?? false,
            created_at: project.created_at,
            updated_at: project.updated_at,
            name: project.name,
            location: project.location,
            gallery: project.gallery,
            budget: project.budget,
            progress: project.progress
          })) as ProjectType[];
          
          setProjects(processedProjects);
          console.log("Projects fetched:", projectsData ? projectsData.length : 0);
        }
      } catch (error) {
        console.error("Could not fetch projects:", error);
        setProjects([]);
      }
      
      // Try to fetch events
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

  // Add a new member/volunteer
  const addMember = async (member: Partial<MemberType>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if required field is present
      if (!member.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Name is required.",
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: member.name,
          email: member.email || null,
          phone: member.phone || null,
          birth_date: member.birth_date || null,
          address: member.address || null,
          join_date: member.join_date || new Date().toISOString(),
          is_active: member.is_active ?? true
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setMembers(prev => [...prev, data[0] as MemberType]);
        if (data[0].is_active) {
          setVolunteers(prev => [...prev, data[0] as MemberType]);
        }
      }
      
      toast({
        title: "Success",
        description: "New member added successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add new member. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get featured projects
  const getFeaturedProjects = (): ProjectType[] => {
    return projects.filter(project => project.featured);
  };

  // Get featured events
  const getFeaturedEvents = (): EventType[] => {
    return events.filter(event => event.featured);
  };

  // Get featured blog posts
  const getFeaturedBlogPosts = (): SermonType[] => {
    return []; // This needs to be implemented based on your data model
  };

  const value = {
    members,
    volunteers,
    leaders,
    projects,
    events,
    addMember,
    getFeaturedProjects,
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

export const useNGO = () => {
  const context = useContext(NGOContext);
  if (context === undefined) {
    throw new Error("useNGO must be used within an NGOProvider");
  }
  return context;
};
