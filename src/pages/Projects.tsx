
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
import { Globe, Droplet, BookOpen, Heart, Users } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";

// Define project category types and icons
const projectCategories = {
  "water": { name: "Clean Water", icon: <Droplet className="h-4 w-4 mr-1" /> },
  "education": { name: "Education", icon: <BookOpen className="h-4 w-4 mr-1" /> },
  "health": { name: "Healthcare", icon: <Heart className="h-4 w-4 mr-1" /> },
  "community": { name: "Community", icon: <Users className="h-4 w-4 mr-1" /> },
  "environment": { name: "Environment", icon: <Globe className="h-4 w-4 mr-1" /> },
};

// Helper function to get icon based on tag
const getCategoryIcon = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  for (const [key, value] of Object.entries(projectCategories)) {
    if (lowerTag.includes(key)) {
      return value.icon;
    }
  }
  return <Globe className="h-4 w-4 mr-1" />;
};

const Projects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<SermonType[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Use the sermons table but filter for type = 'project'
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'project')
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        // If no projects in database, create dummy data
        if (!data || data.length === 0) {
          setProjects(getDummyProjects());
        } else {
          setProjects(data as SermonType[]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(getDummyProjects());
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Helper to get dummy projects if DB is empty
  const getDummyProjects = (): SermonType[] => {
    return [
      {
        id: "1",
        title: "Clean Water Initiative in Eastern Africa",
        content: "This project has installed over 200 water wells and filtration systems in rural communities across Tanzania and Kenya, providing clean water to over 50,000 people.",
        date: new Date().toISOString(),
        preacher: "East Africa Team",
        scripture: "",
        featured: true,
        image_url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Water", "Infrastructure", "Health"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        title: "Education For All: School Building Program",
        content: "We've constructed 15 schools in rural India and Bangladesh, providing education access to over 5,000 children who previously had to walk miles to the nearest school.",
        date: new Date().toISOString(),
        preacher: "Education Team",
        scripture: "",
        featured: true,
        image_url: "https://images.unsplash.com/photo-1613578723472-f602d267a0c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Education", "Infrastructure", "Community"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "3",
        title: "Sustainable Agriculture in Central America",
        content: "Working with local farmers in Guatemala and Honduras to implement sustainable farming techniques that increase crop yields while preserving the environment.",
        date: new Date().toISOString(),
        preacher: "Americas Team",
        scripture: "",
        featured: false,
        image_url: "https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Environment", "Agriculture", "Economic"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "4",
        title: "Mobile Health Clinics in Southeast Asia",
        content: "Our fleet of mobile health clinics provides basic medical care, vaccinations, and health education to remote villages in Cambodia, Laos, and Vietnam.",
        date: new Date().toISOString(),
        preacher: "Healthcare Team",
        scripture: "",
        featured: false,
        image_url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Health", "Medical", "Education"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "5",
        title: "Women's Microfinance Initiative",
        content: "Empowering women entrepreneurs in West Africa through microloans, business training, and mentorship to start and grow sustainable businesses.",
        date: new Date().toISOString(),
        preacher: "Economic Team",
        scripture: "",
        featured: false,
        image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        tags: ["Economic", "Women", "Community"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "6",
        title: "Rainforest Conservation Project",
        content: "Working with indigenous communities to protect rainforests in Brazil and Peru through sustainable management practices and alternative income sources.",
        date: new Date().toISOString(),
        preacher: "Environment Team",
        scripture: "",
        featured: false,
        image_url: "https://images.unsplash.com/photo-1494368308039-ed3393ead79c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        tags: ["Environment", "Conservation", "Community"],
        type: "project",
        video_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    ];
  };

  // Extract all unique tags from projects
  const getAllTags = () => {
    const tagSet = new Set<string>();
    projects.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
      }
    });
    return Array.from(tagSet);
  };

  // Filter projects based on active filter
  const filteredProjects = activeFilter 
    ? projects.filter(project => 
        project.tags && project.tags.some(tag => 
          tag.toLowerCase().includes(activeFilter.toLowerCase())
        )
      )
    : projects;

  // Separate featured projects
  const featuredProjects = filteredProjects.filter(project => project.featured);
  const regularProjects = filteredProjects.filter(project => !project.featured);
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-heading text-ngo-primary">Our Projects</h1>
        <p className="mt-2 text-gray-600">Discover how we're making a difference around the world</p>
      </div>
      
      {/* Project Filters */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <Badge 
          className={`cursor-pointer py-2 px-4 text-sm ${!activeFilter ? 'bg-ngo-primary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveFilter(null)}
        >
          All Projects
        </Badge>
        {Object.entries(projectCategories).map(([key, category]) => (
          <Badge 
            key={key}
            className={`cursor-pointer py-2 px-4 text-sm flex items-center ${activeFilter === key ? 'bg-ngo-primary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveFilter(activeFilter === key ? null : key)}
          >
            {category.icon} {category.name}
          </Badge>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
        </div>
      ) : (
        <>
          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-heading text-ngo-primary mb-6">Featured Projects</h2>
              
              <div className="grid gap-8 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="h-64 md:h-full bg-gray-200">
                        {project.image_url ? (
                          <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-ngo-light">
                            <span className="text-ngo-primary text-lg font-heading">Project Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{project.preacher}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(project.date), "MMMM yyyy")}</span>
                          </div>
                          <CardDescription className="line-clamp-3 mb-4">
                            {project.content.substring(0, 150)}...
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(project.tags || []).map((tag, index) => {
                              const icon = getCategoryIcon(tag);
                              return (
                                <Badge key={index} variant="outline" className="flex items-center">
                                  {icon} {tag}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                        <Button 
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="w-full md:w-auto"
                        >
                          View Project
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Projects */}
          {regularProjects.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold font-heading text-ngo-primary mb-6">All Projects</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularProjects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div className="h-48 bg-gray-200">
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-ngo-light">
                          <span className="text-ngo-primary font-heading">Project Image</span>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{project.preacher}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(project.date), "MMM yyyy")}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3">
                        {project.content.substring(0, 150)}...
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-wrap gap-2">
                        {(project.tags || []).slice(0, 3).map((tag, index) => {
                          const icon = getCategoryIcon(tag);
                          return (
                            <Badge key={index} variant="outline" className="flex items-center">
                              {icon} {tag}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            !loading && featuredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects found with the selected filter.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
