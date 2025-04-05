
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Plus, Search, Trash2, Edit } from "lucide-react";

// Mock data for programs
const MOCK_PROGRAMS_DATA = [
  {
    id: "1",
    title: "Youth Empowerment Workshop",
    description: "Weekly workshops for underprivileged youth",
    status: "active",
    category: "Education",
    participants: 25,
    created_at: "2025-03-10T08:30:00.000Z"
  },
  {
    id: "2",
    title: "Community Health Outreach",
    description: "Monthly health screenings in local communities",
    status: "active",
    category: "Health",
    participants: 150,
    created_at: "2025-02-15T14:00:00.000Z"
  },
  {
    id: "3",
    title: "Summer Reading Program",
    description: "Reading initiative for children during summer break",
    status: "completed",
    category: "Education",
    participants: 75,
    created_at: "2024-08-01T09:45:00.000Z"
  },
  {
    id: "4",
    title: "Senior Support Network",
    description: "Providing assistance to elderly community members",
    status: "pending",
    category: "Community",
    participants: 50,
    created_at: "2025-04-01T11:15:00.000Z"
  }
];

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      // Using mock data instead of real database call
      setTimeout(() => {
        setPrograms(MOCK_PROGRAMS_DATA);
        setLoading(false);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Could not load programs. Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Program
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>All Programs</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
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
          ) : filteredPrograms.length > 0 ? (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Participants</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => (
                    <tr key={program.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{program.title}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          program.status === 'active' ? 'bg-green-100 text-green-800' :
                          program.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {program.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{program.category || 'Uncategorized'}</td>
                      <td className="p-4 align-middle">{program.participants || 0}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchQuery ? "No programs match your search criteria." : "No programs found. Add your first program."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrograms;
