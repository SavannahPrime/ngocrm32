
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, PlusCircle, Video, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { SermonType } from "@/types/supabase";
import { MediaUpload } from "@/components/MediaUpload";

const AdminSermons = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sermons, setSermons] = useState<SermonType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSermon, setSelectedSermon] = useState<SermonType | null>(null);
  
  const [formData, setFormData] = useState<Partial<SermonType>>({
    title: "",
    preacher: "",
    date: new Date().toISOString().split('T')[0],
    scripture: "",
    content: "",
    video_url: "",
    image_url: "",
    featured: false,
    tags: [],
    type: "sermon"
  });
  
  const [tagsInput, setTagsInput] = useState("");

  // Fetch sermons
  const fetchSermons = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('type', 'sermon')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSermons(data as SermonType[]);
      } else {
        const { data: allData, error: allError } = await supabase
          .from('sermons')
          .select('*')
          .order('date', { ascending: false });
          
        if (allError) throw allError;
        
        const sermonsWithType = allData?.map(sermon => ({
          ...sermon,
          type: sermon.type || 'sermon'
        })) || [];
        
        setSermons(sermonsWithType as SermonType[]);
      }
    } catch (error) {
      console.error("Error fetching sermons:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sermons. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load sermons on component mount
  useEffect(() => {
    fetchSermons();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle featured checkbox
  const handleFeaturedChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked });
  };

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  // Handle image URL changes
  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };
  
  // Handle video URL changes
  const handleVideoUrlChange = (url: string) => {
    setFormData({ ...formData, video_url: url });
  };

  // Add sermon
  const handleAddSermon = async () => {
    try {
      if (!formData.title || !formData.preacher || !formData.content || !formData.scripture) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { data, error } = await supabase
        .from('sermons')
        .insert({
          title: formData.title,
          preacher: formData.preacher,
          date: formData.date || new Date().toISOString().split('T')[0],
          scripture: formData.scripture,
          content: formData.content,
          video_url: formData.video_url,
          image_url: formData.image_url,
          featured: formData.featured || false,
          tags: tags,
          type: 'sermon'
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sermon has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        preacher: "",
        date: new Date().toISOString().split('T')[0],
        scripture: "",
        content: "",
        video_url: "",
        image_url: "",
        featured: false,
        tags: [],
        type: "sermon"
      });
      setTagsInput("");
      fetchSermons();
    } catch (error: any) {
      console.error("Error adding sermon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add sermon: ${error.message}`,
      });
    }
  };

  // Edit sermon
  const handleEditSermon = async () => {
    try {
      if (!selectedSermon) return;
      
      if (!formData.title || !formData.preacher || !formData.content || !formData.scripture) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('sermons')
        .update({
          title: formData.title,
          preacher: formData.preacher,
          date: formData.date,
          scripture: formData.scripture,
          content: formData.content,
          video_url: formData.video_url,
          image_url: formData.image_url,
          featured: formData.featured,
          tags: tags,
          type: 'sermon',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedSermon.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sermon has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedSermon(null);
      fetchSermons();
    } catch (error: any) {
      console.error("Error updating sermon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update sermon: ${error.message}`,
      });
    }
  };

  // Delete sermon
  const handleDeleteSermon = async () => {
    try {
      if (!selectedSermon) return;
      
      const { error } = await supabase
        .from('sermons')
        .delete()
        .eq('id', selectedSermon.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sermon has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedSermon(null);
      fetchSermons();
    } catch (error: any) {
      console.error("Error deleting sermon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete sermon: ${error.message}`,
      });
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (sermon: SermonType) => {
    setSelectedSermon(sermon);
    setFormData({
      title: sermon.title,
      preacher: sermon.preacher,
      date: sermon.date,
      scripture: sermon.scripture,
      content: sermon.content,
      video_url: sermon.video_url || "",
      image_url: sermon.image_url || "",
      featured: sermon.featured || false,
      type: 'sermon'
    });
    setTagsInput(sermon.tags ? sermon.tags.join(', ') : "");
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (sermon: SermonType) => {
    setSelectedSermon(sermon);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Sermon Management</h1>
        <Button 
          onClick={() => {
            setFormData({
              title: "",
              preacher: "",
              date: new Date().toISOString().split('T')[0],
              scripture: "",
              content: "",
              video_url: "",
              image_url: "",
              featured: false,
              tags: [],
              type: "sermon"
            });
            setTagsInput("");
            setIsAddDialogOpen(true);
          }} 
          className="bg-church-primary hover:bg-church-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Sermon
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Title</TableHead>
                <TableHead>Preacher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Scripture</TableHead>
                <TableHead>Media</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sermons.length > 0 ? (
                sermons.map((sermon) => (
                  <TableRow key={sermon.id}>
                    <TableCell className="font-medium">{sermon.title}</TableCell>
                    <TableCell>{sermon.preacher}</TableCell>
                    <TableCell>{format(new Date(sermon.date), "MMMM d, yyyy")}</TableCell>
                    <TableCell>{sermon.scripture}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {sermon.video_url && (
                          <Video className="h-4 w-4 text-church-primary" />
                        )}
                        {sermon.image_url && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-church-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(sermon)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Sermon
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleOpenDeleteDialog(sermon)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Sermon
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No sermons found. Click "Add New Sermon" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Sermon Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Sermon</DialogTitle>
            <DialogDescription>
              Create a new sermon to be published on the website.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter sermon title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preacher">Preacher *</Label>
                <Input
                  id="preacher"
                  name="preacher"
                  placeholder="Enter preacher name"
                  value={formData.preacher}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scripture">Scripture *</Label>
                <Input
                  id="scripture"
                  name="scripture"
                  placeholder="Enter scripture reference"
                  value={formData.scripture}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Enter sermon content or notes"
                rows={10}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sermon Image</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sermon Video</Label>
              <MediaUpload 
                type="video" 
                value={formData.video_url as string} 
                onChange={handleVideoUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="faith, gospel, prayer"
                value={tagsInput}
                onChange={handleTagsChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={formData.featured} 
                onCheckedChange={handleFeaturedChange} 
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Sermon
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSermon}>Add Sermon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Sermon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sermon</DialogTitle>
            <DialogDescription>
              Update the details of the sermon.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  name="title"
                  placeholder="Enter sermon title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-preacher">Preacher *</Label>
                <Input
                  id="edit-preacher"
                  name="preacher"
                  placeholder="Enter preacher name"
                  value={formData.preacher}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-scripture">Scripture *</Label>
                <Input
                  id="edit-scripture"
                  name="scripture"
                  placeholder="Enter scripture reference"
                  value={formData.scripture}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                name="content"
                placeholder="Enter sermon content or notes"
                rows={10}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sermon Image</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sermon Video</Label>
              <MediaUpload 
                type="video" 
                value={formData.video_url as string} 
                onChange={handleVideoUrlChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                placeholder="faith, gospel, prayer"
                value={tagsInput}
                onChange={handleTagsChange}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-featured" 
                checked={formData.featured} 
                onCheckedChange={handleFeaturedChange} 
              />
              <label
                htmlFor="edit-featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Featured Sermon
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSermon}>Update Sermon</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sermon "{selectedSermon?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSermon}>
              Delete Sermon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSermons;
