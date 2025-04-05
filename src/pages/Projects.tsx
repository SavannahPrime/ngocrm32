
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Building, BookOpen as Education, Users as Community, Heart as Health } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ProjectType } from "@/types/supabase";

// Helper function to get the right icon for a category
const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('water') || categoryLower.includes('clean')) return <Droplet className="h-4 w-4" />;
  if (categoryLower.includes('infrastructure') || categoryLower.includes('building')) return <Building className="h-4 w-4" />;
  if (categoryLower.includes('education') || categoryLower.includes('school')) return <Education className="h-4 w-4" />;
  if (categoryLower.includes('community')) return <Community className="h-4 w-4" />;
  if (categoryLower.includes('health') || categoryLower.includes('medical')) return <Health className="h-4 w-4" />;
  return null;
};

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Check if featured property exists, if not, use a fallback approach
          // For example, we can consider the first few projects as "featured"
          // or use a different criterion like funding_goal being high
          
          // Option 1: Check if property exists
          const hasFeaturedProperty = data.some(project => 'featured' in project);
          
          if (hasFeaturedProperty) {
            // If the featured property exists, use it
            const featured = data.filter(project => project.featured === true);
            const regular = data.filter(project => !project.featured);
            setFeaturedProjects(featured);
            setProjects(regular);
          } else {
            // Option 2: Use an alternative approach - show projects with highest funding_goal as featured
            // Sort by funding_goal (descending) and take the top 3 as featured
            const sortedByFunding = [...data].sort((a, b) => 
              (b.funding_goal || 0) - (a.funding_goal || 0)
            );
            
            setFeaturedProjects(sortedByFunding.slice(0, 3));
            setProjects(sortedByFunding.slice(3));
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-ngo-primary">Our Projects</h1>
        <p className="mt-2 text-gray-600">Making a difference in communities around the world</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {featuredProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-ngo-primary mb-6">Featured Projects</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <div 
                    key={project.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
                          <span className="text-ngo-primary">HopeHarbor</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span>East Africa Team</span>
                        <span>•</span>
                        <span>{project.start_date ? format(new Date(project.start_date), "MMMM yyyy") : "Ongoing"}</span>
                      </div>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.status && (
                          <Badge variant="outline" className="flex items-center gap-1 py-1">
                            <Droplet className="h-4 w-4" />
                            Water
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1 py-1">
                          <Building className="h-4 w-4" />
                          Infrastructure
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 py-1">
                          <Health className="h-4 w-4" />
                          Health
                        </Badge>
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

          <div>
            <h2 className="text-2xl font-bold text-ngo-primary mb-6">{featuredProjects.length > 0 ? "All Projects" : "Our Projects"}</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
                        <span className="text-ngo-primary">HopeHarbor</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span>East Africa Team</span>
                      <span>•</span>
                      <span>{project.start_date ? format(new Date(project.start_date), "MMMM yyyy") : "Ongoing"}</span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="flex items-center gap-1 py-1">
                        <Education className="h-4 w-4" />
                        Education
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 py-1">
                        <Building className="h-4 w-4" />
                        Infrastructure
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1 py-1">
                        <Community className="h-4 w-4" />
                        Community
                      </Badge>
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
        </div>
      )}
    </div>
  );
};

export default Projects;
