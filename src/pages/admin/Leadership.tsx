
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LeaderType, TribeType } from "@/types/supabase";
import { MediaUpload } from "@/components/MediaUpload";

const AdminLeadership = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<LeaderType | null>(null);
  
  const [formData, setFormData] = useState<Partial<LeaderType>>({
    name: "",
    role: "",
    bio: "",
    image_url: "",
    contact_email: "",
    contact_phone: "",
    featured: false,
    tribe_id: null
  });
  
  // Fetch leaders and tribes
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: leaderData, error: leaderError } = await supabase
        .from('leaders')
        .select('*')
        .order('name');
        
      if (leaderError) throw leaderError;
      
      const { data: tribeData, error: tribeError } = await supabase
        .from('tribes')
        .select('*')
        .order('name');
        
      if (tribeError) throw tribeError;
      
      setLeaders(leaderData || []);
      setTribes(tribeData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchData();
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

  // Handle tribe selection
  const handleTribeChange = (value: string) => {
    setFormData({ ...formData, tribe_id: value === "null" ? null : value });
  };

  // Handle image URL changes
  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  // Add leader
  const handleAddLeader = async () => {
    try {
      if (!formData.name || !formData.role) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('leaders')
        .insert({
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          image_url: formData.image_url,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          featured: formData.featured || false,
          tribe_id: formData.tribe_id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leader has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        role: "",
        bio: "",
        image_url: "",
        contact_email: "",
        contact_phone: "",
        featured: false,
        tribe_id: null
      });
      fetchData();
    } catch (error: any) {
      console.error("Error adding leader:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add leader: ${error.message}`,
      });
    }
  };

  // Edit leader
  const handleEditLeader = async () => {
    try {
      if (!selectedLeader) return;
      
      if (!formData.name || !formData.role) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all required fields.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('leaders')
        .update({
          name: formData.name,
          role: formData.role,
          bio: formData.bio,
          image_url: formData.image_url,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          featured: formData.featured,
          tribe_id: formData.tribe_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedLeader.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leader has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedLeader(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating leader:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update leader: ${error.message}`,
      });
    }
  };

  // Delete leader
  const handleDeleteLeader = async () => {
    try {
      if (!selectedLeader) return;
      
      const { error } = await supabase
        .from('leaders')
        .delete()
        .eq('id', selectedLeader.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Leader has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedLeader(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting leader:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete leader: ${error.message}`,
      });
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (leader: LeaderType) => {
    setSelectedLeader(leader);
    setFormData({
      name: leader.name,
      role: leader.role,
      bio: leader.bio || "",
      image_url: leader.image_url || "",
      contact_email: leader.contact_email || "",
      contact_phone: leader.contact_phone || "",
      featured: leader.featured || false,
      tribe_id: leader.tribe_id
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (leader: LeaderType) => {
    setSelectedLeader(leader);
    setIsDeleteDialogOpen(true);
  };

  // Get tribe name from tribe ID
  const getTribeName = (tribeId: string | null | undefined): string => {
    if (!tribeId) return "None";
    const tribe = tribes.find(t => t.id === tribeId);
    return tribe ? tribe.name : "Unknown";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Leadership Management</h1>
        <Button 
          onClick={() => {
            setFormData({
              name: "",
              role: "",
              bio: "",
              image_url: "",
              contact_email: "",
              contact_phone: "",
              featured: false,
              tribe_id: null
            });
            setIsAddDialogOpen(true);
          }} 
          className="bg-church-primary hover:bg-church-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Leader
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
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tribe</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaders.length > 0 ? (
                leaders.map((leader) => (
                  <TableRow key={leader.id}>
                    <TableCell className="font-medium">{leader.name}</TableCell>
                    <TableCell>{leader.role}</TableCell>
                    <TableCell>{getTribeName(leader.tribe_id)}</TableCell>
                    <TableCell>{leader.contact_email || "-"}</TableCell>
                    <TableCell>{leader.featured ? "Yes" : "No"}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(leader)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Leader
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleOpenDeleteDialog(leader)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Leader
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No leaders found. Click "Add New Leader" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Leader Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Leader</DialogTitle>
            <DialogDescription>
              Add a new church leader or ministry head to the leadership team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter leader name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Enter role or position"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  placeholder="Enter phone number"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tribe">Tribe (for Tribe Leaders)</Label>
              <Select 
                onValueChange={handleTribeChange} 
                defaultValue="null"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tribe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {tribes.map((tribe) => (
                    <SelectItem key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio/Description</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Enter leader biography or description"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Leader Photo</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
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
                Featured Leader (appears in top section)
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLeader}>Add Leader</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Leader Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Leader</DialogTitle>
            <DialogDescription>
              Update the details of the church leader.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Enter leader name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role/Position *</Label>
                <Input
                  id="edit-role"
                  name="role"
                  placeholder="Enter role or position"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-contact_email">Email</Label>
                <Input
                  id="edit-contact_email"
                  name="contact_email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contact_phone">Phone</Label>
                <Input
                  id="edit-contact_phone"
                  name="contact_phone"
                  placeholder="Enter phone number"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tribe">Tribe (for Tribe Leaders)</Label>
              <Select 
                onValueChange={handleTribeChange} 
                defaultValue={formData.tribe_id || "null"}
                value={formData.tribe_id || "null"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tribe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">None</SelectItem>
                  {tribes.map((tribe) => (
                    <SelectItem key={tribe.id} value={tribe.id}>
                      {tribe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio/Description</Label>
              <Textarea
                id="edit-bio"
                name="bio"
                placeholder="Enter leader biography or description"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Leader Photo</Label>
              <MediaUpload 
                type="image" 
                value={formData.image_url as string} 
                onChange={handleImageUrlChange} 
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
                Featured Leader (appears in top section)
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditLeader}>Update Leader</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedLeader?.name}" from leadership? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLeader}>
              Delete Leader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadership;
