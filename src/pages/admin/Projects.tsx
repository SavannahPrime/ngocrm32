
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
import { MediaUpload } from "@/components/MediaUpload";
import { toast as sonnerToast } from "sonner";
import { format } from "date-fns";

// Define the project type
interface Project {
  id: string;
  title: string;
  description: string;
  status: string | null;
  funding_goal: number | null;
  funding_current: number | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    status: "active",
    funding_goal: 0,
    funding_current: 0,
    image_url: "",
    start_date: new Date().toISOString().split('T')[0],
    end_date: ""
  });

  const statuses = ["active", "pending", "completed", "cancelled"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Could not load projects. Please try again later.",
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const handleAddProject = async () => {
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
        .from("projects")
        .insert({
          title: formData.title,
          description: formData.description,
          status: formData.status || "active",
          funding_goal: formData.funding_goal || 0,
          funding_current: formData.funding_current || 0,
          image_url: formData.image_url || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        })
        .select();

      if (error) throw error;

      sonnerToast.success("Project added successfully");
      toast({
        title: "Success",
        description: "Project has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "active",
        funding_goal: 0,
        funding_current: 0,
        image_url: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: ""
      });
      
      fetchProjects();
    } catch (error: any) {
      console.error("Error adding project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add project: ${error.message}`,
      });
    }
  };

  const handleEditProject = async () => {
    try {
      if (!selectedProject) return;
      
      if (!formData.title || !formData.description) {
        toast({
          title: "Error",
          description: "Title and description are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          funding_goal: formData.funding_goal,
          funding_current: formData.funding_current,
          image_url: formData.image_url,
          start_date: formData.start_date,
          end_date: formData.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedProject.id);

      if (error) throw error;

      sonnerToast.success("Project updated successfully");
      toast({
        title: "Success",
        description: "Project has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update project: ${error.message}`,
      });
    }
  };

  const handleDeleteProject = async () => {
    try {
      if (!selectedProject) return;

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", selectedProject.id);

      if (error) throw error;

      sonnerToast.success("Project deleted successfully");
      toast({
        title: "Success",
        description: "Project has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete project: ${error.message}`,
      });
    }
  };

  const handleOpenEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      status: project.status || "active",
      funding_goal: project.funding_goal || 0,
      funding_current: project.funding_current || 0,
      image_url: project.image_url || "",
      start_date: project.start_date || "",
      end_date: project.end_date || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "$0";
    return "$" + amount.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>All Projects</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
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
          ) : filteredProjects.length > 0 ? (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Start Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Funding Goal</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Current Funding</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-medium">{project.title}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status || "Unknown"}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        {project.start_date ? format(new Date(project.start_date), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="p-4 align-middle">
                        {formatCurrency(project.funding_goal)}
                      </td>
                      <td className="p-4 align-middle">
                        {formatCurrency(project.funding_current)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(project)}>
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
              {searchQuery ? "No projects match your search criteria." : "No projects found. Add your first project."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Project Image</Label>
                <MediaUpload
                  type="image"
                  value={formData.image_url as string}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="funding_goal">Funding Goal ($)</Label>
                <Input
                  id="funding_goal"
                  name="funding_goal"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter funding goal"
                  value={formData.funding_goal?.toString() || "0"}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funding_current">Current Funding ($)</Label>
                <Input
                  id="funding_current"
                  name="funding_current"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter current funding"
                  value={formData.funding_current?.toString() || "0"}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter project description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Project Image</Label>
                <MediaUpload
                  type="image"
                  value={formData.image_url as string}
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start_date">Start Date</Label>
                <Input
                  id="edit-start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end_date">End Date</Label>
                <Input
                  id="edit-end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-funding_goal">Funding Goal ($)</Label>
                <Input
                  id="edit-funding_goal"
                  name="funding_goal"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter funding goal"
                  value={formData.funding_goal?.toString() || "0"}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-funding_current">Current Funding ($)</Label>
                <Input
                  id="edit-funding_current"
                  name="funding_current"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter current funding"
                  value={formData.funding_current?.toString() || "0"}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
