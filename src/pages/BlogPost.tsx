
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SermonType, getYouTubeEmbedUrl, isYouTubeUrl, isGoogleDriveUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<SermonType | null>(null);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Only fetch blog posts (type = 'blog')
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('id', id)
          .eq('type', 'blog' as any)
          .maybeSingle();
          
        if (error) throw error;
        
        setPost(data as unknown as SermonType);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id]);
  
  if (loading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-church-primary mb-4">Blog Post Not Found</h1>
        <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/blog')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
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
        onClick={() => navigate('/blog')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Button>
      
      {post.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold font-serif text-church-primary mb-4">
        {post.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>{post.preacher}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {(post.tags || []).map((tag: string, index: number) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="prose prose-lg max-w-none">
        {post.content && post.content.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      {post.video_url && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Video</h2>
          <div className="rounded-lg overflow-hidden">
            {isYouTubeUrl(post.video_url) || isGoogleDriveUrl(post.video_url) ? (
              <div className="aspect-video">
                <iframe 
                  src={getEmbedUrl(post.video_url) || ''} 
                  className="w-full h-full" 
                  allowFullScreen
                  title="Embedded video"
                  frameBorder="0"
                ></iframe>
              </div>
            ) : (
              <video 
                src={post.video_url} 
                controls 
                className="w-full"
              ></video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
