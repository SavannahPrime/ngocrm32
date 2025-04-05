import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Globe, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useNGO } from "@/contexts/NGOContext";

const OurTeam = () => {
  const { leaders, isLoading } = useNGO();
  
  // Sort leaders by featured status
  const sortedLeaders = [...leaders].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
  
  // Leadership team
  const executiveTeam = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      bio: "Sarah has 15 years of experience in international development, with a focus on clean water initiatives and education. She has led projects in 12 countries across Africa and Southeast Asia.",
      image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      contact_email: "sarah@hopeharbor.org",
    },
    {
      name: "David Chen",
      role: "Operations Director",
      bio: "With a background in logistics and management, David oversees all operational aspects of our projects worldwide. His expertise in efficient resource allocation has helped maximize our impact.",
      image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      contact_email: "david@hopeharbor.org",
    },
    {
      name: "Maya Patel",
      role: "Program Director",
      bio: "Maya has a Ph.D. in International Development and has dedicated her career to creating sustainable education programs. She has worked with UNESCO and various NGOs before joining HopeHarbor.",
      image_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      contact_email: "maya@hopeharbor.org",
    },
    {
      name: "Robert Nakamura",
      role: "Development Director",
      bio: "Robert leads our fundraising and partnership initiatives. With 20 years in nonprofit development, he has helped grow our annual funding by 300% in just five years.",
      image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      contact_email: "robert@hopeharbor.org",
    },
  ];
  
  // Board of directors
  const boardMembers = [
    {
      name: "Dr. Elena Rodriguez",
      role: "Board Chair",
      bio: "Distinguished professor of International Relations with extensive work in human rights advocacy.",
    },
    {
      name: "Thomas Washington",
      role: "Treasurer",
      bio: "Former CFO of Fortune 500 company with 25 years experience in financial management.",
    },
    {
      name: "Grace Okafor",
      role: "Secretary",
      bio: "Environmental policy expert and consultant for sustainable development initiatives.",
    },
    {
      name: "James Wilson",
      role: "Board Member",
      bio: "Founder of multiple tech startups focused on solutions for developing regions.",
    },
    {
      name: "Dr. Aisha Khan",
      role: "Board Member",
      bio: "Public health specialist with expertise in healthcare systems in developing nations.",
    },
    {
      name: "Michael Torres",
      role: "Board Member",
      bio: "Urban planning consultant specializing in sustainable community development.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-heading text-ngo-primary">Our Team</h1>
        <p className="mt-2 text-gray-600">Meet the dedicated professionals working to create positive change</p>
      </div>

      {/* Executive Leadership */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-ngo-dark mb-8 text-center">Executive Leadership</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {executiveTeam.map((leader, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200">
                {leader.image_url ? (
                  <img 
                    src={leader.image_url} 
                    alt={leader.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-ngo-light">
                    <span className="text-ngo-primary text-xl">{leader.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-ngo-primary">{leader.name}</h3>
                <p className="text-ngo-secondary font-medium mb-3">{leader.role}</p>
                <p className="text-gray-600 text-sm mb-4">{leader.bio}</p>
                <div className="flex items-center text-ngo-primary">
                  <Mail className="h-4 w-4 mr-1" />
                  <a href={`mailto:${leader.contact_email}`} className="text-sm hover:underline">
                    {leader.contact_email}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Board of Directors */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-ngo-dark mb-8 text-center">Board of Directors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boardMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-ngo-primary">{member.name}</h3>
                <p className="text-ngo-secondary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Field Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-ngo-dark mb-8 text-center">Our Field Teams</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-ngo-light rounded-lg p-6">
            <h3 className="text-xl font-bold text-ngo-primary mb-3">Africa Region</h3>
            <p className="text-gray-700 mb-4">
              Our team of 24 professionals works across 8 countries in East and West Africa, 
              focusing on water access, education, and sustainable agriculture projects.
            </p>
            <Badge className="bg-ngo-primary">8 Countries</Badge>
          </div>
          
          <div className="bg-ngo-light rounded-lg p-6">
            <h3 className="text-xl font-bold text-ngo-primary mb-3">Asia Region</h3>
            <p className="text-gray-700 mb-4">
              With 18 team members across Southeast Asia, our programs focus on education, 
              healthcare access, and disaster preparedness initiatives.
            </p>
            <Badge className="bg-ngo-primary">5 Countries</Badge>
          </div>
          
          <div className="bg-ngo-light rounded-lg p-6">
            <h3 className="text-xl font-bold text-ngo-primary mb-3">Americas Region</h3>
            <p className="text-gray-700 mb-4">
              Our team of 15 specialists works throughout Central and South America on 
              environmental conservation, community development, and education projects.
            </p>
            <Badge className="bg-ngo-primary">6 Countries</Badge>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="bg-ngo-primary text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="mb-6">
            We're always looking for passionate individuals to join our mission. Whether you're 
            interested in field work, administration, or technical roles, we have opportunities 
            for dedicated professionals who want to make a difference.
          </p>
          <div className="flex justify-center">
            <Link to="/contact" className="bg-white text-ngo-primary px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              View Open Positions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
