
import { useEffect, useState } from "react";
import { format, isAfter, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Heading } from "@/components/ui/heading";

// Define the event type
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image_url?: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
          
        if (error) throw error;
        
        // Split events into upcoming and past
        const events = data || [];
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to beginning of today
        
        const upcoming: Event[] = [];
        const past: Event[] = [];
        
        for (const event of events) {
          const eventDate = parseISO(event.date);
          if (isAfter(eventDate, now) || eventDate.getTime() === now.getTime()) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        }
        
        setUpcomingEvents(upcoming);
        setPastEvents(past.reverse()); // Show most recent past events first
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Heading title="Church Events" description="Join us for our upcoming events and gatherings" center />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Heading 
        title="Church Events" 
        description="Join us for our upcoming events and gatherings" 
        center 
      />

      {/* Upcoming Events Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-serif font-bold text-church-primary mb-6">Upcoming Events</h2>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center bg-white rounded-lg shadow p-8">
            <p className="text-gray-600">There are no upcoming events at this time. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">
                    {event.title}
                    {event.featured && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-church-light text-church-primary">
                        Featured
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {event.description.length > 150 
                      ? `${event.description.substring(0, 150)}...` 
                      : event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-church-primary hover:bg-church-primary/90">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-church-primary mb-6">Past Events</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {pastEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex flex-col md:flex-row p-6 gap-4">
                  {event.image_url && (
                    <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(new Date(event.date), "MMMM d, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600 line-clamp-2">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {pastEvents.length > 5 && (
              <div className="px-6 py-4 bg-gray-50 text-center">
                <Button variant="outline">View All Past Events</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
