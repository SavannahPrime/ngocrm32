
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Edit, MoreVertical, Plus, Trash2, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Define the sermon type
interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  content: string;
  video_url?: string;
  image_url?: string;
  featured: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

const AdminSermons = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSermonId, setSelectedSermonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  
  // Fetch sermons on component mount
  useEffect(() => {
    fetchSermons();
  }, []);

  // Fetch sermons from Supabase
  const fetchSermons = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      setSermons(data || []);
    } catch (error: any) {
      console.error("Error fetching sermons:", error);
      toast({
        title: "Error Loading Sermons",
        description: error.message || "There was an error loading sermons.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const [formData, setFormData] = useState({
    title: "",
    preacher: "",
    date: new Date().toISOString().split("T")[0],
    scripture: "",
    content: "",
    videoUrl: "",
    imageUrl: "",
    featured: false,
    tags: "",
  });
  
  const selectedSermon = selectedSermonId 
    ? sermons.find(sermon => sermon.id === selectedSermonId) 
    : null;
  
  const resetForm = () => {
    setFormData({
      title: "",
      preacher: "",
      date: new Date().toISOString().split("T")[0],
      scripture: "",
      content: "",
      videoUrl: "",
      imageUrl: "",
      featured: false,
      tags: "",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .insert([
          {
            title: formData.title,
            preacher: formData.preacher,
            date: formData.date,
            scripture: formData.scripture,
            content: formData.content,
            video_url: formData.videoUrl,
            image_url: formData.imageUrl,
            featured: formData.featured,
            tags: formData.tags.split(",").map(tag => tag.trim()),
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Sermon Added",
        description: "The sermon has been successfully added.",
      });
      
      fetchSermons(); // Refresh the list
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error adding sermon:", error);
      toast({
        title: "Error Adding Sermon",
        description: error.message || "There was an error adding the sermon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditOpen = (id: string) => {
    const sermon = sermons.find(s => s.id === id);
    if (sermon) {
      setSelectedSermonId(id);
      setFormData({
        title: sermon.title,
        preacher: sermon.preacher,
        date: sermon.date,
        scripture: sermon.scripture,
        content: sermon.content,
        videoUrl: sermon.video_url || "",
        imageUrl: sermon.image_url || "",
        featured: sermon.featured,
        tags: sermon.tags.join(", "),
      });
      setIsEditDialogOpen(true);
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSermonId) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('sermons')
        .update({
          title: formData.title,
          preacher: formData.preacher,
          date: formData.date,
          scripture: formData.scripture,
          content: formData.content,
          video_url: formData.videoUrl,
          image_url: formData.imageUrl,
          featured: formData.featured,
          tags: formData.tags.split(",").map(tag => tag.trim()),
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedSermonId);
        
      if (error) throw error;
      
      toast({
        title: "Sermon Updated",
        description: "The sermon has been successfully updated.",
      });
      
      fetchSermons(); // Refresh the list
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedSermonId(null);
    } catch (error: any) {
      console.error("Error updating sermon:", error);
      toast({
        title: "Error Updating Sermon",
        description: error.message || "There was an error updating the sermon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteOpen = (id: string) => {
    setSelectedSermonId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (selectedSermonId) {
      try {
        setIsLoading(true);
        const { error } = await supabase
          .from('sermons')
          .delete()
          .eq('id', selectedSermonId);
          
        if (error) throw error;
        
        toast({
          title: "Sermon Deleted",
          description: "The sermon has been successfully deleted.",
        });
        
        fetchSermons(); // Refresh the list
        setIsDeleteDialogOpen(false);
        setSelectedSermonId(null);
      } catch (error: any) {
        console.error("Error deleting sermon:", error);
        toast({
          title: "Error Deleting Sermon",
          description: error.message || "There was an error deleting the sermon. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sermon & Blog Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sermon / Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Sermon / Blog Post</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preacher">Author / Preacher</Label>
                  <Input 
                    id="preacher" 
                    name="preacher" 
                    value={formData.preacher} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scripture">Scripture Reference</Label>
                  <Input 
                    id="scripture" 
                    name="scripture" 
                    value={formData.scripture} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  required 
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                  <Input 
                    id="videoUrl" 
                    name="videoUrl" 
                    value={formData.videoUrl} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Input 
                    id="imageUrl" 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input 
                  id="tags" 
                  name="tags" 
                  value={formData.tags} 
                  onChange={handleInputChange} 
                  placeholder="faith, prayer, hope" 
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={handleCheckboxChange} 
                />
                <Label htmlFor="featured">Feature this on homepage</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Sermons & Blog Posts</CardTitle>
          <CardDescription>
            Manage all sermons and blog posts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && sermons.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-church-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author/Preacher</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Scripture</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sermons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No entries available.
                    </TableCell>
                  </TableRow>
                ) : (
                  sermons.map((sermon) => (
                    <TableRow key={sermon.id}>
                      <TableCell className="font-medium">{sermon.title}</TableCell>
                      <TableCell>{sermon.preacher}</TableCell>
                      <TableCell>{format(new Date(sermon.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{sermon.scripture}</TableCell>
                      <TableCell>
                        {sermon.featured ? (
                          <Badge>Featured</Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditOpen(sermon.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteOpen(sermon.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            {sermon.video_url && (
                              <DropdownMenuItem
                                onClick={() => window.open(sermon.video_url, "_blank")}
                              >
                                <Video className="mr-2 h-4 w-4" />
                                View Video
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sermon / Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-preacher">Author/Preacher</Label>
                <Input 
                  id="edit-preacher" 
                  name="preacher" 
                  value={formData.preacher} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input 
                  id="edit-date" 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-scripture">Scripture Reference</Label>
                <Input 
                  id="edit-scripture" 
                  name="scripture" 
                  value={formData.scripture} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea 
                id="edit-content" 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                required 
                className="min-h-[200px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-videoUrl">Video URL (Optional)</Label>
                <Input 
                  id="edit-videoUrl" 
                  name="videoUrl" 
                  value={formData.videoUrl} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL (Optional)</Label>
                <Input 
                  id="edit-imageUrl" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input 
                id="edit-tags" 
                name="tags" 
                value={formData.tags} 
                onChange={handleInputChange} 
                placeholder="faith, prayer, hope" 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-featured" 
                checked={formData.featured} 
                onCheckedChange={handleCheckboxChange} 
              />
              <Label htmlFor="edit-featured">Feature this on homepage</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete: <span className="font-semibold">{selectedSermon?.title}</span>?</p>
          <p className="text-red-500 text-sm">This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSermons;
