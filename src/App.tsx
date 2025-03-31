
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChurchProvider } from "./contexts/ChurchContext";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Admin from "./pages/Admin";
import AdminMembers from "./pages/admin/Members";
import AdminSermons from "./pages/admin/Sermons";
import AdminEmployees from "./pages/admin/Employees";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChurchProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="sermons" element={<Sermons />} />
                <Route path="sermons/:id" element={<SermonDetail />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:id" element={<BlogPost />} />
                <Route path="events" element={<Events />} />
                <Route path="contact" element={<Contact />} />
                <Route path="register" element={<Register />} />
                <Route path="donate" element={<Donate />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />}>
                <Route index element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="sermons" element={<AdminSermons />} />
                <Route path="employees" element={<AdminEmployees />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChurchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
