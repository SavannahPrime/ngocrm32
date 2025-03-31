
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

// Form schema validation
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to admin dashboard if already authenticated
  if (isAuthenticated) {
    navigate("/admin");
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate("/admin");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-serif text-church-primary">Admin Login</h1>
          <p className="mt-2 text-gray-600">Sign in to access the church administration panel</p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-church-light p-3">
              <Lock className="h-6 w-6 text-church-primary" />
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="pastor@globalcathedral.org" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="•••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button
                  type="submit"
                  className="w-full bg-church-primary hover:bg-church-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="text-center text-sm">
              <p className="text-gray-500">
                For demo purposes, use:
              </p>
              <p className="mt-1 text-gray-700">
                Email: pastor@globalcathedral.org
              </p>
              <p className="text-gray-700">
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
