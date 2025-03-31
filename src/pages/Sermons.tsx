
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChurch } from "@/contexts/ChurchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Video, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sermon } from "@/contexts/ChurchContext";

const SermonsPage = () => {
  const { sermons } = useChurch();
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>(sermons);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Apply filtering and sorting whenever sermons, searchTerm, or sortBy changes
  useEffect(() => {
    let result = [...sermons];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(term) ||
          sermon.preacher.toLowerCase().includes(term) ||
          sermon.content.toLowerCase().includes(term) ||
          sermon.scripture.toLowerCase().includes(term) ||
          (sermon.tags && sermon.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredSermons(result);
  }, [sermons, searchTerm, sortBy]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Sermons Library</h1>
        <p className="mt-2 text-gray-600">Explore our collection of sermons and be inspired by God's Word</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search sermons by title, preacher, content, or scripture..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-600">
        Showing {filteredSermons.length} {filteredSermons.length === 1 ? "sermon" : "sermons"}
        {searchTerm && <span> for "{searchTerm}"</span>}
      </div>

      {/* Sermons Grid */}
      {filteredSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
              {sermon.imageUrl ? (
                <div className="relative h-48">
                  <img 
                    src={sermon.imageUrl} 
                    alt={sermon.title} 
                    className="w-full h-full object-cover"
                  />
                  {sermon.videoUrl && (
                    <div className="absolute top-3 right-3 bg-church-primary text-white p-1.5 rounded-full">
                      <Video size={16} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <BookOpen size={48} className="text-gray-400" />
                </div>
              )}
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold mb-2 text-church-primary">{sermon.title}</h2>
                <div className="flex items-center mb-2 text-gray-600 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{sermon.date}</span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {sermon.preacher} | {sermon.scripture}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">{sermon.content}</p>
                
                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sermon.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-6 pb-6">
                <Link to={`/sermons/${sermon.id}`}>
                  <Button variant="outline" className="w-full border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                    View Sermon
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No sermons found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default SermonsPage;
