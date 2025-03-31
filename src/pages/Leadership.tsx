import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChurch } from "@/contexts/ChurchContext";
import { LeaderType, TribeType } from "@/types/supabase";

const Leadership = () => {
  const { leaders: contextLeaders, tribes: contextTribes } = useChurch();
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setLoading(true);
        
        // If we already have data in context, use it
        if (contextLeaders.length > 0 && contextTribes.length > 0) {
          setLeaders(contextLeaders);
          setTribes(contextTribes);
          setLoading(false);
          return;
        }
        
        // Otherwise, fetch from Supabase
        const { data: leadersData, error: leadersError } = await supabase
          .from('leaders')
          .select('*')
          .order('name');
          
        if (leadersError) throw leadersError;
        
        const { data: tribesData, error: tribesError } = await supabase
          .from('tribes')
          .select('*')
          .order('name');
          
        if (tribesError) throw tribesError;
        
        setLeaders(leadersData as LeaderType[]);
        setTribes(tribesData as TribeType[]);
      } catch (error) {
        console.error("Error fetching leadership data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeadership();
  }, [contextLeaders, contextTribes]);
  
  const getTribeName = (tribeId: string | undefined | null) => {
    if (!tribeId) return "Church-wide Leadership";
    const tribe = tribes.find(t => t.id === tribeId);
    return tribe ? `Tribe of ${tribe.name}` : "Church-wide Leadership";
  };
  
  // Group leaders by role
  const seniorLeadership = leaders.filter(leader => 
    leader.role.toLowerCase().includes('pastor') || 
    leader.role.toLowerCase().includes('elder') ||
    leader.role.toLowerCase().includes('bishop') ||
    leader.role.toLowerCase().includes('apostle')
  );
  
  const tribalLeaders = leaders.filter(leader => 
    leader.tribe_id && !seniorLeadership.includes(leader)
  );
  
  const ministryLeaders = leaders.filter(leader => 
    !seniorLeadership.includes(leader) && !tribalLeaders.includes(leader)
  );
  
  if (loading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Our Leadership</h1>
        <p className="mt-2 text-gray-600">Meet the dedicated leaders of Global Cathedral</p>
      </div>
      
      {/* Senior Leadership */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Senior Leadership</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {seniorLeadership.map((leader) => (
            <div key={leader.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200">
                {leader.image_url ? (
                  <img 
                    src={leader.image_url} 
                    alt={leader.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-church-light">
                    <span className="text-3xl font-serif text-church-primary">{leader.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{leader.name}</h3>
                <p className="text-church-primary font-medium mb-4">{leader.role}</p>
                {leader.bio && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{leader.bio}</p>
                )}
                <p className="text-sm text-gray-500">{getTribeName(leader.tribe_id)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Tribal Leaders */}
      {tribalLeaders.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Tribal Leaders</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tribalLeaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 bg-gray-200">
                  {leader.image_url ? (
                    <img 
                      src={leader.image_url} 
                      alt={leader.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-church-light">
                      <span className="text-2xl font-serif text-church-primary">{leader.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{leader.name}</h3>
                  <p className="text-church-primary text-sm font-medium mb-2">{leader.role}</p>
                  <p className="text-sm text-gray-500">{getTribeName(leader.tribe_id)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Ministry Leaders */}
      {ministryLeaders.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-serif text-church-primary mb-6">Ministry Leaders</h2>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {ministryLeaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-church-light flex items-center justify-center text-church-primary mr-4">
                    {leader.image_url ? (
                      <img 
                        src={leader.image_url} 
                        alt={leader.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-serif">{leader.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{leader.name}</h3>
                    <p className="text-sm text-church-primary">{leader.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Leadership;
