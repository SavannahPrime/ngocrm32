
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useChurch } from "@/contexts/ChurchContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, BookOpen, Video, Share2, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SermonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { sermons } = useChurch();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState(sermons.find(s => s.id === id));
  const [loading, setLoading] = useState(true);
  const [relatedSermons, setRelatedSermons] = useState([]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timer = setTimeout(() => {
      const foundSermon = sermons.find(s => s.id === id);
      setSermon(foundSermon);
      
      // If sermon not found, we'll handle that in the render
      if (foundSermon) {
        // Find related sermons based on tags, exclude current sermon
        const related = sermons
          .filter(s => 
            s.id !== id && 
            s.tags && 
            foundSermon.tags && 
            s.tags.some(tag => foundSermon.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedSermons(related);
      }
      
      setLoading(false);
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [id, sermons]);

  // Handle not found
  if (!loading && !sermon) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <BookOpen size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold font-serif text-church-primary mb-4">Sermon Not Found</h1>
        <p className="text-gray-600 mb-8">The sermon you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/sermons')} className="bg-church-primary hover:bg-church-primary/90">
          Return to Sermons
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/sermons')}
            className="text-church-primary hover:text-church-primary/90 hover:bg-church-light p-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Sermons
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4 mt-2" />
            <Skeleton className="h-72 w-full mt-6" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 md:p-8">
                <h1 className="text-3xl font-bold font-serif text-church-primary mb-3">{sermon.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{sermon.date}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{sermon.scripture}</span>
                  </div>
                  <div>
                    <span className="font-medium">{sermon.preacher}</span>
                  </div>
                </div>
                
                {/* Sermon image or video */}
                {sermon.videoUrl ? (
                  <div className="mb-8 rounded-lg overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={sermon.videoUrl.replace('watch?v=', 'embed/')}
                        title={sermon.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-96 border-0"
                      ></iframe>
                    </div>
                  </div>
                ) : sermon.imageUrl ? (
                  <div className="mb-8">
                    <img 
                      src={sermon.imageUrl}
                      alt={sermon.title}
                      className="rounded-lg w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                ) : null}
                
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {sermon.videoUrl && (
                    <Button variant="outline" className="flex items-center">
                      <Video className="mr-2 h-4 w-4" />
                      Watch Video
                    </Button>
                  )}
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2 h-4 w-4" />
                    Download Audio
                  </Button>
                  <Button variant="outline" className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                
                {/* Sermon content */}
                <div className="sermon-content">
                  <p className="text-gray-700 whitespace-pre-line">{sermon.content}</p>
                </div>
                
                {/* Tags */}
                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {sermon.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-church-light text-church-primary px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Related sermons */}
            {relatedSermons.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">
                  Related Sermons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedSermons.map((related) => (
                    <Link key={related.id} to={`/sermons/${related.id}`} className="block">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow">
                        {related.imageUrl ? (
                          <img 
                            src={related.imageUrl} 
                            alt={related.title} 
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <div className="h-40 bg-gray-200 flex items-center justify-center">
                            <BookOpen size={32} className="text-gray-400" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-church-primary line-clamp-2">{related.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">{related.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SermonDetail;
