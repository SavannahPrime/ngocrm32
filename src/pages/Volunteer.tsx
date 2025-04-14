import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Volunteer registration schema
const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  interests: z.array(z.string()).optional(),
  availability: z.string().optional(),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

const Volunteer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch 
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema)
  });

  // Predefined volunteer interest options
  const interestOptions = [
    { value: 'community_service', label: 'Community Service' },
    { value: 'education', label: 'Education' },
    { value: 'youth_programs', label: 'Youth Programs' },
    { value: 'event_support', label: 'Event Support' },
    { value: 'fundraising', label: 'Fundraising' },
  ];

  const onSubmit = async (data: VolunteerFormData) => {
    setIsLoading(true);
    try {
      // Insert volunteer data into members table
      const { data: insertedData, error } = await supabase
        .from('members')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          volunteer_interests: data.interests || [],
          is_volunteer: true,
          join_date: new Date().toISOString(),
          is_active: true
        } as any)
        .select();

      if (error) throw error;

      toast({
        title: "Volunteer Registration",
        description: "Thank you for registering as a volunteer!",
      });

      // Redirect to a thank you page or home
      navigate('/');
    } catch (error) {
      console.error('Volunteer registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Volunteer Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-2">Name *</label>
              <Input 
                {...register('name')}
                placeholder="Your full name" 
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block mb-2">Email *</label>
              <Input 
                {...register('email')}
                type="email" 
                placeholder="your.email@example.com" 
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block mb-2">Phone (Optional)</label>
              <Input 
                {...register('phone')}
                placeholder="Your phone number" 
              />
            </div>
            
            <div>
              <label className="block mb-2">Address (Optional)</label>
              <Input 
                {...register('address')}
                placeholder="Your address" 
              />
            </div>
            
            <div>
              <label className="block mb-2">Volunteer Interests</label>
              <div className="grid md:grid-cols-3 gap-2">
                {interestOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      onCheckedChange={(checked) => {
                        const currentInterests = watch('interests') || [];
                        const newInterests = checked 
                          ? [...currentInterests, option.value]
                          : currentInterests.filter(i => i !== option.value);
                        setValue('interests', newInterests);
                      }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Register as Volunteer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Volunteer;
