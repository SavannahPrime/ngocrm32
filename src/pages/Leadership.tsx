
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Leadership = () => {
  const leaders = [
    {
      name: "Pastor James Wilson",
      role: "Senior Pastor",
      bio: "Founder of GlobalCathedral with over 35 years of ministry experience. Known for his powerful teaching and compassionate leadership.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Mary Wilson",
      role: "Executive Pastor",
      bio: "Co-founder of GlobalCathedral who oversees the church's operations and women's ministry. Her heart for discipleship has impacted thousands.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "David Parker",
      role: "Worship Pastor",
      bio: "Leading our worship ministry since 2010, David has a passion for creating spaces where people can encounter God's presence through music.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Sarah Johnson",
      role: "Children's Pastor",
      bio: "With a background in education, Sarah brings creativity and biblical teaching to our children's ministry, nurturing the faith of our youngest members.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80"
    },
    {
      name: "Michael Thompson",
      role: "Youth Pastor",
      bio: "Leading our vibrant youth ministry with energy and vision, Michael helps teens navigate life's challenges while growing in their faith.",
      image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      name: "Rachel Chen",
      role: "Outreach Director",
      bio: "Passionate about serving our community, Rachel coordinates our local and global mission efforts, mobilizing volunteers to share God's love in practical ways.",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-church-primary">Our Leadership</h1>
        <p className="mt-2 text-gray-600">Meet the dedicated team guiding our church community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {leaders.map((leader, index) => (
          <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-64 overflow-hidden">
              <img 
                src={leader.image} 
                alt={leader.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-church-primary">{leader.name}</h2>
              <p className="text-church-secondary font-medium mb-3">{leader.role}</p>
              <p className="text-gray-700">{leader.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-church-light p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-church-primary mb-4">Our Leadership Philosophy</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          At GlobalCathedral, we believe in servant leadership modeled after Jesus Christ. 
          Our leaders are committed to equipping the church for ministry, fostering a culture 
          of discipleship, and empowering every member to fulfill their God-given purpose.
        </p>
      </div>
    </div>
  );
};

export default Leadership;
