
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useChurch } from "@/contexts/ChurchContext";
import { CalendarDays, BookOpen, Users, Heart } from "lucide-react";

const Home = () => {
  const { getFeaturedSermons, getFeaturedEvents, getFeaturedBlogPosts } = useChurch();
  
  const featuredSermons = getFeaturedSermons();
  const featuredEvents = getFeaturedEvents();
  const featuredPosts = getFeaturedBlogPosts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-church-primary to-church-secondary text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6 animate-fade-in">
              Welcome to GlobalCathedral Church
            </h1>
            <p className="text-xl mb-8">
              A place of worship, community, and spiritual growth
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-church-primary hover:bg-church-light">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/sermons">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-church-primary">
                  Watch Latest Sermon
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-12 bg-church-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-serif text-church-primary mb-2">Join Us in Worship</h2>
            <p className="text-gray-600">Come experience the presence of God with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-church-primary">Sunday Service</h3>
              <p className="text-gray-700 mb-2">10:00 AM - 11:30 AM</p>
              <p className="text-gray-600">Main Sanctuary</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-church-primary">Wednesday Bible Study</h3>
              <p className="text-gray-700 mb-2">7:00 PM - 8:30 PM</p>
              <p className="text-gray-600">Fellowship Hall</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2 text-church-primary">Youth Service</h3>
              <p className="text-gray-700 mb-2">Friday, 6:30 PM - 8:00 PM</p>
              <p className="text-gray-600">Youth Center</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-serif text-church-primary mb-4">About GlobalCathedral</h2>
              <p className="text-gray-600 mb-6">
                GlobalCathedral Church is a vibrant, growing community of believers dedicated to sharing God's love
                and spreading the Gospel message. Our church was founded on the principles of faith, hope, and love,
                and we strive to make a positive impact in our community and beyond.
              </p>
              <p className="text-gray-600 mb-6">
                We believe in the power of worship, the importance of biblical teaching, and the value of community.
                Whether you're just beginning your faith journey or have been walking with God for years,
                there's a place for you here.
              </p>
              <Link to="/about">
                <Button className="bg-church-primary text-white hover:bg-church-primary/90">
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Church congregation" 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-church-accent p-4 rounded-lg shadow-lg hidden md:block">
                <p className="text-church-dark font-bold text-lg font-serif">
                  "A community of faith, hope, and love."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sermons */}
      {featuredSermons.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif text-church-primary mb-2">Latest Sermons</h2>
              <p className="text-gray-600">Be inspired and grow through God's Word</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                  {sermon.imageUrl && (
                    <img 
                      src={sermon.imageUrl} 
                      alt={sermon.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-church-primary">{sermon.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {sermon.preacher} | {sermon.date}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{sermon.content}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link to={`/sermons/${sermon.id}`}>
                      <Button variant="outline" className="w-full border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                        Watch Sermon
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/sermons">
                <Button className="bg-church-primary text-white hover:bg-church-primary/90">
                  View All Sermons
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif text-church-primary mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Join us for these special gatherings</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                  {event.imageUrl && (
                    <div className="md:w-1/3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-xl font-bold mb-2 text-church-primary">{event.title}</h3>
                    <div className="flex items-center mb-2 text-gray-600">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span>{event.date} @ {event.time}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <p className="text-sm font-medium text-gray-500 mb-4">
                      Location: {event.location}
                    </p>
                    <Link to="/events">
                      <Button className="bg-church-primary text-white hover:bg-church-primary/90">
                        Event Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/events">
                <Button className="bg-church-primary text-white hover:bg-church-primary/90">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Ministry Areas */}
      <section className="py-16 bg-church-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif mb-2">Our Ministries</h2>
            <p className="text-gray-200">Serving God and our community in many ways</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-church-accent" />
              <h3 className="text-xl font-bold mb-2">Bible Teaching</h3>
              <p className="text-gray-200">
                In-depth exploration of God's Word through sermons and Bible studies.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-church-accent" />
              <h3 className="text-xl font-bold mb-2">Community Groups</h3>
              <p className="text-gray-200">
                Small groups that meet regularly for fellowship, prayer, and growth.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-church-accent" />
              <h3 className="text-xl font-bold mb-2">Outreach & Missions</h3>
              <p className="text-gray-200">
                Serving our local community and supporting global mission efforts.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg text-center">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-church-accent" />
              <h3 className="text-xl font-bold mb-2">Youth Ministry</h3>
              <p className="text-gray-200">
                Programs designed to help young people grow in their faith journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-church-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-serif text-church-primary mb-4">
              Become Part of Our Community
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Register as a member today and join one of our 12 Tribes based on your birth month
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-church-primary text-white hover:bg-church-primary/90">
                  Register Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif text-church-primary mb-2">Latest News & Articles</h2>
              <p className="text-gray-600">Stay updated with church news and inspirational content</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-church-primary">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {post.author} | {post.date}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline" className="w-full border-church-primary text-church-primary hover:bg-church-primary hover:text-white">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/blog">
                <Button className="bg-church-primary text-white hover:bg-church-primary/90">
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Donation Banner */}
      <section className="py-12 bg-gradient-to-r from-church-primary to-church-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-serif mb-4">Support Our Ministry</h2>
            <p className="text-xl mb-8">
              Your generosity helps us spread the Gospel and serve our community
            </p>
            <Link to="/donate">
              <Button size="lg" className="bg-church-accent text-church-dark hover:bg-church-accent/90">
                Give Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
