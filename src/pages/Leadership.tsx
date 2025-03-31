
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderType, TribeType } from "@/types/supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChurch } from "@/contexts/ChurchContext";

const Leadership = () => {
  const { leaders, tribes, isLoading } = useChurch();
  const [featuredLeaders, setFeaturedLeaders] = useState<LeaderType[]>([]);
  const [tribeLeaders, setTribeLeaders] = useState<LeaderType[]>([]);
  
  useEffect(() => {
    // Filter leaders into featured and tribe categories
    if (leaders.length > 0) {
      setFeaturedLeaders(leaders.filter(leader => leader.featured));
      setTribeLeaders(leaders.filter(leader => !leader.featured && leader.tribe_id));
    }
  }, [leaders]);
  
  // Helper function to get tribe name
  const getTribeName = (tribeId: string | null): string => {
    if (!tribeId) return "General";
    const tribe = tribes.find(t => t.id === tribeId);
    return tribe ? tribe.name : "Unknown";
  };
  
  if (isLoading) {
    return (
      <div className="py-12 px-4 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Church Leadership</h1>
        <p className="mt-2 text-gray-600">Meet the dedicated leaders of our church community</p>
      </div>
      
      {featuredLeaders.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif text-church-primary mb-8">Senior Leadership</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredLeaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} tribeName={getTribeName(leader.tribe_id)} />
            ))}
          </div>
        </div>
      )}
      
      {tribeLeaders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-serif text-church-primary mb-8">Tribe Leaders</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tribeLeaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} tribeName={getTribeName(leader.tribe_id)} />
            ))}
          </div>
        </div>
      )}
      
      {featuredLeaders.length === 0 && tribeLeaders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leadership information available at this time.</p>
        </div>
      )}
    </div>
  );
};

interface LeaderCardProps {
  leader: LeaderType;
  tribeName: string;
}

const LeaderCard = ({ leader, tribeName }: LeaderCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-64 bg-gray-200">
        {leader.image_url ? (
          <img 
            src={leader.image_url} 
            alt={leader.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-church-light">
            <span className="text-church-primary font-serif text-xl">{leader.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{leader.name}</CardTitle>
        <CardDescription className="font-medium text-church-secondary">{leader.role}</CardDescription>
      </CardHeader>
      {leader.bio && (
        <CardContent>
          <p className="text-gray-600 line-clamp-3">{leader.bio}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">{tribeName}</Badge>
        {(leader.contact_email || leader.contact_phone) && (
          <div className="text-sm text-gray-500">
            {leader.contact_email && <div>{leader.contact_email}</div>}
            {leader.contact_phone && <div>{leader.contact_phone}</div>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Leadership;
