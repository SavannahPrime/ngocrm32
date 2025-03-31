
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const AdminEmployees = () => {
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
      <p className="text-gray-600">
        This feature is currently under development. Please check back later.
      </p>
      <Button 
        className="mt-4"
        onClick={() => {
          toast({
            title: "Coming Soon",
            description: "Employee management features will be available in a future update.",
          });
        }}
      >
        Check Status
      </Button>
    </div>
  );
};

export default AdminEmployees;
