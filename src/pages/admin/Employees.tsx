
import { useState } from "react";
import { useChurch } from "@/contexts/ChurchContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Edit, Eye, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Work schedule days
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AdminEmployees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, isLoading } = useChurch();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  
  // Basic employee data
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    salary: 0,
    startDate: new Date().toISOString().split("T")[0],
  });
  
  // Work schedule state
  const [schedule, setSchedule] = useState<Array<{day: string, hours: string, active: boolean}>>(
    weekDays.map(day => ({ day, hours: "9:00 AM - 5:00 PM", active: false }))
  );
  
  const selectedEmployee = selectedEmployeeId 
    ? employees.find(emp => emp.id === selectedEmployeeId) 
    : null;
  
  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      salary: 0,
      startDate: new Date().toISOString().split("T")[0],
    });
    setSchedule(
      weekDays.map(day => ({ day, hours: "9:00 AM - 5:00 PM", active: false }))
    );
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };
  
  const handleScheduleToggle = (dayIndex: number) => {
    setSchedule(prev => 
      prev.map((item, idx) => 
        idx === dayIndex ? { ...item, active: !item.active } : item
      )
    );
  };
  
  const handleScheduleHoursChange = (dayIndex: number, hours: string) => {
    setSchedule(prev => 
      prev.map((item, idx) => 
        idx === dayIndex ? { ...item, hours } : item
      )
    );
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const workSchedule = schedule
        .filter(item => item.active)
        .map(({ day, hours }) => ({ day, hours }));
      
      if (workSchedule.length === 0) {
        toast({
          title: "Schedule Required",
          description: "Please add at least one work day to the schedule.",
          variant: "destructive",
        });
        return;
      }
      
      addEmployee({
        ...formData,
        workSchedule,
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error Adding Employee",
        description: "There was an error adding the employee. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleEditOpen = (id: string) => {
    const employee = employees.find(e => e.id === id);
    if (employee) {
      setSelectedEmployeeId(id);
      
      // Set basic employee data
      setFormData({
        name: employee.name,
        role: employee.role,
        email: employee.email,
        phone: employee.phone,
        salary: employee.salary,
        startDate: employee.startDate,
      });
      
      // Set work schedule
      const newSchedule = weekDays.map(day => {
        const existingDay = employee.workSchedule.find(s => s.day === day);
        return {
          day,
          hours: existingDay ? existingDay.hours : "9:00 AM - 5:00 PM",
          active: !!existingDay,
        };
      });
      setSchedule(newSchedule);
      
      setIsEditDialogOpen(true);
    }
  };
  
  const handleViewOpen = (id: string) => {
    setSelectedEmployeeId(id);
    setIsViewDialogOpen(true);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployeeId) return;
    
    try {
      const workSchedule = schedule
        .filter(item => item.active)
        .map(({ day, hours }) => ({ day, hours }));
      
      if (workSchedule.length === 0) {
        toast({
          title: "Schedule Required",
          description: "Please add at least one work day to the schedule.",
          variant: "destructive",
        });
        return;
      }
      
      updateEmployee(selectedEmployeeId, {
        ...formData,
        workSchedule,
      });
      
      setIsEditDialogOpen(false);
      resetForm();
      setSelectedEmployeeId(null);
    } catch (error) {
      toast({
        title: "Error Updating Employee",
        description: "There was an error updating the employee. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteOpen = (id: string) => {
    setSelectedEmployeeId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (selectedEmployeeId) {
      deleteEmployee(selectedEmployeeId);
      setIsDeleteDialogOpen(false);
      setSelectedEmployeeId(null);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position</Label>
                  <Input 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (Annual)</Label>
                  <Input 
                    id="salary" 
                    name="salary" 
                    type="number" 
                    min="0" 
                    step="1000"
                    value={formData.salary} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Work Schedule</Label>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {schedule.map((day, index) => (
                        <div key={day.day} className="flex items-center gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`day-${day.day}`}
                              checked={day.active}
                              onChange={() => handleScheduleToggle(index)}
                              className="mr-2"
                            />
                            <Label htmlFor={`day-${day.day}`} className="w-28">
                              {day.day}
                            </Label>
                          </div>
                          {day.active && (
                            <Input
                              value={day.hours}
                              onChange={(e) => handleScheduleHoursChange(index, e.target.value)}
                              placeholder="9:00 AM - 5:00 PM"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                  {isLoading ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            Manage all church staff and employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No employees available.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <div>{employee.email}</div>
                      <div className="text-xs text-gray-500">{employee.phone}</div>
                    </TableCell>
                    <TableCell>{format(new Date(employee.startDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>${employee.salary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewOpen(employee.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditOpen(employee.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteOpen(employee.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p>{selectedEmployee.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p>{selectedEmployee.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p>{selectedEmployee.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                  <p>{format(new Date(selectedEmployee.startDate), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Annual Salary</h3>
                  <p>${selectedEmployee.salary.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Work Schedule</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {selectedEmployee.workSchedule.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{item.day}:</span>
                          <span>{item.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role/Position</Label>
                <Input 
                  id="edit-role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input 
                  id="edit-phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary (Annual)</Label>
                <Input 
                  id="edit-salary" 
                  name="salary" 
                  type="number" 
                  min="0" 
                  step="1000"
                  value={formData.salary} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input 
                  id="edit-startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Work Schedule</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {schedule.map((day, index) => (
                      <div key={day.day} className="flex items-center gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`edit-day-${day.day}`}
                            checked={day.active}
                            onChange={() => handleScheduleToggle(index)}
                            className="mr-2"
                          />
                          <Label htmlFor={`edit-day-${day.day}`} className="w-28">
                            {day.day}
                          </Label>
                        </div>
                        {day.active && (
                          <Input
                            value={day.hours}
                            onChange={(e) => handleScheduleHoursChange(index, e.target.value)}
                            placeholder="9:00 AM - 5:00 PM"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                {isLoading ? "Updating..." : "Update Employee"}
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
          <p>Are you sure you want to delete the employee: <span className="font-semibold">{selectedEmployee?.name}</span>?</p>
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

export default AdminEmployees;
