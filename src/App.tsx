
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NGOProvider } from "./contexts/NGOContext";
import { ChurchProvider } from "./contexts/ChurchContext";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import OurMission from "./pages/OurMission";
import OurTeam from "./pages/OurTeam";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Volunteer from "./pages/Volunteer";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Admin from "./pages/Admin";
import AdminMembers from "./pages/admin/Members";
import AdminProjects from "./pages/admin/Projects";
import AdminBlog from "./pages/admin/Blog";
import AdminEvents from "./pages/admin/Events";
import AdminTeam from "./pages/admin/Team";
import AdminPrograms from "./pages/admin/Programs";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfile from "./pages/admin/Profile";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChurchProvider>
          <NGOProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="mission" element={<OurMission />} />
                  <Route path="team" element={<OurTeam />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:id" element={<BlogPost />} />
                  <Route path="events" element={<Events />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="volunteer" element={<Volunteer />} />
                  <Route path="register" element={<Register />} />
                  <Route path="donate" element={<Donate />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="members" element={<AdminMembers />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="programs" element={<AdminPrograms />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NGOProvider>
        </ChurchProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
