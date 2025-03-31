
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define data types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  location: string;
  tribe: string;
  joinDate: string;
  attendance: {
    date: string;
    present: boolean;
  }[];
  active: boolean;
}

export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  tags: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  imageUrl?: string;
  featured: boolean;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  featured: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  startDate: string;
  workSchedule: {
    day: string;
    hours: string;
  }[];
}

export interface ChurchContextType {
  members: Member[];
  sermons: Sermon[];
  blogPosts: BlogPost[];
  events: Event[];
  employees: Employee[];
  addMember: (member: Omit<Member, "id" | "tribe" | "joinDate" | "attendance" | "active">) => void;
  addSermon: (sermon: Omit<Sermon, "id">) => void;
  addBlogPost: (post: Omit<BlogPost, "id">) => void;
  addEvent: (event: Omit<Event, "id">) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  updateSermon: (id: string, sermon: Partial<Sermon>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteMember: (id: string) => void;
  deleteSermon: (id: string) => void;
  deleteBlogPost: (id: string) => void;
  deleteEvent: (id: string) => void;
  deleteEmployee: (id: string) => void;
  getMembersByTribe: (tribe: string) => Member[];
  getFeaturedSermons: () => Sermon[];
  getFeaturedBlogPosts: () => BlogPost[];
  getFeaturedEvents: () => Event[];
  isLoading: boolean;
}

// Helper function to get tribe based on birth month
const getTribeFromBirthDate = (birthDate: string): string => {
  const month = new Date(birthDate).getMonth();
  const tribes = [
    "Reuben", "Simeon", "Levi", "Judah", 
    "Issachar", "Zebulun", "Dan", "Naphtali", 
    "Gad", "Asher", "Joseph", "Benjamin"
  ];
  return tribes[month];
};

// Create the context
const ChurchContext = createContext<ChurchContextType | undefined>(undefined);

// Mock data for initial state
const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    birthDate: "1990-01-15",
    location: "New York, NY",
    tribe: "Reuben",
    joinDate: "2023-01-01",
    attendance: [
      { date: "2023-08-06", present: true },
      { date: "2023-08-13", present: true },
      { date: "2023-08-20", present: false },
      { date: "2023-08-27", present: true }
    ],
    active: true
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "098-765-4321",
    birthDate: "1985-05-20",
    location: "Los Angeles, CA",
    tribe: "Issachar",
    joinDate: "2023-02-15",
    attendance: [
      { date: "2023-08-06", present: true },
      { date: "2023-08-13", present: false },
      { date: "2023-08-20", present: true },
      { date: "2023-08-27", present: true }
    ],
    active: true
  }
];

const mockSermons: Sermon[] = [
  {
    id: "1",
    title: "Finding Peace in Troubled Times",
    preacher: "Pastor Smith",
    date: "2023-08-27",
    scripture: "John 14:27",
    content: "In a world full of uncertainty and chaos, Jesus offers us a peace that transcends all understanding. Today we'll explore what it means to find true peace in Christ even when our circumstances are difficult.",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    imageUrl: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
    featured: true,
    tags: ["peace", "comfort", "faith"]
  },
  {
    id: "2",
    title: "The Power of Prayer",
    preacher: "Pastor Smith",
    date: "2023-08-20",
    scripture: "Matthew 6:9-13",
    content: "Prayer is our direct line of communication with God. Today we'll learn how to develop a meaningful prayer life that transforms our relationship with God and others.",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    imageUrl: "https://images.unsplash.com/photo-1515705576963-95cad62945b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: false,
    tags: ["prayer", "spiritual disciplines", "communication"]
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Reflections on Our Summer Mission Trip",
    author: "Missions Team",
    date: "2023-08-15",
    content: "This summer, our team traveled to Guatemala to help build a school and share the love of Christ. Read about our experiences and the amazing people we met.",
    imageUrl: "https://images.unsplash.com/photo-1459183885421-5cc683b8dbba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: true,
    tags: ["missions", "outreach", "service"]
  },
  {
    id: "2",
    title: "Join Our New Small Group Study",
    author: "Small Groups Ministry",
    date: "2023-08-10",
    content: "Starting next month, we'll be launching a new small group focused on the book of Romans. Learn how you can get involved and grow in your faith with others.",
    imageUrl: "https://images.unsplash.com/photo-1529165980561-7dd63adebcaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: false,
    tags: ["small groups", "bible study", "community"]
  }
];

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Sunday Worship Service",
    description: "Join us for our weekly worship service with music, prayer, and biblical teaching.",
    date: "2023-09-03",
    time: "10:00 AM - 11:30 AM",
    location: "Main Sanctuary",
    imageUrl: "https://images.unsplash.com/photo-1465829235810-1f231113e790?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    featured: true
  },
  {
    id: "2",
    title: "Youth Group Meeting",
    description: "Our weekly gathering for teenagers with games, worship, and a relevant message.",
    date: "2023-09-06",
    time: "6:30 PM - 8:00 PM",
    location: "Youth Center",
    imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    featured: false
  }
];

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Pastor John Smith",
    role: "Senior Pastor",
    email: "pastor@globalcathedral.org",
    phone: "123-456-7890",
    salary: 60000,
    startDate: "2020-01-01",
    workSchedule: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM" },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
      { day: "Wednesday", hours: "9:00 AM - 8:00 PM" },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
      { day: "Sunday", hours: "8:00 AM - 1:00 PM" }
    ]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Worship Director",
    email: "worship@globalcathedral.org",
    phone: "234-567-8901",
    salary: 45000,
    startDate: "2021-03-15",
    workSchedule: [
      { day: "Wednesday", hours: "6:00 PM - 9:00 PM" },
      { day: "Thursday", hours: "10:00 AM - 4:00 PM" },
      { day: "Sunday", hours: "7:00 AM - 12:00 PM" }
    ]
  }
];

// Create the provider component
export const ChurchProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [sermons, setSermons] = useState<Sermon[]>(mockSermons);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedMembers = localStorage.getItem("churchMembers");
        const storedSermons = localStorage.getItem("churchSermons");
        const storedBlogPosts = localStorage.getItem("churchBlogPosts");
        const storedEvents = localStorage.getItem("churchEvents");
        const storedEmployees = localStorage.getItem("churchEmployees");

        if (storedMembers) setMembers(JSON.parse(storedMembers));
        if (storedSermons) setSermons(JSON.parse(storedSermons));
        if (storedBlogPosts) setBlogPosts(JSON.parse(storedBlogPosts));
        if (storedEvents) setEvents(JSON.parse(storedEvents));
        if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        toast({
          title: "Data Loading Error",
          description: "There was an error loading saved data.",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("churchMembers", JSON.stringify(members));
      localStorage.setItem("churchSermons", JSON.stringify(sermons));
      localStorage.setItem("churchBlogPosts", JSON.stringify(blogPosts));
      localStorage.setItem("churchEvents", JSON.stringify(events));
      localStorage.setItem("churchEmployees", JSON.stringify(employees));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      toast({
        title: "Data Saving Error",
        description: "There was an error saving data.",
        variant: "destructive",
      });
    }
  }, [members, sermons, blogPosts, events, employees, toast]);

  // Add a new member
  const addMember = (newMember: Omit<Member, "id" | "tribe" | "joinDate" | "attendance" | "active">) => {
    setIsLoading(true);
    try {
      const tribe = getTribeFromBirthDate(newMember.birthDate);
      const member: Member = {
        ...newMember,
        id: Date.now().toString(),
        tribe,
        joinDate: new Date().toISOString().split('T')[0],
        attendance: [],
        active: true
      };
      
      setMembers(prevMembers => [...prevMembers, member]);
      toast({
        title: "Member Added",
        description: `${newMember.name} has been added to the ${tribe} tribe.`,
      });
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Member Addition Failed",
        description: "There was an error adding the member.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new sermon
  const addSermon = (newSermon: Omit<Sermon, "id">) => {
    setIsLoading(true);
    try {
      const sermon: Sermon = {
        ...newSermon,
        id: Date.now().toString()
      };
      
      setSermons(prevSermons => [...prevSermons, sermon]);
      toast({
        title: "Sermon Added",
        description: `"${newSermon.title}" has been added to the sermon library.`,
      });
    } catch (error) {
      console.error("Error adding sermon:", error);
      toast({
        title: "Sermon Addition Failed",
        description: "There was an error adding the sermon.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new blog post
  const addBlogPost = (newPost: Omit<BlogPost, "id">) => {
    setIsLoading(true);
    try {
      const post: BlogPost = {
        ...newPost,
        id: Date.now().toString()
      };
      
      setBlogPosts(prevPosts => [...prevPosts, post]);
      toast({
        title: "Blog Post Added",
        description: `"${newPost.title}" has been published.`,
      });
    } catch (error) {
      console.error("Error adding blog post:", error);
      toast({
        title: "Blog Post Addition Failed",
        description: "There was an error publishing the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new event
  const addEvent = (newEvent: Omit<Event, "id">) => {
    setIsLoading(true);
    try {
      const event: Event = {
        ...newEvent,
        id: Date.now().toString()
      };
      
      setEvents(prevEvents => [...prevEvents, event]);
      toast({
        title: "Event Added",
        description: `"${newEvent.title}" has been added to the calendar.`,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Event Addition Failed",
        description: "There was an error adding the event.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new employee
  const addEmployee = (newEmployee: Omit<Employee, "id">) => {
    setIsLoading(true);
    try {
      const employee: Employee = {
        ...newEmployee,
        id: Date.now().toString()
      };
      
      setEmployees(prevEmployees => [...prevEmployees, employee]);
      toast({
        title: "Employee Added",
        description: `${newEmployee.name} has been added as ${newEmployee.role}.`,
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Employee Addition Failed",
        description: "There was an error adding the employee.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing member
  const updateMember = (id: string, updatedMember: Partial<Member>) => {
    setIsLoading(true);
    try {
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === id ? { ...member, ...updatedMember } : member
        )
      );
      toast({
        title: "Member Updated",
        description: "Member information has been updated.",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Member Update Failed",
        description: "There was an error updating the member.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing sermon
  const updateSermon = (id: string, updatedSermon: Partial<Sermon>) => {
    setIsLoading(true);
    try {
      setSermons(prevSermons => 
        prevSermons.map(sermon => 
          sermon.id === id ? { ...sermon, ...updatedSermon } : sermon
        )
      );
      toast({
        title: "Sermon Updated",
        description: "Sermon information has been updated.",
      });
    } catch (error) {
      console.error("Error updating sermon:", error);
      toast({
        title: "Sermon Update Failed",
        description: "There was an error updating the sermon.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing blog post
  const updateBlogPost = (id: string, updatedPost: Partial<BlogPost>) => {
    setIsLoading(true);
    try {
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, ...updatedPost } : post
        )
      );
      toast({
        title: "Blog Post Updated",
        description: "Blog post has been updated.",
      });
    } catch (error) {
      console.error("Error updating blog post:", error);
      toast({
        title: "Blog Post Update Failed",
        description: "There was an error updating the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setIsLoading(true);
    try {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
      toast({
        title: "Event Updated",
        description: "Event information has been updated.",
      });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Event Update Failed",
        description: "There was an error updating the event.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing employee
  const updateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setIsLoading(true);
    try {
      setEmployees(prevEmployees => 
        prevEmployees.map(employee => 
          employee.id === id ? { ...employee, ...updatedEmployee } : employee
        )
      );
      toast({
        title: "Employee Updated",
        description: "Employee information has been updated.",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Employee Update Failed",
        description: "There was an error updating the employee.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a member
  const deleteMember = (id: string) => {
    setIsLoading(true);
    try {
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      toast({
        title: "Member Deleted",
        description: "Member has been removed from the system.",
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Member Deletion Failed",
        description: "There was an error removing the member.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a sermon
  const deleteSermon = (id: string) => {
    setIsLoading(true);
    try {
      setSermons(prevSermons => prevSermons.filter(sermon => sermon.id !== id));
      toast({
        title: "Sermon Deleted",
        description: "Sermon has been removed from the library.",
      });
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast({
        title: "Sermon Deletion Failed",
        description: "There was an error removing the sermon.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a blog post
  const deleteBlogPost = (id: string) => {
    setIsLoading(true);
    try {
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      toast({
        title: "Blog Post Deleted",
        description: "Blog post has been removed.",
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Blog Post Deletion Failed",
        description: "There was an error removing the blog post.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    setIsLoading(true);
    try {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      toast({
        title: "Event Deleted",
        description: "Event has been removed from the calendar.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Event Deletion Failed",
        description: "There was an error removing the event.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an employee
  const deleteEmployee = (id: string) => {
    setIsLoading(true);
    try {
      setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
      toast({
        title: "Employee Deleted",
        description: "Employee has been removed from the system.",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Employee Deletion Failed",
        description: "There was an error removing the employee.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get members by tribe
  const getMembersByTribe = (tribe: string): Member[] => {
    return members.filter(member => member.tribe === tribe);
  };

  // Get featured sermons
  const getFeaturedSermons = (): Sermon[] => {
    return sermons.filter(sermon => sermon.featured);
  };

  // Get featured blog posts
  const getFeaturedBlogPosts = (): BlogPost[] => {
    return blogPosts.filter(post => post.featured);
  };

  // Get featured events
  const getFeaturedEvents = (): Event[] => {
    return events.filter(event => event.featured);
  };

  return (
    <ChurchContext.Provider
      value={{
        members,
        sermons,
        blogPosts,
        events,
        employees,
        addMember,
        addSermon,
        addBlogPost,
        addEvent,
        addEmployee,
        updateMember,
        updateSermon,
        updateBlogPost,
        updateEvent,
        updateEmployee,
        deleteMember,
        deleteSermon,
        deleteBlogPost,
        deleteEvent,
        deleteEmployee,
        getMembersByTribe,
        getFeaturedSermons,
        getFeaturedBlogPosts,
        getFeaturedEvents,
        isLoading
      }}
    >
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (context === undefined) {
    throw new Error("useChurch must be used within a ChurchProvider");
  }
  return context;
};
