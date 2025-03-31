
import { useChurch } from "@/contexts/ChurchContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";

const Blog = () => {
  const { blogPosts } = useChurch();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-church-primary">Church Blog</h1>
        <p className="mt-2 text-gray-600">Stay updated with our latest news and inspirational messages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {post.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
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
            <CardContent>
              <p className="text-gray-600 line-clamp-3">
                {post.content.substring(0, 150)}...
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-church-primary" />
                <span className="text-sm text-gray-600">{post.author}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Blog;
