
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CalendarIcon, User, Video } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heading } from "@/components/ui/heading";
import { SermonType } from "@/types/supabase";

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<SermonType[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'blog')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        setPosts(data || []);

        // If no posts with type 'blog' are found, fetch all posts for backward compatibility
        if (!data || data.length === 0) {
          const { data: allData, error: allError } = await supabase
            .from('sermons')
            .select('*')
            .order('date', { ascending: false });
            
          if (allError) throw allError;
          
          setPosts(allData || []);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Heading title="Church Blog" description="Stay updated with our latest news and inspirational messages" center />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Heading 
        title="Church Blog" 
        description="Stay updated with our latest news and inspirational messages" 
        center 
      />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blog posts available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              {post.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <Link to={`/blog/${post.id}`} className="hover:text-church-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 line-clamp-3">
                  {post.content.substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-church-primary" />
                  <span className="text-sm text-gray-600">{post.preacher}</span>
                </div>
                <div className="flex items-center gap-2">
                  {post.video_url && (
                    <div className="flex items-center">
                      <Video className="h-4 w-4 text-church-primary" />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).slice(0, 2).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(post.tags || []).length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(post.tags || []).length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
