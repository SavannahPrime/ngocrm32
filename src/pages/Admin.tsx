
import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  BookOpen,
  LayoutDashboard,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Admin = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed inset-0 flex z-40 md:hidden" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-church-primary">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          {/* Mobile sidebar content */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-white font-serif text-xl font-bold">GlobalCathedral Admin</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <AdminNavLinks closeSidebar={closeSidebar} currentPath={location.pathname} />
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-church-primary/20 p-4">
            <div className="flex items-center">
              <div>
                <UserRound className="h-8 w-8 text-white bg-church-secondary rounded-full p-1" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || "Admin User"}</p>
                <Button
                  variant="ghost"
                  className="mt-1 text-xs text-church-light hover:text-white flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 bg-church-primary">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white font-serif text-xl font-bold">GlobalCathedral Admin</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <AdminNavLinks closeSidebar={closeSidebar} currentPath={location.pathname} />
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-church-primary/20 p-4">
              <div className="flex items-center">
                <div>
                  <UserRound className="h-8 w-8 text-white bg-church-secondary rounded-full p-1" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || "Admin User"}</p>
                  <Button
                    variant="ghost"
                    className="mt-1 text-xs text-church-light hover:text-white flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-1 h-3 w-3" />
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-church-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

interface AdminNavLinksProps {
  closeSidebar: () => void;
  currentPath: string;
}

const AdminNavLinks = ({ closeSidebar, currentPath }: AdminNavLinksProps) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      exact: true
    },
    {
      name: "Members",
      path: "/admin/members",
      icon: <Users className="mr-3 h-5 w-5" />
    },
    {
      name: "Sermons",
      path: "/admin/sermons",
      icon: <BookOpen className="mr-3 h-5 w-5" />
    },
    {
      name: "Employees",
      path: "/admin/employees",
      icon: <UserRound className="mr-3 h-5 w-5" />
    }
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={closeSidebar}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive(item.path, item.exact) 
              ? 'bg-church-secondary text-white' 
              : 'text-white hover:bg-church-secondary/70'
          }`}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
      <div className="pt-4 pb-3">
        <div className="border-t border-church-primary/20"></div>
      </div>
      <Link
        to="/"
        onClick={closeSidebar}
        className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-church-secondary/70"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        View Website
      </Link>
    </>
  );
};

export default Admin;
