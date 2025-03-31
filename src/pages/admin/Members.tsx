
import { useState, useEffect } from "react";
import { useChurch, Member } from "@/contexts/ChurchContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { MoreHorizontal, Search, UserPlus, Mail, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminMembers = () => {
  const { members, updateMember, deleteMember } = useChurch();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [tribeFilter, setTribeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // All possible tribes
  const tribes = [
    "Reuben", "Simeon", "Levi", "Judah", 
    "Issachar", "Zebulun", "Dan", "Naphtali", 
    "Gad", "Asher", "Joseph", "Benjamin"
  ];

  // Apply filters
  useEffect(() => {
    let result = [...members];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        member =>
          member.name.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term) ||
          member.location.toLowerCase().includes(term)
      );
    }
    
    // Tribe filter
    if (tribeFilter !== "all") {
      result = result.filter(member => member.tribe === tribeFilter);
    }
    
    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter(member => member.active === isActive);
    }
    
    setFilteredMembers(result);
  }, [members, searchTerm, tribeFilter, statusFilter]);

  // Mark attendance for a member
  const markAttendance = (present: boolean) => {
    if (!selectedMember) return;
    
    const updatedAttendance = [
      ...(selectedMember.attendance || []),
      { date: attendanceDate, present }
    ];
    
    updateMember(selectedMember.id, { attendance: updatedAttendance });
    
    toast({
      title: "Attendance Recorded",
      description: `${selectedMember.name} marked as ${present ? "present" : "absent"} for ${attendanceDate}`,
    });
    
    setIsAttendanceDialogOpen(false);
  };

  // Toggle active status for a member
  const toggleActiveStatus = (memberId: string, currentStatus: boolean) => {
    updateMember(memberId, { active: !currentStatus });
    
    toast({
      title: "Status Updated",
      description: `Member status changed to ${!currentStatus ? "active" : "inactive"}`,
    });
  };

  // Delete member
  const confirmDeleteMember = () => {
    if (!selectedMember) return;
    
    deleteMember(selectedMember.id);
    
    toast({
      title: "Member Deleted",
      description: `${selectedMember.name} has been removed from the system`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  // Send follow-up email
  const sendFollowupEmail = (memberId: string, memberEmail: string) => {
    // In a real app, this would call an API to send an email
    toast({
      title: "Follow-up Email Sent",
      description: `Email sent to ${memberEmail}`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Member Management</h1>
        <Button className="bg-church-primary hover:bg-church-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Member
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search members by name, email, or location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Select value={tribeFilter} onValueChange={setTribeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tribe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tribes</SelectItem>
                {tribes.map(tribe => (
                  <SelectItem key={tribe} value={tribe}>
                    {tribe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button variant="outline" className="w-full" onClick={() => {
              setSearchTerm("");
              setTribeFilter("all");
              setStatusFilter("all");
            }}>
              Reset Filters
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Tribe</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-church-light text-church-primary">
                      {member.tribe}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{member.email}</div>
                    <div className="text-xs text-gray-500">{member.phone}</div>
                  </TableCell>
                  <TableCell>{member.location}</TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${member.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {member.active ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => {
                          setSelectedMember(member);
                          setIsAttendanceDialogOpen(true);
                        }}>
                          Record Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActiveStatus(member.id, member.active)}>
                          Mark as {member.active ? 'Inactive' : 'Active'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sendFollowupEmail(member.id, member.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Follow-up
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Delete Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No members found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Attendance</DialogTitle>
            <DialogDescription>
              Mark {selectedMember?.name}'s attendance for a specific date.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Date:</label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => markAttendance(true)}
            >
              <Check className="mr-2 h-4 w-4" />
              Present
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => markAttendance(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMember}>
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMembers;
