
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, TribeType, LeaderType, SermonType, EventType } from "@/types/supabase";

// Define context types
interface ChurchContextType {
  members: MemberType[];
  tribes: TribeType[];
  leaders: LeaderType[];
  sermons: SermonType[];
  events: EventType[];
  addMember: (member: Partial<MemberType>) => Promise<boolean>;
  getFeaturedSermons: () => SermonType[];
  getFeaturedEvents: () => EventType[];
  getFeaturedBlogPosts: () => SermonType[];
  isLoading: boolean;
}

// Helper function to get tribe based on birth month
const getTribeFromBirthDate = (birthDate: string): string => {
  const month = new Date(birthDate).getMonth();
  const tribes = [
    "Reuben", "Simeon", "Levi", "Judah", 
    "Issachar", "Zebulun", "Dan", "Naphtali", 
    "Gad", "Asher", "Joseph", "Benjamin"
  ];
  return tribes[month];
};

// Create the context
const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

// Provider component
export const ChurchProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tribes
      const { data: tribesData, error: tribesError } = await supabase
        .from('tribes')
        .select('*')
        .order('name');
      
      if (tribesError) throw tribesError;
      setTribes(tribesData || []);
      
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (membersError) throw membersError;
      setMembers(membersData || []);
      
      // Fetch leaders
      const { data: leadersData, error: leadersError } = await supabase
        .from('leaders')
        .select('*')
        .order('name');
      
      if (leadersError) throw leadersError;
      setLeaders(leadersData || []);
      
      // Fetch sermons
      const { data: sermonsData, error: sermonsError } = await supabase
        .from('sermons')
        .select('*')
        .eq('type', 'sermon')
        .order('date', { ascending: false });
      
      if (sermonsError) throw sermonsError;
      setSermons(sermonsData as SermonType[] || []);
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (eventsError) throw eventsError;
      setEvents(eventsData as EventType[] || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load church data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Add a new member
  const addMember = async (member: Partial<MemberType>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if required field is present
      if (!member.name) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Member name is required.",
        });
        return false;
      }
      
      // If birth date is provided, try to auto-assign tribe based on month
      if (member.birth_date && !member.tribe_id && tribes.length > 0) {
        const tribeName = getTribeFromBirthDate(member.birth_date);
        const matchingTribe = tribes.find(t => t.name === tribeName);
        if (matchingTribe) {
          member.tribe_id = matchingTribe.id;
        }
      }
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: member.name,
          email: member.email || null,
          phone: member.phone || null,
          birth_date: member.birth_date || null,
          address: member.address || null,
          tribe_id: member.tribe_id || null,
          join_date: member.join_date || new Date().toISOString(),
          is_active: member.is_active ?? true
        })
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setMembers(prev => [...prev, data[0] as MemberType]);
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
    members,
    tribes,
    leaders,
    sermons,
    events,
    addMember,
    getFeaturedSermons,
    getFeaturedEvents,
    getFeaturedBlogPosts,
    isLoading
  };

  return (
    <ChurchContext.Provider value={value}>
      {children}
    </ChurchContext.Provider>
  );
};

// Hook for using the Church context
export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (context === undefined) {
    throw new Error("useChurch must be used within a ChurchProvider");
  }
  return context;
};
