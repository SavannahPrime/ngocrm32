
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, SermonType, EventType, LeaderType, TribeType } from "@/types/supabase";

// Define context types
interface ChurchContextType {
  members: MemberType[];
  sermons: SermonType[];
  events: EventType[];
  leaders: LeaderType[];
  tribes: TribeType[];
  isLoading: boolean;
}

// Create the context
const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

// Provider component
export const ChurchProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching Church data from Supabase...");
      
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('name');
      
      if (membersError) {
        console.error("Error fetching members:", membersError);
        throw membersError;
      }
      setMembers(membersData as MemberType[] || []);
      
      // Fetch sermons
      const { data: sermonsData, error: sermonsError } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });
      
      if (sermonsError) {
        console.error("Error fetching sermons:", sermonsError);
        throw sermonsError;
      }
      setSermons(sermonsData as SermonType[] || []);
      
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        throw eventsError;
      }
      setEvents(eventsData as EventType[] || []);
      
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
      
      // Fetch tribes
      const { data: tribesData, error: tribesError } = await supabase
        .from('tribes')
        .select('*')
        .order('name');
      
      if (tribesError) {
        console.error("Error fetching tribes:", tribesError);
        throw tribesError;
      }
      setTribes(tribesData as TribeType[] || []);
      
      console.log("Church data fetch completed");
      
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

  const value = {
    members,
    sermons,
    events,
    leaders,
    tribes,
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
