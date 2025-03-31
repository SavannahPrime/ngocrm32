
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderType, TribeType } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client";
import { Heading } from "@/components/ui/heading";

const Leadership = () => {
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setLoading(true);
        // Fetch leaders
        const { data: leaderData, error: leaderError } = await supabase
          .from('leaders')
          .select('*')
          .order('role');
          
        if (leaderError) throw leaderError;
        
        // Fetch tribes
        const { data: tribeData, error: tribeError } = await supabase
          .from('tribes')
          .select('*');
          
        if (tribeError) throw tribeError;
        
        setLeaders(leaderData || []);
        setTribes(tribeData || []);
      } catch (error) {
        console.error("Error fetching leadership:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeadership();
  }, []);

  // Filter leaders by featured status
  const featuredLeaders = leaders.filter(leader => leader.featured);
  const regularLeaders = leaders.filter(leader => !leader.featured);
  
  // Get tribe name from tribe ID
  const getTribeName = (tribeId: string | null | undefined): string => {
    if (!tribeId) return "General";
    const tribe = tribes.find(t => t.id === tribeId);
    return tribe ? tribe.name : "General";
  };

  if (loading) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-serif text-church-primary">Our Leadership</h1>
          <p className="mt-2 text-gray-600">Meet the dedicated team guiding our church community</p>
        </div>
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-serif text-church-primary">Our Leadership</h1>
        <p className="mt-2 text-gray-600">Meet the dedicated team guiding our church community</p>
      </div>

      {/* Featured Leaders */}
      {featuredLeaders.length > 0 && (
        <>
          <Heading title="Church Leadership" description="Our senior leadership team" className="mt-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {featuredLeaders.map((leader) => (
              <Card key={leader.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={leader.image_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"} 
                    alt={leader.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-church-primary">{leader.name}</h2>
                  <p className="text-church-secondary font-medium mb-3">{leader.role}</p>
                  {leader.tribe_id && (
                    <p className="text-sm text-gray-500 mb-3">Tribe Leader: {getTribeName(leader.tribe_id)}</p>
                  )}
                  <p className="text-gray-700">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Regular Leaders */}
      {regularLeaders.length > 0 && (
        <>
          <Heading title="Ministry Team" description="Leaders serving in various church ministries" className="mt-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {regularLeaders.map((leader) => (
              <Card key={leader.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={leader.image_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"} 
                    alt={leader.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-church-primary">{leader.name}</h2>
                  <p className="text-church-secondary font-medium mb-3">{leader.role}</p>
                  {leader.tribe_id && (
                    <p className="text-sm text-gray-500 mb-3">Tribe Leader: {getTribeName(leader.tribe_id)}</p>
                  )}
                  <p className="text-gray-700">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {leaders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Leadership information will be coming soon.</p>
        </div>
      )}

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
