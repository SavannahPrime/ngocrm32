
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";
import { Water, Infrastructure, BookOpen as Education, Users as Community, Heart as Health } from "lucide-react";

// Helper function to get the right icon for a tag
const getTagIcon = (tag: string) => {
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('water') || tagLower.includes('clean')) return <Water className="h-4 w-4" />;
  if (tagLower.includes('infrastructure') || tagLower.includes('building')) return <Infrastructure className="h-4 w-4" />;
  if (tagLower.includes('education') || tagLower.includes('school')) return <Education className="h-4 w-4" />;
  if (tagLower.includes('community')) return <Community className="h-4 w-4" />;
  if (tagLower.includes('health') || tagLower.includes('medical')) return <Health className="h-4 w-4" />;
  return null;
};

const Blog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<SermonType[]>([]);
  const [featuredPost, setFeaturedPost] = useState<SermonType | null>(null);
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Only fetch blog posts (type = 'blog')
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'blog')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // Find the featured post
        const featured = data.find(post => post.featured);
        
        if (featured) {
          setFeaturedPost(featured);
          // Remove the featured post from the regular posts list
          setPosts(data.filter(post => post.id !== featured.id));
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, []);
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-ngo-primary">Our Blog</h1>
        <p className="mt-2 text-gray-600">Stay updated with our latest projects and initiatives</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
        </div>
      ) : (
        <div className="grid gap-8">
          {/* Project Cards - styled like the image */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="h-48 bg-gray-200">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-ngo-light">
                      <span className="text-ngo-primary">HopeHarbor</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>{post.preacher}</span>
                    <span>•</span>
                    <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
                  </div>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(post.tags || []).map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 py-1">
                        {getTagIcon(tag)}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="default"
                    className="w-full bg-ngo-primary hover:bg-ngo-primary/90"
                  >
                    View Project
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
