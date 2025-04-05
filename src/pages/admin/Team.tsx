
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Plus, Search, Trash2, Edit } from "lucide-react";

// Mock data for team members
const MOCK_TEAM_DATA = [
  {
    id: "1",
    name: "Jane Smith",
    position: "Executive Director",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop",
    display_order: 1
  },
  {
    id: "2",
    name: "Michael Johnson",
    position: "Operations Manager",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop",
    display_order: 2
  },
  {
    id: "3",
    name: "Sarah Williams",
    position: "Program Coordinator",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop",
    display_order: 3
  },
  {
    id: "4",
    name: "David Garcia",
    position: "Volunteer Coordinator",
    image_url: null,
    display_order: 4
  }
];

const AdminTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      // Using mock data instead of real database call
      setTimeout(() => {
        setTeam(MOCK_TEAM_DATA);
        setLoading(false);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Could not load team members. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filteredTeam = team.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Leadership Team</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-8 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTeam.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeam.map((member) => (
                <Card key={member.id} className="overflow-hidden">
                  <div className="relative aspect-square">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground">{member.position}</p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery ? "No team members match your search criteria." : "No team members found. Add your first team member."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeam;
