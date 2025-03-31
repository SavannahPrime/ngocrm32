
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
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, PlusCircle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TribeType, MemberType, LeaderType } from "@/types/supabase";

const AdminTribes = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [leaders, setLeaders] = useState<LeaderType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState<TribeType | null>(null);
  const [tribeMembers, setTribeMembers] = useState<MemberType[]>([]);
  
  const [formData, setFormData] = useState<Partial<TribeType>>({
    name: "",
    description: ""
  });
  
  // Fetch tribes and related data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch tribes
      const { data: tribeData, error: tribeError } = await supabase
        .from('tribes')
        .select('*')
        .order('name');
        
      if (tribeError) throw tribeError;
      
      // Fetch members
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*');
        
      if (memberError) throw memberError;
      
      // Fetch leaders
      const { data: leaderData, error: leaderError } = await supabase
        .from('leaders')
        .select('*');
        
      if (leaderError) throw leaderError;
      
      setTribes(tribeData || []);
      setMembers(memberData || []);
      setLeaders(leaderData || []);
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

  // Add tribe
  const handleAddTribe = async () => {
    try {
      if (!formData.name) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a name for the tribe.",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('tribes')
        .insert({
          name: formData.name,
          description: formData.description
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tribe has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        description: ""
      });
      fetchData();
    } catch (error: any) {
      console.error("Error adding tribe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add tribe: ${error.message}`,
      });
    }
  };

  // Edit tribe
  const handleEditTribe = async () => {
    try {
      if (!selectedTribe) return;
      
      if (!formData.name) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a name for the tribe.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('tribes')
        .update({
          name: formData.name,
          description: formData.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTribe.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tribe has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedTribe(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating tribe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update tribe: ${error.message}`,
      });
    }
  };

  // Delete tribe
  const handleDeleteTribe = async () => {
    try {
      if (!selectedTribe) return;
      
      // Check if tribe has members
      const tribeMembers = members.filter(member => member.tribe_id === selectedTribe.id);
      if (tribeMembers.length > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This tribe has ${tribeMembers.length} members. Please reassign them before deleting.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      // Check if tribe has a leader
      const tribeLeaders = leaders.filter(leader => leader.tribe_id === selectedTribe.id);
      if (tribeLeaders.length > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: `This tribe has assigned leaders. Please unassign them before deleting.`,
        });
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const { error } = await supabase
        .from('tribes')
        .delete()
        .eq('id', selectedTribe.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tribe has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedTribe(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting tribe:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete tribe: ${error.message}`,
      });
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (tribe: TribeType) => {
    setSelectedTribe(tribe);
    setFormData({
      name: tribe.name,
      description: tribe.description || ""
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (tribe: TribeType) => {
    setSelectedTribe(tribe);
    setIsDeleteDialogOpen(true);
  };

  // Open view members dialog
  const handleViewMembers = (tribe: TribeType) => {
    setSelectedTribe(tribe);
    const filteredMembers = members.filter(member => member.tribe_id === tribe.id);
    setTribeMembers(filteredMembers);
    setIsViewMembersDialogOpen(true);
  };

  // Get tribe leader
  const getTribeLeader = (tribeId: string): LeaderType | null => {
    return leaders.find(leader => leader.tribe_id === tribeId) || null;
  };

  // Get member count for a tribe
  const getMemberCount = (tribeId: string): number => {
    return members.filter(member => member.tribe_id === tribeId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Tribe Management</h1>
        <Button 
          onClick={() => {
            setFormData({
              name: "",
              description: ""
            });
            setIsAddDialogOpen(true);
          }} 
          className="bg-church-primary hover:bg-church-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Tribe
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
                <TableHead className="w-[200px]">Tribe Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Tribe Leader</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tribes.length > 0 ? (
                tribes.map((tribe) => {
                  const tribeLeader = getTribeLeader(tribe.id);
                  const memberCount = getMemberCount(tribe.id);
                  
                  return (
                    <TableRow key={tribe.id}>
                      <TableCell className="font-medium">{tribe.name}</TableCell>
                      <TableCell>{tribe.description || "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewMembers(tribe)}
                          className="flex items-center text-church-primary"
                        >
                          <Users className="mr-1 h-4 w-4" />
                          {memberCount} {memberCount === 1 ? "member" : "members"}
                        </Button>
                      </TableCell>
                      <TableCell>{tribeLeader ? tribeLeader.name : "Unassigned"}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewMembers(tribe)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Members
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEditDialog(tribe)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Tribe
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleOpenDeleteDialog(tribe)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Tribe
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    No tribes found. Click "Add New Tribe" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Tribe Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Tribe</DialogTitle>
            <DialogDescription>
              Create a new tribe for organizing church members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tribe Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter tribe name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter tribe description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTribe}>Add Tribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tribe Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tribe</DialogTitle>
            <DialogDescription>
              Update the tribe information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tribe Name *</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Enter tribe name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter tribe description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTribe}>Update Tribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedTribe?.name}" tribe? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTribe}>
              Delete Tribe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Members Dialog */}
      <Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTribe?.name} Tribe Members</DialogTitle>
            <DialogDescription>
              Members belonging to this tribe.
            </DialogDescription>
          </DialogHeader>
          
          {tribeMembers.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              No members in this tribe yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tribeMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email || member.phone || "-"}</TableCell>
                    <TableCell>{member.join_date ? new Date(member.join_date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{member.is_active ? "Active" : "Inactive"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewMembersDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTribes;
