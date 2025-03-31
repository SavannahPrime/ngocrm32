
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Edit, Trash2, PlusCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { MemberType, TribeType } from "@/types/supabase";

const AdminMembers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [tribes, setTribes] = useState<TribeType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  
  const [formData, setFormData] = useState<Partial<MemberType>>({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    address: "",
    tribe_id: null,
    join_date: new Date().toISOString().split('T')[0],
    is_active: true
  });
  
  // Fetch members and tribes
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .order('name');
        
      if (memberError) throw memberError;
      
      const { data: tribeData, error: tribeError } = await supabase
        .from('tribes')
        .select('*')
        .order('name');
        
      if (tribeError) throw tribeError;
      
      setMembers(memberData || []);
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle is_active checkbox
  const handleActiveChange = (checked: boolean) => {
    setFormData({ ...formData, is_active: checked });
  };

  // Handle tribe selection
  const handleTribeChange = (value: string) => {
    setFormData({ ...formData, tribe_id: value === "null" ? null : value });
  };

  // Auto-assign tribe based on birth date
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const birthDate = e.target.value;
    setFormData({ ...formData, birth_date: birthDate });
    
    if (birthDate) {
      const month = new Date(birthDate).getMonth();
      const tribeIndex = month; // 0-11 maps to January-December
      
      if (tribes.length >= 12) {
        const matchingTribe = tribes[tribeIndex];
        if (matchingTribe) {
          setFormData(prev => ({ ...prev, birth_date: birthDate, tribe_id: matchingTribe.id }));
        }
      }
    }
  };

  // Add member
  const handleAddMember = async () => {
    try {
      if (!formData.name) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a name for the member.",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birth_date,
          address: formData.address,
          tribe_id: formData.tribe_id,
          join_date: formData.join_date || new Date().toISOString().split('T')[0],
          is_active: formData.is_active !== undefined ? formData.is_active : true
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member has been added successfully!",
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        birth_date: "",
        address: "",
        tribe_id: null,
        join_date: new Date().toISOString().split('T')[0],
        is_active: true
      });
      fetchData();
    } catch (error: any) {
      console.error("Error adding member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add member: ${error.message}`,
      });
    }
  };

  // Edit member
  const handleEditMember = async () => {
    try {
      if (!selectedMember) return;
      
      if (!formData.name) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please provide a name for the member.",
        });
        return;
      }
      
      const { error } = await supabase
        .from('members')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birth_date,
          address: formData.address,
          tribe_id: formData.tribe_id,
          join_date: formData.join_date,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member has been updated successfully!",
      });
      
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      fetchData();
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update member: ${error.message}`,
      });
    }
  };

  // Delete member
  const handleDeleteMember = async () => {
    try {
      if (!selectedMember) return;
      
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Member has been deleted successfully!",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchData();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete member: ${error.message}`,
      });
    }
  };

  // Open edit dialog
  const handleOpenEditDialog = (member: MemberType) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email || "",
      phone: member.phone || "",
      birth_date: member.birth_date || "",
      address: member.address || "",
      tribe_id: member.tribe_id,
      join_date: member.join_date || new Date().toISOString().split('T')[0],
      is_active: member.is_active !== null ? member.is_active : true
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = (member: MemberType) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  // Get tribe name from tribe ID
  const getTribeName = (tribeId: string | null | undefined): string => {
    if (!tribeId) return "Unassigned";
    const tribe = tribes.find(t => t.id === tribeId);
    return tribe ? tribe.name : "Unknown";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Member Management</h1>
        <Button 
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              phone: "",
              birth_date: "",
              address: "",
              tribe_id: null,
              join_date: new Date().toISOString().split('T')[0],
              is_active: true
            });
            setIsAddDialogOpen(true);
          }} 
          className="bg-church-primary hover:bg-church-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Member
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
                <TableHead>Contact</TableHead>
                <TableHead>Tribe</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email || member.phone || "-"}</TableCell>
                    <TableCell>{getTribeName(member.tribe_id)}</TableCell>
                    <TableCell>
                      {member.join_date ? format(new Date(member.join_date), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
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
                          <DropdownMenuItem onClick={() => handleOpenEditDialog(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={() => handleOpenDeleteDialog(member)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No members found. Click "Add New Member" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new member to the church community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter member name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birth_date">Birth Date (Tribe Assignment)</Label>
                <div className="flex items-center">
                  <Input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleBirthDateChange}
                  />
                  <Calendar className="ml-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter residential address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tribe">Tribe</Label>
                <Select 
                  onValueChange={handleTribeChange} 
                  defaultValue={formData.tribe_id || "null"}
                  value={formData.tribe_id || "null"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tribe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Unassigned</SelectItem>
                    {tribes.map((tribe) => (
                      <SelectItem key={tribe.id} value={tribe.id}>
                        {tribe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="join_date">Join Date</Label>
                <Input
                  id="join_date"
                  name="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_active" 
                checked={formData.is_active} 
                onCheckedChange={handleActiveChange} 
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active Member
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  name="name"
                  placeholder="Enter member name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-birth_date">Birth Date</Label>
                <div className="flex items-center">
                  <Input
                    id="edit-birth_date"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleBirthDateChange}
                  />
                  <Calendar className="ml-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                placeholder="Enter residential address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tribe">Tribe</Label>
                <Select 
                  onValueChange={handleTribeChange} 
                  defaultValue={formData.tribe_id || "null"}
                  value={formData.tribe_id || "null"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tribe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Unassigned</SelectItem>
                    {tribes.map((tribe) => (
                      <SelectItem key={tribe.id} value={tribe.id}>
                        {tribe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-join_date">Join Date</Label>
                <Input
                  id="edit-join_date"
                  name="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-is_active" 
                checked={formData.is_active} 
                onCheckedChange={handleActiveChange} 
              />
              <label
                htmlFor="edit-is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active Member
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMember}>Update Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMember?.name}" from members? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
