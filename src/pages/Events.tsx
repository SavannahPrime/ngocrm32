
import { useState, useEffect } from "react";
import { useChurch, Event } from "@/contexts/ChurchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, MapPin, Clock } from "lucide-react";

const EventsPage = () => {
  const { events } = useChurch();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  
  // Get current date for filtering
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Group events by month
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    
    groups[month].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  // Sort months chronologically
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  // Filter events based on search term and active tab
  useEffect(() => {
    let filtered = [...events];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term)
      );
    }
    
    // Apply tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter(event => new Date(event.date) >= currentDate);
    } else if (activeTab === "past") {
      filtered = filtered.filter(event => new Date(event.date) < currentDate);
    } else if (activeTab === "featured") {
      filtered = filtered.filter(event => event.featured);
    }
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, activeTab, currentDate]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Church Events</h1>
        <p className="mt-2 text-gray-600">Join us for these upcoming gatherings and activities</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search events by title, description, or location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="space-y-12">
          {sortedMonths.map(month => (
            <div key={month}>
              <h2 className="text-2xl font-bold font-serif text-church-primary mb-6 border-b pb-2">
                {month}
              </h2>
              
              <div className="space-y-6">
                {groupedEvents[month].map(event => (
                  <div 
                    key={event.id} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row
                      ${event.featured ? 'border-l-4 border-church-primary' : ''}
                      ${new Date(event.date) < currentDate ? 'opacity-70' : ''}`}
                  >
                    {event.imageUrl ? (
                      <div className="md:w-1/4">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-church-light md:w-1/4 h-48 md:h-auto flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-church-primary" />
                      </div>
                    )}
                    
                    <div className="p-6 md:w-3/4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-xl font-bold text-church-primary mb-2 md:mb-0">
                          {event.title}
                          {event.featured && (
                            <span className="ml-2 bg-church-primary text-white text-xs font-semibold px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </h3>
                        
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button className="bg-church-primary hover:bg-church-primary/90">
                          Register Now
                        </Button>
                        <Button variant="outline" className="border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                          Add to Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No events found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter to find events
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
