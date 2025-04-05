
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
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
import { MediaUpload } from "@/components/MediaUpload";

// Define the team member type
interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  image_url?: string | null;
  email?: string | null;
  phone?: string | null;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

const AdminTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    email: "",
    phone: "",
    display_order: 0
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      setTeam(data || []);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Could not load team members. Please try again later.",
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

  const handleImageChange = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const handleAddMember = async () => {
    try {
      if (!formData.name || !formData.position) {
        toast({
          title: "Error",
          description: "Name and position are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from("team_members")
        .insert({
          name: formData.name,
          position: formData.position,
          bio: formData.bio || null,
          image_url: formData.image_url || null,
          email: formData.email || null,
          phone: formData.phone || null,
          display_order: formData.display_order || (team.length + 1),
        })
        .select();

      if (error) throw error;

      sonnerToast.success("Team member added successfully");
      toast({
        title: "Success",
        description: "Team member has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        position: "",
        bio: "",
        image_url: "",
        email: "",
        phone: "",
        display_order: 0
      });
      
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error adding team member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add team member: ${error.message}`,
      });
    }
  };

  const handleEditMember = async () => {
    try {
      if (!selectedMember) return;
      
      if (!formData.name || !formData.position) {
        toast({
          title: "Error",
          description: "Name and position are required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("team_members")
        .update({
          name: formData.name,
          position: formData.position,
          bio: formData.bio || null,
          image_url: formData.image_url || null,
          email: formData.email || null,
          phone: formData.phone || null,
          display_order: formData.display_order || selectedMember.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedMember.id);

      if (error) throw error;

      sonnerToast.success("Team member updated successfully");
      toast({
        title: "Success",
        description: "Team member has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error updating team member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update team member: ${error.message}`,
      });
    }
  };

  const handleDeleteMember = async () => {
    try {
      if (!selectedMember) return;

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", selectedMember.id);

      if (error) throw error;

      sonnerToast.success("Team member deleted successfully");
      toast({
        title: "Success",
        description: "Team member has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete team member: ${error.message}`,
      });
    }
  };

  const handleOpenEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio || "",
      image_url: member.image_url || "",
      email: member.email || "",
      phone: member.phone || "",
      display_order: member.display_order
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  const filteredTeam = team.filter(member =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
                    {member.email && <p className="text-sm mt-1">{member.email}</p>}
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEditDialog(member)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-destructive" onClick={() => handleOpenDeleteDialog(member)}>
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

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Enter position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Enter bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                placeholder="Enter display order"
                value={formData.display_order?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <MediaUpload
                type="image"
                value={formData.image_url as string}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position *</Label>
                <Input
                  id="edit-position"
                  name="position"
                  placeholder="Enter position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                name="bio"
                placeholder="Enter bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-display_order">Display Order</Label>
              <Input
                id="edit-display_order"
                name="display_order"
                type="number"
                placeholder="Enter display order"
                value={formData.display_order?.toString()}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <MediaUpload
                type="image"
                value={formData.image_url as string}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteMember}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeam;
