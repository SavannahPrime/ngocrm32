
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  MapPin,
  Globe,
  Heart,
  BookOpen 
} from "lucide-react";
import { format } from "date-fns";
import { useChurch } from "@/contexts/ChurchContext";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";

const Home = () => {
  const { events } = useChurch();
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState<SermonType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch featured blog posts directly from Supabase
  useEffect(() => {
    const fetchFeaturedBlogPosts = async () => {
      try {
        setLoadingPosts(true);
        
        const { data, error } = await supabase
          .from('sermons')
          .select('*')
          .eq('type', 'blog')
          .eq('featured', true)
          .order('date', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        setFeaturedBlogPosts(data || []);
      } catch (error) {
        console.error("Error fetching featured blog posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    
    fetchFeaturedBlogPosts();
  }, []);

  // Get upcoming events - filter to show only future events
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center bg-ngo-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
            alt="People in need" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight max-w-4xl">
            Empowering Communities, <br />
            <span className="text-ngo-primary">Creating Hope</span>
          </h1>
          <p className="mt-6 text-xl text-white max-w-2xl">
            HopeHarbor is dedicated to sustainable development through education, clean water, and community empowerment programs worldwide.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/projects">
              <Button size="lg" className="bg-ngo-primary hover:bg-ngo-primary/90">
                Our Projects
              </Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-ngo-dark to-transparent"></div>
      </section>

      {/* Impact Stats */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-ngo-dark mb-12">
            Our <span className="text-ngo-primary">Global Impact</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-t-4 border-t-ngo-primary">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ngo-light rounded-full">
                    <Globe className="h-8 w-8 text-ngo-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-ngo-dark">19</h3>
                <p className="text-gray-600">Countries Reached</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-ngo-primary">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ngo-light rounded-full">
                    <Heart className="h-8 w-8 text-ngo-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-ngo-dark">250K+</h3>
                <p className="text-gray-600">Lives Impacted</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-ngo-primary">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ngo-light rounded-full">
                    <BookOpen className="h-8 w-8 text-ngo-primary" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-ngo-dark">75</h3>
                <p className="text-gray-600">Active Projects</p>
              </CardContent>
            </Card>

            <Card className="text-center border-t-4 border-t-ngo-primary">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ngo-light rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-ngo-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-ngo-dark">$4.2M</h3>
                <p className="text-gray-600">Funds Raised</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ngo-dark">
              Our <span className="text-ngo-primary">Featured Projects</span>
            </h2>
            <Link to="/projects" className="text-ngo-primary font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="h-48 bg-gray-300">
                <img 
                  src="https://images.unsplash.com/photo-1594708767771-a5e9d3c6482c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Clean Water Project" 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Clean Water Initiative</CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>Providing clean water access to rural communities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                  <div className="h-2 bg-ngo-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">$37,500 raised</span>
                  <span className="text-gray-500">of $50,000 goal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/projects/1" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-48 bg-gray-300">
                <img 
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1422&q=80" 
                  alt="Education Project" 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Education for All</CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>Building schools in underserved areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                  <div className="h-2 bg-ngo-primary rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">$45,000 raised</span>
                  <span className="text-gray-500">of $75,000 goal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/projects/2" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="h-48 bg-gray-300">
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Hunger Relief" 
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Hunger Relief Program</CardTitle>
                  <Badge>Active</Badge>
                </div>
                <CardDescription>Providing meals to homeless populations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-2">
                  <div className="h-2 bg-ngo-primary rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">$10,000 raised</span>
                  <span className="text-gray-500">of $25,000 goal</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/projects/3" className="w-full">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ngo-dark">
              Latest <span className="text-ngo-primary">Updates</span>
            </h2>
            <Link to="/blog" className="text-ngo-primary font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {loadingPosts ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ngo-primary"></div>
            </div>
          ) : featuredBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-ngo-light">
                        <span className="text-ngo-primary">HopeHarbor</span>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{post.preacher}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/blog/${post.id}`} className="w-full">
                      <Button variant="outline" className="w-full">Read More</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No featured blog posts found at this time. Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-ngo-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ngo-dark">
              Upcoming <span className="text-ngo-primary">Events</span>
            </h2>
            <Link to="/events" className="text-ngo-primary font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-ngo-primary text-white rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs">{format(new Date(event.date), "MMM")}</span>
                        <span className="text-xl font-bold">{format(new Date(event.date), "dd")}</span>
                      </div>
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription className="line-clamp-1 mt-1">{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming events at this time. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-ngo-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Make a Difference Today</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join us in our mission to create positive change. Your support can transform lives and communities around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button size="lg" variant="secondary">Donate Now</Button>
            </Link>
            <Link to="/volunteer">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Volunteer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
