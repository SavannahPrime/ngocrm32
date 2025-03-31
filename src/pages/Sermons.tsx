
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, User, Video, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";
import { toast } from "sonner";

const Sermons = () => {
  const [loading, setLoading] = useState(true);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setLoading(true);
        // Only fetch sermons (type = 'sermon')
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'sermon')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setSermons(data || []);
        
        // Extract all unique tags
        const tags = data?.reduce((acc: string[], sermon) => {
          if (sermon.tags && Array.isArray(sermon.tags)) {
            sermon.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []) || [];
        
        setAllTags(tags);
      } catch (error) {
        console.error("Error fetching sermons:", error);
        toast.error("Failed to load sermons");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSermons();
  }, []);

  // Filter sermons by tag if a tag is selected
  const filteredSermons = selectedTag
    ? sermons.filter(sermon => sermon.tags?.includes(selectedTag))
    : sermons;

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Heading title="Sermons" description="Listen to our latest sermons and teachings" center />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Heading 
        title="Sermons" 
        description="Listen to our latest sermons and teachings" 
        center 
      />

      {/* Filter by tag */}
      {allTags.length > 0 && (
        <div className="mt-6 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              onClick={() => setSelectedTag(null)}
              className="mb-2"
            >
              All Sermons
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                className="mb-2"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {filteredSermons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No sermons available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredSermons.map((sermon) => (
            <Card key={sermon.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              {sermon.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={sermon.image_url} 
                    alt={sermon.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <Link to={`/sermons/${sermon.id}`} className="hover:text-church-primary transition-colors">
                    {sermon.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(sermon.date), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 mb-2 text-gray-600">
                  <User className="h-4 w-4 text-church-primary" />
                  <span>{sermon.preacher}</span>
                </div>
                <div className="flex items-center gap-2 mb-4 text-gray-600">
                  <Book className="h-4 w-4 text-church-primary" />
                  <span>{sermon.scripture}</span>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {sermon.content.substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {sermon.video_url && (
                    <Video className="h-4 w-4 text-church-primary" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(sermon.tags || []).slice(0, 2).map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(sermon.tags || []).length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(sermon.tags || []).length - 2}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sermons;
