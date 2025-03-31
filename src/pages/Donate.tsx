
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, CreditCard, Smartphone } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount",
  }),
  paymentMethod: z.enum(["credit", "mpesa", "paypal"], {
    required_error: "Please select a payment method",
  }),
  frequency: z.enum(["one-time", "weekly", "monthly"], {
    required_error: "Please select a donation frequency",
  }),
  purpose: z.string().optional(),
  // Credit card fields
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  // M-Pesa fields
  phoneNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Predefined donation amounts
const donationAmounts = ["10", "25", "50", "100", "500"];

const Donate = () => {
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "25",
      paymentMethod: "credit",
      frequency: "one-time",
      purpose: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Donation submitted:", data);
    
    toast({
      title: "Donation Successful",
      description: `Thank you for your ${data.frequency === "one-time" ? "donation" : data.frequency + " donation"} of $${data.amount}.`,
    });
    
    form.reset({
      name: "",
      email: "",
      amount: "25",
      paymentMethod: "credit",
      frequency: "one-time",
      purpose: "",
    });
    setCustomAmount(false);
    setIsProcessing(false);
  };

  // Get current payment method
  const paymentMethod = form.watch("paymentMethod");

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-serif text-church-primary mb-2">
            Support Our Ministry
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your generous donations help us spread the Gospel, support community programs, and
            maintain our church facilities. Thank you for your support!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-church-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-church-primary">Community Outreach</h3>
            <p className="text-gray-600">
              Support our food pantry, homeless ministry, and community service programs.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-church-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-church-primary">Youth Ministry</h3>
            <p className="text-gray-600">
              Help fund our youth programs, camps, and educational materials.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-church-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-church-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"/><polyline points="12 17 12 11"/><polyline points="9 11 9 17"/><polyline points="15 11 15 17"/><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-church-primary">Building Fund</h3>
            <p className="text-gray-600">
              Contribute to maintenance, improvements, and expansion of our church facilities.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold font-serif text-church-primary mb-6 text-center">
            Make a Donation
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount</FormLabel>
                    <div className="space-y-3">
                      {!customAmount ? (
                        <div className="flex flex-wrap gap-2">
                          {donationAmounts.map((amount) => (
                            <Button
                              key={amount}
                              type="button"
                              variant={field.value === amount ? "default" : "outline"}
                              className={field.value === amount ? "bg-church-primary" : ""}
                              onClick={() => {
                                field.onChange(amount);
                              }}
                            >
                              ${amount}
                            </Button>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCustomAmount(true);
                              field.onChange("");
                            }}
                          >
                            Custom
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                className="pl-8"
                                placeholder="Enter amount"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCustomAmount(false);
                              field.onChange("25");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Frequency</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="one-time" />
                          </FormControl>
                          <FormLabel className="font-normal">One-time</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="weekly" />
                          </FormControl>
                          <FormLabel className="font-normal">Weekly</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="monthly" />
                          </FormControl>
                          <FormLabel className="font-normal">Monthly</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specify the purpose of your donation, if any"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Let us know if you want your donation to go to a specific ministry or purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="credit" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="mpesa" className="flex items-center">
                          <Smartphone className="mr-2 h-4 w-4" />
                          M-Pesa
                        </TabsTrigger>
                        <TabsTrigger value="paypal" className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3m3-8v10-10Z"/><path d="M22 12H13"/><path d="m17 8-4 4 4 4"/></svg>
                          PayPal
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="credit" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" />
                            </FormControl>
                          </FormItem>
                          <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" />
                              </FormControl>
                            </FormItem>
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" />
                              </FormControl>
                            </FormItem>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="mpesa" className="mt-4 space-y-4">
                        <FormItem>
                          <FormLabel>M-Pesa Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+254 7XX XXX XXX" />
                          </FormControl>
                          <FormDescription>
                            Enter the phone number registered with M-Pesa
                          </FormDescription>
                        </FormItem>
                      </TabsContent>
                      <TabsContent value="paypal" className="mt-4 space-y-4">
                        <p className="text-gray-600">
                          You will be redirected to PayPal to complete your donation.
                        </p>
                      </TabsContent>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-church-primary hover:bg-church-primary/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Donation"}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Your donation is tax-deductible to the extent allowed by law.</p>
                <p className="mt-1">GlobalCathedral Church is a registered 501(c)(3) organization.</p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
