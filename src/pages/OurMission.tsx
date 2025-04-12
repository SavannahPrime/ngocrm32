
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
  ShieldCheck,
  Leaf,
  Brain,
  UserCheck
} from "lucide-react";

const OurMission = () => {
  const missionAreas = [
    {
      title: "Youth and Women Empowerment",
      description: "Providing opportunities for education, skills training, entrepreneurship, and mentorship to young people and women, especially in underserved communities.",
      icon: <UserCheck className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Gender Advocacy",
      description: "Promoting gender equality, supporting survivors of Gender-Based Violence (GBV), and fostering communities that support women's rights.",
      icon: <UserCheck className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Mental Health Awareness",
      description: "Raising awareness on mental health issues, reducing stigma, and advocating for better access to mental health services.",
      icon: <Brain className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Environmental Conservation",
      description: "Engaging in environmental conservation activities such as tree planting, waste management, and climate education to combat climate change.",
      icon: <Leaf className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Inclusion of PWDs",
      description: "Ensuring that Persons with Disabilities have equal access to education, employment, and societal participation.",
      icon: <Users className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Community Development",
      description: "Building stronger communities through infrastructure improvements, social programs, and local leadership development.",
      icon: <Home className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Economic Empowerment",
      description: "Fostering entrepreneurship, job skills, and microfinance programs that create economic independence.",
      icon: <Briefcase className="h-8 w-8 text-ngo-primary" />,
    },
    {
      title: "Policy Advocacy",
      description: "Engaging with governments and stakeholders to advocate for policies that promote equality, sustainability, and positive social impact.",
      icon: <ShieldCheck className="h-8 w-8 text-ngo-primary" />,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Mission</h1>
        <p className="mt-2 text-gray-600">Small Actions, Lasting Impact</p>
      </div>

      <div className="bg-ngo-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-6">Our Vision</h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          A just, inclusive, and sustainable society where every individual, regardless of background or ability, 
          has the opportunity to thrive, contribute, and lead in a world that values equality, mental well-being, 
          and environmental sustainability.
        </p>
      </div>
      
      <div className="bg-ngo-light p-8 rounded-lg text-center mb-16">
        <h2 className="text-2xl font-bold text-ngo-primary mb-6">Our Mission</h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          To empower and advocate for youth, PWDs (Persons with Disabilities), adolescent men and women, 
          young mothers, and vulnerable groups by promoting gender equity and equality, mental health awareness, 
          GBV (Gender-Based Violence) prevention, and climate action. Impact for Change Initiative (ICI) strives to create sustainable solutions 
          that foster social inclusion, economic empowerment, and environmental responsibility.
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
        <h2 className="text-2xl font-bold text-ngo-primary mb-8 text-center">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-ngo-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Empowerment</h3>
            <p className="text-gray-700">
              Supporting individuals and communities to achieve their fullest potential.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-ngo-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Inclusion</h3>
            <p className="text-gray-700">
              Ensuring all marginalized groups have access to opportunities and a voice in society.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-ngo-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Sustainability</h3>
            <p className="text-gray-700">
              Promoting practices that protect the environment for future generations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="h-8 w-8 text-ngo-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Equality</h3>
            <p className="text-gray-700">
              Advocating for gender, disability, and social equality for all.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-ngo-light rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-ngo-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-ngo-dark">Integrity</h3>
            <p className="text-gray-700">
              Acting with transparency, accountability, and respect for human dignity.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-ngo-primary text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border border-white/30 rounded-lg p-4">
              <p className="text-3xl font-bold">500+</p>
              <p>Youth empowered with education and vocational skills</p>
            </div>
            <div className="border border-white/30 rounded-lg p-4">
              <p className="text-3xl font-bold">1,000+</p>
              <p>Trees planted through conservation projects</p>
            </div>
            <div className="border border-white/30 rounded-lg p-4">
              <p className="text-3xl font-bold">100+</p>
              <p>GBV survivors supported with counseling and assistance</p>
            </div>
          </div>
          <p className="italic mt-6">
            "Small Actions, Lasting Impact"
          </p>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-ngo-primary mb-4">Contact Information</h2>
        <p className="mb-2"><span className="font-semibold">Office Location:</span> Kahawa Wendani</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> ici.kenya4@gmail.com</p>
        <p className="mb-2"><span className="font-semibold">Phone:</span> 0798293822</p>
      </div>
    </div>
  );
};

export default OurMission;
