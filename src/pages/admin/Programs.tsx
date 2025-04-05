
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Plus, Search, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast as sonnerToast } from "sonner";

// Define the program type
interface Program {
  id: string;
  title: string;
  description: string;
  status: string | null;
  category: string | null;
  participants: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const AdminPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Program>>({
    title: "",
    description: "",
    status: "active",
    category: "",
    participants: 0
  });

  const categories = ["Education", "Health", "Environment", "Water", "Food Security", "Economic Empowerment", "Other"];
  const statuses = ["active", "pending", "completed", "cancelled"];

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("title", { ascending: true });

      if (error) throw error;
      
      setPrograms(data || []);
    } catch (error: any) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Could not load programs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleAddProgram = async () => {
    try {
      if (!formData.title || !formData.description) {
        toast({
          title: "Error",
          description: "Title and description are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("programs")
        .insert({
          title: formData.title,
          description: formData.description,
          status: formData.status || "active",
          category: formData.category || null,
          participants: formData.participants || 0,
        })
        .select();

      if (error) throw error;

      sonnerToast.success("Program added successfully");
      toast({
        title: "Success",
        description: "Program has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "active",
        category: "",
        participants: 0
      });
      
      fetchPrograms();
    } catch (error: any) {
      console.error("Error adding program:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add program: ${error.message}`,
      });
    }
  };

  const handleEditProgram = async () => {
    try {
      if (!selectedProgram) return;
      
      if (!formData.title || !formData.description) {
        toast({
          title: "Error",
          description: "Title and description are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("programs")
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          category: formData.category,
          participants: formData.participants,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedProgram.id);

      if (error) throw error;

      sonnerToast.success("Program updated successfully");
      toast({
        title: "Success",
        description: "Program has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedProgram(null);
      fetchPrograms();
    } catch (error: any) {
      console.error("Error updating program:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update program: ${error.message}`,
      });
    }
  };

  const handleDeleteProgram = async () => {
    try {
      if (!selectedProgram) return;

      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", selectedProgram.id);

      if (error) throw error;

      sonnerToast.success("Program deleted successfully");
      toast({
        title: "Success",
        description: "Program has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedProgram(null);
      fetchPrograms();
    } catch (error: any) {
      console.error("Error deleting program:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete program: ${error.message}`,
      });
    }
  };

  const handleOpenEditDialog = (program: Program) => {
    setSelectedProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      status: program.status || "active",
      category: program.category || "",
      participants: program.participants || 0
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (program: Program) => {
    setSelectedProgram(program);
    setIsDeleteDialogOpen(true);
  };

  const filteredPrograms = programs.filter(program =>
    program.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Program Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Participants</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrograms.map((program) => (
                    <tr key={program.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{program.title}</td>
                      <td className="p-4 align-middle">{program.category || "—"}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(program.status)}`}>
                          {program.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{program.participants || 0}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(program)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(program)}>
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

      {/* Add Program Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter program title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Number of Participants</Label>
              <Input
                id="participants"
                name="participants"
                type="number"
                min="0"
                placeholder="Enter number of participants"
                value={formData.participants?.toString() || "0"}
                onChange={handleNumberChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter program description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProgram}>Add Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Enter program title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category || ""}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status || "active"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-participants">Number of Participants</Label>
              <Input
                id="edit-participants"
                name="participants"
                type="number"
                min="0"
                placeholder="Enter number of participants"
                value={formData.participants?.toString() || "0"}
                onChange={handleNumberChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter program description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProgram}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedProgram?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPrograms;
