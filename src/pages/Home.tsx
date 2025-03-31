
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, MapPin, Clock } from "lucide-react";
import { useChurch } from "@/contexts/ChurchContext";
import { format } from "date-fns";
import { SermonType, EventType } from "@/types/supabase";

const Home = () => {
  const { getFeaturedSermons, getFeaturedEvents, getFeaturedBlogPosts } = useChurch();
  const [featuredSermons, setFeaturedSermons] = useState<SermonType[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<SermonType[]>([]);
  
  useEffect(() => {
    setFeaturedSermons(getFeaturedSermons().slice(0, 3));
    setFeaturedEvents(getFeaturedEvents().slice(0, 3));
    setFeaturedBlogs(getFeaturedBlogPosts().slice(0, 3));
  }, [getFeaturedSermons, getFeaturedEvents, getFeaturedBlogPosts]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-church-primary flex items-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="container mx-auto px-4 relative z-20 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">
              Welcome to Global Cathedral
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Join us for worship, community, and spiritual growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-church-secondary hover:bg-church-secondary/90">
                <Link to="/sermons">Watch Sermons</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/events">Upcoming Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Times */}
      <section className="py-16 bg-church-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-church-primary">Join Us In Worship</h2>
            <p className="mt-2 text-gray-600">Worship service times for our community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Sunday Services</h3>
                <p className="text-gray-600">
                  8:00 AM - Early Morning Service<br />
                  10:30 AM - Main Service<br />
                  6:00 PM - Evening Service
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Midweek Services</h3>
                <p className="text-gray-600">
                  Wednesday 7:00 PM - Bible Study<br />
                  Friday 6:30 PM - Prayer Meeting
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Youth & Children</h3>
                <p className="text-gray-600">
                  Sunday 9:00 AM - Children's Church<br />
                  Friday 5:00 PM - Youth Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Sermons */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif text-church-primary">Recent Sermons</h2>
              <p className="mt-2 text-gray-600">Listen to our latest teachings and messages</p>
            </div>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/sermons">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredSermons.map((sermon) => (
              <Card key={sermon.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/sermons/${sermon.id}`}>
                  <div className="h-48 bg-gray-200">
                    {sermon.image_url ? (
                      <img 
                        src={sermon.image_url} 
                        alt={sermon.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-church-light">
                        <span className="text-church-primary font-serif">Global Cathedral</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{sermon.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{sermon.preacher}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(sermon.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sermon.tags && sermon.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-16 bg-church-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif text-church-primary">Upcoming Events</h2>
              <p className="mt-2 text-gray-600">Join us for our upcoming church events</p>
            </div>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/events">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200">
                  {event.image_url ? (
                    <img 
                      src={event.image_url} 
                      alt={event.title} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-church-light/50">
                      <span className="text-church-primary font-serif">Global Cathedral</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/events#${event.id}`}>
                      More Info
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-serif text-church-primary">From Our Blog</h2>
              <p className="mt-2 text-gray-600">Read the latest articles from our church</p>
            </div>
            <Button asChild variant="ghost" className="flex items-center">
              <Link to="/blog">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredBlogs.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/blog/${post.id}`}>
                  <div className="h-48 bg-gray-200">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-church-light">
                        <span className="text-church-primary font-serif">Global Cathedral</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{post.preacher}</span>
                      <span className="mx-2">•</span>
                      <span>{format(new Date(post.date), "MMM d, yyyy")}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3">
                      {post.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-church-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
            Join Our Community
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Become a part of our church family and grow with us in faith and fellowship.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-church-primary hover:bg-gray-100">
              <Link to="/register">Register</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
