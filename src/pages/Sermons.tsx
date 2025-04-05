
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";

const Sermons = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [featuredSermon, setFeaturedSermon] = useState<SermonType | null>(null);
  
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        // Only fetch sermons (type = 'sermon' or null/undefined for backwards compatibility)
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .or('type.eq.sermon,type.is.null')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Find the featured sermon
        const featured = data.find(sermon => sermon.featured);
        
        if (featured) {
          setFeaturedSermon(featured as SermonType);
          // Remove the featured sermon from the regular sermons list
          setSermons((data.filter(sermon => sermon.id !== featured.id)) as SermonType[]);
        } else {
          setSermons(data as SermonType[]);
        }
      } catch (error) {
        console.error("Error fetching sermons:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSermons();
  }, []);
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Sermons</h1>
        <p className="mt-2 text-gray-600">Watch and listen to our recent messages</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      ) : (
        <>
          {featuredSermon && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Featured Sermon</h2>
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-full bg-gray-200">
                    {featuredSermon.image_url ? (
                      <img 
                        src={featuredSermon.image_url} 
                        alt={featuredSermon.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-church-light">
                        <span className="text-church-primary text-lg font-serif">Global Cathedral</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{featuredSermon.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{featuredSermon.preacher}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(featuredSermon.date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Scripture: </span>
                        <span>{featuredSermon.scripture || featuredSermon.scripture_reference}</span>
                      </div>
                      <CardDescription className="line-clamp-3 mb-4">
                        {featuredSermon.content ? featuredSermon.content.substring(0, 200) + '...' : ''}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(featuredSermon.tags || []).map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/sermons/${featuredSermon.id}`)}
                      className="w-full md:w-auto"
                    >
                      Watch/Listen
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {sermons.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Recent Sermons</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sermons.map((sermon) => (
                  <Card 
                    key={sermon.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/sermons/${sermon.id}`)}
                  >
                    <div className="h-48 bg-gray-200">
                      {sermon.image_url ? (
                        <img 
                          src={sermon.image_url} 
                          alt={sermon.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-church-light">
                          <span className="text-church-primary font-serif">Global Cathedral</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{sermon.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{sermon.preacher}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(sermon.date), "MMM d, yyyy")}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm">
                        <span className="font-semibold">Scripture: </span>
                        <span>{sermon.scripture || sermon.scripture_reference}</span>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {sermon.content ? sermon.content.substring(0, 150) + '...' : ''}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-wrap gap-2">
                        {(sermon.tags || []).slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No sermons found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sermons;
