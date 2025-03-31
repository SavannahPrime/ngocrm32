
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useChurch } from "@/contexts/ChurchContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  birthDate: z.date({
    required_error: "Please select your birth date",
  }),
  location: z.string().min(2, "Location must be at least 2 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const getTribeName = (date: Date) => {
  const month = date.getMonth();
  const tribes = [
    "Reuben", "Simeon", "Levi", "Judah", 
    "Issachar", "Zebulun", "Dan", "Naphtali", 
    "Gad", "Asher", "Joseph", "Benjamin"
  ];
  return tribes[month];
};

const Register = () => {
  const { toast } = useToast();
  const { addMember, isLoading } = useChurch();
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convert date to ISO string for consistency and ensure all fields are non-optional
    const formattedData = {
      name: data.name,          // Make these non-optional
      email: data.email,        // Make these non-optional
      phone: data.phone,        // Make these non-optional
      location: data.location,  // Make these non-optional
      birthDate: data.birthDate.toISOString().split('T')[0],
    };
    
    // Add member to the church database
    addMember(formattedData);
    
    toast({
      title: "Registration Successful",
      description: `Welcome to the ${selectedTribe} tribe! You have been registered as a member.`,
    });
    
    // Reset form
    form.reset();
    setSelectedTribe(null);
  };

  // Update tribe when birth date changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const tribe = getTribeName(date);
      setSelectedTribe(tribe);
      form.setValue("birthDate", date);
    } else {
      setSelectedTribe(null);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-serif text-church-primary">Join Our Church Community</h1>
        <p className="mt-2 text-gray-600">Register as a member and be part of one of our 12 Tribes based on your birth month</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your birth month determines your tribe assignment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Display assigned tribe */}
            {selectedTribe && (
              <div className="p-4 bg-church-light rounded-md border border-church-primary">
                <p className="font-medium text-church-primary">
                  Based on your birth month, you will be assigned to the <span className="font-bold">Tribe of {selectedTribe}</span>
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-church-primary hover:bg-church-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register as Member"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-10 bg-gray-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-church-primary mb-4">The 12 Tribes Assignment</h2>
        <p className="text-gray-600 mb-4">
          At GlobalCathedral, we organize our members into 12 tribes based on birth months, inspired by the 12 Tribes of Israel.
          This helps us build stronger community connections and organize church activities.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">January:</span> Reuben
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">February:</span> Simeon
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">March:</span> Levi
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">April:</span> Judah
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">May:</span> Issachar
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">June:</span> Zebulun
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">July:</span> Dan
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">August:</span> Naphtali
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">September:</span> Gad
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">October:</span> Asher
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">November:</span> Joseph
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-church-primary">December:</span> Benjamin
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
