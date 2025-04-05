
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  BookOpen, 
  Globe, 
  Users, 
  Droplet, 
  Home, 
  Briefcase, 
  ShieldCheck 
} from "lucide-react";

const OurMission = () => {
  const missionAreas = [
    {
      title: "Clean Water Access",
      description: "We believe every person deserves access to clean, safe drinking water. Our projects focus on sustainable water solutions for communities.",
      icon: <Droplet className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Quality Education",
      description: "Education is the foundation for positive change. We work to ensure all children have access to quality education regardless of their circumstances.",
      icon: <BookOpen className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Environmental Protection",
      description: "Preserving our planet for future generations through conservation efforts, renewable energy, and sustainable practices.",
      icon: <Globe className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Community Development",
      description: "Building stronger communities through infrastructure improvements, social programs, and local leadership development.",
      icon: <Users className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Healthcare Access",
      description: "Working to provide preventative care, medical treatment, and health education to underserved regions.",
      icon: <Heart className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Sustainable Housing",
      description: "Creating safe, affordable, and environmentally responsible housing solutions for families in need.",
      icon: <Home className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Economic Empowerment",
      description: "Fostering entrepreneurship, job skills, and microfinance programs that create economic independence.",
      icon: <Briefcase className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Human Rights",
      description: "Advocating for equality, justice, and dignity for all people regardless of race, gender, or background.",
      icon: <ShieldCheck className="h-8 w-8 text-ngo-primary" />,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Mission</h1>
        <p className="mt-2 text-gray-600">Empowering communities for sustainable development and positive change</p>
      </div>

      <div className="bg-ngo-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-6">Our Vision</h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          We envision a world where every person has access to the resources, opportunities, and support 
          they need to create a better future for themselves, their families, and their communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {missionAreas.map((area, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-ngo-primary">
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  {area.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ngo-dark mb-3">{area.title}</h2>
                  <p className="text-gray-700">{area.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-8 text-center">Our Approach</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-ngo-primary">1</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Assess Needs</h3>
            <p className="text-gray-700">
              We work directly with communities to understand their unique challenges and priorities.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-ngo-primary">2</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Collaborative Planning</h3>
            <p className="text-gray-700">
              Together with local leaders, we develop sustainable solutions that address root causes.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-ngo-primary">3</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Empower & Sustain</h3>
            <p className="text-gray-700">
              We build local capacity and establish systems for long-term success and independence.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-ngo-primary text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="mb-6">
            At HopeHarbor, we are committed to transparency, accountability, and measurable impact. 
            We believe in the power of collaboration and work alongside communities, governments, and 
            other organizations to create meaningful and lasting change.
          </p>
          <p className="italic">
            "We don't just provide aid; we build partnerships that empower communities to chart their own future."
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurMission;
