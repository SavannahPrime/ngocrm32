
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the sermon/blog post type
interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  content: string;
  video_url?: string;
  image_url?: string;
  featured: boolean;
  tags: string[];
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Sermon | null>(null);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // For now, we're using the sermons table as blog posts
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (error) throw error;
        
        setPost(data);
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
        {post.content.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
