
import { useParams, useNavigate } from "react-router-dom";
import { useChurch } from "@/contexts/ChurchContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogPosts } = useChurch();
  
  const post = blogPosts.find(post => post.id === id);
  
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
      
      {post.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={post.imageUrl} 
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
          <span>{post.author}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(post.date), "MMMM d, yyyy")}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="prose prose-lg max-w-none">
        {post.content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
