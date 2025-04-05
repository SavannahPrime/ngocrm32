
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, MapPin, Globe, Droplet, BookOpen, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SermonType, getYouTubeEmbedUrl, isYouTubeUrl, isGoogleDriveUrl, getGoogleDriveEmbedUrl } from "@/types/supabase";

// Helper function to get icon based on tag
const getCategoryIcon = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  if (lowerTag.includes("water")) return <Droplet className="h-4 w-4 mr-1" />;
  if (lowerTag.includes("education")) return <BookOpen className="h-4 w-4 mr-1" />;
  if (lowerTag.includes("health")) return <Heart className="h-4 w-4 mr-1" />;
  if (lowerTag.includes("community")) return <Users className="h-4 w-4 mr-1" />;
  if (lowerTag.includes("environment")) return <Globe className="h-4 w-4 mr-1" />;
  return <Globe className="h-4 w-4 mr-1" />;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<SermonType | null>(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Try to fetch from database
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('id', id)
          .eq('type', 'project')
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setProject(data);
        } else {
          // If not found in DB, use dummy data
          setProject(getDummyProject(id));
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject(getDummyProject(id));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  // Helper to get dummy project if not found in DB
  const getDummyProject = (projectId: string): SermonType => {
    const dummyProjects = [
      {
        id: "1",
        title: "Clean Water Initiative in Eastern Africa",
        content: `Our Clean Water Initiative has been operating in Tanzania and Kenya for the past decade, addressing one of the most critical needs in rural communities: access to clean, safe drinking water.

        The Problem:
        Over 40% of rural communities in these regions lacked access to clean water, forcing women and children to walk miles each day to collect water from contaminated sources. Waterborne diseases were rampant, affecting health, school attendance, and overall community development.

        Our Approach:
        1. Community-Led Planning: We work directly with local leaders to identify needs and optimal solutions for each community.
        2. Sustainable Technology: We implement appropriate technologies including drilled wells, protected springs, rainwater harvesting systems, and biosand filters.
        3. Local Capacity Building: We train community members in maintenance and repair, ensuring long-term sustainability.
        4. Health Education: We provide comprehensive education on hygiene practices, water storage, and disease prevention.

        Impact:
        - Installed over 200 water wells and filtration systems
        - Reduced waterborne diseases by 70% in target communities
        - Decreased water collection time from 3+ hours to less than 20 minutes
        - Improved school attendance, especially among girls
        - Trained 150+ local technicians in system maintenance

        Sustainability Measures:
        Each community establishes a water committee and fee structure that ensures funds are available for maintenance and repairs. Our local staff provides ongoing support and monitoring to ensure systems remain operational.

        Future Plans:
        We're expanding to reach an additional 75 communities in the next three years, while developing innovative water conservation techniques and exploring solar-powered pumping systems for deeper wells.`,
        date: new Date().toISOString(),
        preacher: "East Africa Team",
        scripture: "",
        featured: true,
        image_url: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Water", "Infrastructure", "Health"],
        type: "project",
        video_url: "https://www.youtube.com/watch?v=4u36_-93Tp0",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "2",
        title: "Education For All: School Building Program",
        content: `Education For All is our flagship education initiative working to ensure that children in rural and marginalized communities have access to quality education facilities and resources.

        The Problem:
        In many rural areas of India and Bangladesh, children face significant barriers to education, including lack of nearby schools, inadequate facilities, and shortage of trained teachers. Many students must walk several miles to attend school, leading to high dropout rates, especially among girls.

        Our Approach:
        1. School Construction: We build environmentally appropriate schools designed to withstand local weather conditions and natural disasters.
        2. Teacher Training: We provide comprehensive training programs for local teachers, focusing on modern teaching methodologies and child-centered learning.
        3. Community Involvement: We establish school management committees comprised of parents and community leaders to ensure local ownership.
        4. Educational Resources: We equip each school with libraries, learning materials, and when possible, computer facilities.

        Impact:
        - Constructed 15 schools serving over 5,000 children
        - Trained 120+ teachers in modern teaching methods
        - Achieved 95% retention rate among enrolled students
        - Increased girls' enrollment by 80%
        - Improved academic performance by 40% compared to baseline

        Sustainability Measures:
        We partner with local education departments to ensure teacher salaries and operational costs are integrated into government budgets after our initial support period. Community contributions, both financial and in-kind, create a sense of ownership and responsibility.

        Future Plans:
        We're developing a comprehensive distance learning program to reach even more remote communities, while expanding our teacher training to include digital literacy and specialized education for children with disabilities.`,
        date: new Date().toISOString(),
        preacher: "Education Team",
        scripture: "",
        featured: true,
        image_url: "https://images.unsplash.com/photo-1613578723472-f602d267a0c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        tags: ["Education", "Infrastructure", "Community"],
        type: "project",
        video_url: "https://www.youtube.com/watch?v=Xlg8zdSVjgg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return dummyProjects.find(p => p.id === projectId) || dummyProjects[0];
  };
  
  if (loading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-ngo-primary mb-4">Project Not Found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  // Determine proper embed URL for videos
  const getEmbedUrl = (url: string): string | null => {
    if (isYouTubeUrl(url)) {
      return getYouTubeEmbedUrl(url);
    } else if (isGoogleDriveUrl(url)) {
      return getGoogleDriveEmbedUrl(url);
    }
    return url;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/projects')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>
      
      {project.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold font-heading text-ngo-primary mb-4">
        {project.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>{project.preacher}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{format(new Date(project.date), "MMMM yyyy")}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4" />
          <span>East Africa Region</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {(project.tags || []).map((tag: string, index: number) => (
          <Badge key={index} variant="outline" className="flex items-center">
            {getCategoryIcon(tag)}
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="prose prose-lg max-w-none">
        {project.content.split('\n\n').map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      {project.video_url && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Project Video</h2>
          <div className="rounded-lg overflow-hidden shadow-md">
            {isYouTubeUrl(project.video_url) || isGoogleDriveUrl(project.video_url) ? (
              <div className="aspect-video">
                <iframe 
                  src={getEmbedUrl(project.video_url) || ''} 
                  className="w-full h-full" 
                  allowFullScreen
                  title="Project video"
                  frameBorder="0"
                ></iframe>
              </div>
            ) : (
              <video 
                src={project.video_url} 
                controls 
                className="w-full"
              ></video>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-12 bg-ngo-light p-6 rounded-lg">
        <h2 className="text-xl font-bold text-ngo-primary mb-4">Support This Project</h2>
        <p className="mb-4">
          Your support can help us expand this project and reach more communities in need. 
          Together, we can create lasting change and improve lives.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => navigate('/donate')} className="bg-ngo-primary hover:bg-ngo-primary/90">
            Donate Now
          </Button>
          <Button onClick={() => navigate('/volunteer')} variant="outline">
            Volunteer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
