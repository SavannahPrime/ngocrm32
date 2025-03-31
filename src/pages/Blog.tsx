
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
        <h1 className="text-3xl font-bold font-serif text-church-primary">Church Blog</h1>
        <p className="mt-2 text-gray-600">Stay updated with our latest church news and articles</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      ) : (
        <>
          {featuredPost && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Featured Post</h2>
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-full bg-gray-200">
                    {featuredPost.image_url ? (
                      <img 
                        src={featuredPost.image_url} 
                        alt={featuredPost.title} 
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
                      <CardTitle className="text-2xl mb-2">{featuredPost.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{featuredPost.preacher}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(featuredPost.date), "MMMM d, yyyy")}</span>
                      </div>
                      <CardDescription className="line-clamp-3 mb-4">
                        {featuredPost.content.substring(0, 200)}...
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(featuredPost.tags || []).map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}
                      className="w-full md:w-auto"
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {posts.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Recent Posts</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                        <div className="flex items-center justify-center h-full bg-church-light">
                          <span className="text-church-primary font-serif">Global Cathedral</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{post.preacher}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-wrap gap-2">
                        {(post.tags || []).slice(0, 3).map((tag, index) => (
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
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;
