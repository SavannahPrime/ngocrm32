
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, BookOpen, Users, Globe } from "lucide-react";
import { useChurch } from "@/contexts/ChurchContext";

const Home = () => {
  const { getFeaturedEvents, getFeaturedBlogPosts } = useChurch();
  const featuredEvents = getFeaturedEvents().slice(0, 3);
  const featuredPosts = getFeaturedBlogPosts().slice(0, 3);

  return (
    <div className="space-y-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-ngo-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Making A Difference, Together
                </h1>
                <p className="text-lg md:text-xl opacity-90">
                  HopeHarbor is committed to sustainable development, education, and community empowerment around the world.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/donate">
                    <Button size="lg" className="bg-ngo-accent text-ngo-dark hover:bg-ngo-accent/90">
                      Donate Now
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ngo-primary">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1469041797191-50ace28483c3?ixlib=rb-4.0.3&q=85&auto=format&fit=crop&w=4752&h=3168"
                  alt="Children in a classroom" 
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-lg shadow-xl p-6">
            <div className="text-center p-4">
              <p className="text-4xl font-bold text-ngo-primary">23+</p>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl font-bold text-ngo-primary">142</p>
              <p className="text-gray-600">Projects</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl font-bold text-ngo-primary">$2.8M</p>
              <p className="text-gray-600">Funds Raised</p>
            </div>
            <div className="text-center p-4">
              <p className="text-4xl font-bold text-ngo-primary">78K</p>
              <p className="text-gray-600">Lives Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ngo-dark mb-4">Our Mission</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We work tirelessly to create sustainable solutions that empower communities and build a better world for future generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-ngo-light text-ngo-primary">
                  <Heart size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Humanitarian Aid</h3>
              <p className="text-gray-600 text-center">
                Providing essential resources and support to those in crisis situations around the world.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-ngo-light text-ngo-primary">
                  <BookOpen size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Education</h3>
              <p className="text-gray-600 text-center">
                Building schools, training teachers, and creating access to quality education for all.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-ngo-light text-ngo-primary">
                  <Globe size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Environment</h3>
              <p className="text-gray-600 text-center">
                Protecting natural habitats and promoting sustainable practices in communities.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-ngo-light text-ngo-primary">
                  <Users size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Community</h3>
              <p className="text-gray-600 text-center">
                Empowering local communities with resources, training, and infrastructure.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/mission">
            <Button>Learn More About Our Mission</Button>
          </Link>
        </div>
      </section>

      {/* Featured Project */}
      <section className="bg-ngo-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-ngo-primary mb-4">Clean Water Initiative</h2>
              <p className="text-gray-700 mb-6">
                Our flagship project has been providing clean water solutions to rural communities for over 10 years. With innovative technologies and community education, we've helped reduce waterborne diseases by 70% in our target regions.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Built 247 wells across 18 villages</li>
                <li>Installed water filtration systems in 32 schools</li>
                <li>Trained 450+ local technicians for maintenance</li>
                <li>Improved health outcomes for over 25,000 people</li>
              </ul>
              <Link to="/projects">
                <Button>View All Projects</Button>
              </Link>
            </div>
            <div className="order-1 lg:order-2 h-[400px] rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&q=85&auto=format&fit=crop&w=2742&h=1251"
                alt="Clean water project" 
                className="object-cover h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ngo-dark mb-4">Recent Updates</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stories from the field and news about our ongoing projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden shadow hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-ngo-light">
                      <span className="text-ngo-primary font-heading">HopeHarbor</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-ngo-primary">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.content.substring(0, 120)}...
                  </p>
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            Array(3).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden shadow hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  <div className="flex items-center justify-center h-full bg-ngo-light">
                    <span className="text-ngo-primary font-heading">HopeHarbor</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-ngo-primary">Project Update {index + 1}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    Our teams have been working tirelessly on the ground to bring sustainable solutions to communities in need.
                  </p>
                  <Link to="/blog">
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button>View All Updates</Button>
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-ngo-primary text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you want to donate, volunteer, or spread the word, there are many ways you can help us make a difference in the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" className="bg-ngo-accent text-ngo-dark hover:bg-ngo-accent/90">
                Donate Now
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ngo-primary">
                Become a Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
