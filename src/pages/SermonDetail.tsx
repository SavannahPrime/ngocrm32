
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Book } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SermonType, getYouTubeEmbedUrl, isYouTubeUrl, isGoogleDriveUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";

const SermonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [sermon, setSermon] = useState<SermonType | null>(null);
  
  useEffect(() => {
    const fetchSermon = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Only fetch sermons (type = 'sermon')
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('id', id)
          .eq('type', 'sermon')
          .maybeSingle();
          
        if (error) throw error;
        
        setSermon(data as SermonType);
      } catch (error) {
        console.error("Error fetching sermon:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSermon();
  }, [id]);
  
  if (loading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
      </div>
    );
  }
  
  if (!sermon) {
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-church-primary mb-4">Sermon Not Found</h1>
        <p className="mb-6">The sermon you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/sermons')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sermons
        </Button>
      </div>
    );
  }

  // Determine proper embed URL for videos
  const getEmbedUrl = (url: string): string | null => {
    if (isYouTubeUrl(url)) {
      return getYouTubeEmbedUrl(url);
    } else if (isGoogleDriveUrl(url)) {
      return getGoogleDriveEmbedUrl(url);
    }
    return url;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/sermons')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sermons
      </Button>
      
      {sermon.video_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <div className="aspect-video">
            {isYouTubeUrl(sermon.video_url) || isGoogleDriveUrl(sermon.video_url) ? (
              <iframe 
                src={getEmbedUrl(sermon.video_url) || ''} 
                className="w-full h-full" 
                allowFullScreen
                title="Sermon video"
                frameBorder="0"
              ></iframe>
            ) : (
              <video 
                src={sermon.video_url} 
                controls 
                className="w-full h-full object-cover"
              ></video>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-church-primary mb-4">
            {sermon.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>{sermon.preacher}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(new Date(sermon.date), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Book className="mr-2 h-4 w-4" />
              <span>{sermon.scripture || sermon.scripture_reference}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8">
            {(sermon.tags || []).map((tag: string, index: number) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="prose prose-lg max-w-none">
            {sermon.content && sermon.content.split('\n\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
        
        <div className="md:w-1/3">
          {sermon.image_url && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={sermon.image_url} 
                alt={sermon.title} 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="bg-church-light p-6 rounded-lg">
            <h2 className="text-lg font-bold text-church-primary mb-4">Scripture Reference</h2>
            <div className="p-4 bg-white rounded border border-gray-200 mb-4">
              <p className="italic text-gray-700">{sermon.scripture || sermon.scripture_reference}</p>
            </div>
            
            <h2 className="text-lg font-bold text-church-primary mb-2">Preached By</h2>
            <p className="text-gray-700 mb-4">{sermon.preacher}</p>
            
            <h2 className="text-lg font-bold text-church-primary mb-2">Sermon Date</h2>
            <p className="text-gray-700">{format(new Date(sermon.date), "MMMM d, yyyy")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonDetail;
