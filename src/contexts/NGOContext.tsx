import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, SermonType, EventType, LeaderType, ProjectType } from "@/types/supabase";

interface NGOContextType {
  members: MemberType[];
  volunteers: MemberType[];
  leaders: LeaderType[];
  projects: ProjectType[];
  events: EventType[];
  addMember: (member: Partial<MemberType>) => Promise<boolean>;
  addEvent: (event: Partial<EventType>) => Promise<boolean>;
  getFeaturedProjects: () => ProjectType[];
  getFeaturedEvents: () => EventType[];
  getFeaturedBlogPosts: () => SermonType[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const NGOContext = createContext<NGOContextType | undefined>(undefined);

export const NGOProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [volunteers, setVolunteers] = useState<MemberType[]>([]);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching NGO data from Supabase...");
      
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (membersError) {
        console.error("Error fetching members:", membersError);
        throw membersError;
      }
      
      const allMembers = (membersData || []) as unknown as MemberType[];
      setMembers(allMembers);
      setVolunteers(allMembers.filter(m => m.is_active));
      console.log("Members/volunteers fetched:", allMembers ? allMembers.length : 0);
      
      const { data: leadersData, error: leadersError } = await supabase
        .from('leaders')
        .select('*')
        .order('name');
      
      if (leadersError) {
        console.error("Error fetching leaders:", leadersError);
        throw leadersError;
      }
      setLeaders((leadersData || []) as unknown as LeaderType[]);
      console.log("Leaders fetched:", leadersData ? leadersData.length : 0);
      
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
        } else {
          const safeProjectsData = (projectsData || []) as any[];
          
          const processedProjects = safeProjectsData.map(project => ({
            id: project.id,
            title: project.title || project.name || "",
            name: project.name,
            description: project.description || "",
            status: project.status || "active",
            location: project.location,
            budget: project.budget,
            progress: project.progress || 0,
            funding_goal: project.funding_goal || project.budget || 0,
            funding_current: project.funding_current || 0,
            image_url: project.image_url,
            start_date: project.start_date,
            end_date: project.end_date,
            featured: project.featured ?? false,
            created_at: project.created_at,
            updated_at: project.updated_at,
            gallery: project.gallery,
          })) as ProjectType[];
          
          setProjects(processedProjects);
          console.log("Projects fetched:", safeProjectsData.length);
        }
      } catch (error) {
        console.error("Could not fetch projects:", error);
        setProjects([]);
      }
      
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        
        if (eventsError) {
          console.error("Error fetching events:", eventsError);
        } else {
          setEvents((eventsData || []) as unknown as EventType[]);
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

  useEffect(() => {
    fetchData();

    const membersChannel = supabase
      .channel('public:members')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'members' }, 
        (payload) => {
          console.log('New member added:', payload);
          setMembers(currentMembers => [...currentMembers, payload.new as unknown as MemberType]);
          if ((payload.new as any).is_active) {
            setVolunteers(currentVols => [...currentVols, payload.new as unknown as MemberType]);
          }
          toast({
            title: "New Volunteer",
            description: `${(payload.new as any).name} has registered as a volunteer.`,
          });
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('public:events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'events' }, 
        (payload) => {
          console.log('New event added:', payload);
          setEvents(currentEvents => [...currentEvents, payload.new as unknown as EventType]);
          toast({
            title: "New Event",
            description: `Event "${(payload.new as any).title}" has been created.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  const addMember = async (member: Partial<MemberType>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
          is_active: member.is_active ?? true,
          volunteer_interests: member.volunteer_interests || []
        } as any)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newMember = data[0] as unknown as MemberType;
        setMembers(prev => [...prev, newMember]);
        if (newMember.is_active) {
          setVolunteers(prev => [...prev, newMember]);
        }
      }
      
      toast({
        title: "Success",
        description: "New volunteer added successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error adding member:", error);
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

  const addEvent = async (event: Partial<EventType>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (!event.title) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Event title is required.",
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          description: event.description || "",
          date: event.date || new Date().toISOString().split('T')[0],
          time: event.time || "12:00",
          location: event.location || "To be announced",
          image_url: event.image_url || null,
          featured: event.featured || false
        } as any)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newEvent = data[0] as unknown as EventType;
        setEvents(prev => [...prev, newEvent]);
      }
      
      toast({
        title: "Success",
        description: "New event created successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new event. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFeaturedProjects = (): ProjectType[] => {
    return projects.filter(project => project.featured);
  };

  const getFeaturedEvents = (): EventType[] => {
    return events.filter(event => event.featured);
  };

  const getFeaturedBlogPosts = (): SermonType[] => {
    return [];
  };

  const refreshData = async () => {
    return fetchData();
  };

  const value = {
    members,
    volunteers,
    leaders,
    projects,
    events,
    addMember,
    addEvent,
    getFeaturedProjects,
    getFeaturedEvents,
    getFeaturedBlogPosts,
    isLoading,
    refreshData
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
