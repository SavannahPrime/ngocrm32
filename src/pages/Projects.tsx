import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ProjectType } from "@/types/supabase";

const Projects = () => {
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Type the data properly including the featured property
        const projectsData = data as ProjectType[];
        
        // If there's no featured property, we'll handle it
        setFeaturedProjects(projectsData.filter(p => p.featured === true));
        setAllProjects(projectsData);
        
        console.log("Projects fetched:", projectsData.length);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load projects. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);

  useEffect(() => {
    // Filter projects based on search query
    if (searchQuery) {
      const filtered = allProjects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
    }
  }, [searchQuery, allProjects]);

  const projectsToDisplay = searchQuery ? filteredProjects : allProjects;

  if (isLoading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Projects</h1>
        <p className="mt-2 text-gray-600">Explore the initiatives driving change in communities worldwide</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-ngo-dark mb-6 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      <section>
        <h2 className="text-2xl font-bold text-ngo-dark mb-6 text-center">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsToDisplay.length > 0 ? (
            projectsToDisplay.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

interface ProjectCardProps {
  project: ProjectType;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const progress = Math.min((project.funding_current / project.funding_goal) * 100, 100);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-4 aspect-h-3 bg-gray-200">
        <img
          src={project.image_url}
          alt={project.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-gray-600">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {project.funding_current} / {project.funding_goal}
          </span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
        <progress className="w-full h-2 bg-gray-200 rounded-full" value={progress} max="100"></progress>
        <Badge>{project.status}</Badge>
      </CardContent>
      <CardContent>
        <div className="flex items-center text-ngo-primary">
          <Link to={`/projects/${project.id}`} className="text-sm hover:underline">
            Learn More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
