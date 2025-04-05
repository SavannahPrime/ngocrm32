
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useNGO } from "@/contexts/NGOContext";
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

const Register = () => {
  const { toast } = useToast();
  const { addMember, isLoading } = useNGO();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Convert date to ISO string and format data
    const memberData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.location,
      birth_date: data.birthDate.toISOString().split('T')[0],
    };
    
    // Add member to the database
    const success = await addMember(memberData);
    
    if (success) {
      toast({
        title: "Registration Successful",
        description: `Thank you for registering as a volunteer! We will contact you soon.`,
      });
      
      // Reset form
      form.reset();
      setSelectedRegion(null);
    }
  };

  // Update region based on location input
  const handleLocationChange = (value: string) => {
    // This is just a placeholder logic, replace with your actual region determination logic
    if (value.toLowerCase().includes('africa')) {
      setSelectedRegion('Africa');
    } else if (value.toLowerCase().includes('asia')) {
      setSelectedRegion('Asia');
    } else if (value.toLowerCase().includes('europe')) {
      setSelectedRegion('Europe');
    } else if (value.toLowerCase().includes('america')) {
      setSelectedRegion('Americas');
    } else {
      setSelectedRegion(null);
    }
    
    form.setValue("location", value);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-ngo-primary">Join Our Volunteer Network</h1>
        <p className="mt-2 text-gray-600">Register as a volunteer and help us make a difference in communities worldwide</p>
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
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      You must be at least 18 years old to volunteer.
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
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City, Country" 
                        {...field} 
                        onChange={(e) => handleLocationChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Display assigned region */}
            {selectedRegion && (
              <div className="p-4 bg-ngo-light rounded-md border border-ngo-primary">
                <p className="font-medium text-ngo-primary">
                  Based on your location, you will be assigned to our <span className="font-bold">{selectedRegion} Team</span>
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-ngo-primary hover:bg-ngo-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register as Volunteer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="mt-10 bg-gray-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold text-ngo-primary mb-4">Why Volunteer With Us?</h2>
        <p className="text-gray-600 mb-4">
          At HopeHarbor, our volunteers are the backbone of our mission to create positive change around the world.
          When you volunteer with us, you become part of a global community dedicated to making a difference.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Meaningful Impact</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Skill Development</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Global Network</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Cultural Exchange</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Professional Growth</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Leadership Opportunities</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Flexible Commitment</span>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <span className="font-bold text-ngo-primary">Diverse Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
