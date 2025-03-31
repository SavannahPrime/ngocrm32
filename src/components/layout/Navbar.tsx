
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-church-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-serif text-2xl font-bold">GlobalCathedral</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-church-primary/80 text-white">
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-3 py-2 text-white flex items-center hover:bg-church-primary/80">
                  About <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="w-full">Our Story</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/beliefs" className="w-full">Our Beliefs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/leadership" className="w-full">Leadership</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/sermons" className="px-3 py-2 rounded-md hover:bg-church-primary/80 text-white">
              Sermons
            </Link>
            <Link to="/events" className="px-3 py-2 rounded-md hover:bg-church-primary/80 text-white">
              Events
            </Link>
            <Link to="/blog" className="px-3 py-2 rounded-md hover:bg-church-primary/80 text-white">
              Blog
            </Link>
            <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-church-primary/80 text-white">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/register">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-church-primary">
                Join Us
              </Button>
            </Link>
            <Link to="/donate">
              <Button className="bg-church-accent text-church-dark hover:bg-church-accent/90">
                Donate
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/admin" className="px-3 py-2 rounded-md bg-church-secondary hover:bg-church-secondary/90 text-white">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-church-primary/80"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Our Story
          </Link>
          <Link
            to="/beliefs"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Our Beliefs
          </Link>
          <Link
            to="/leadership"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Leadership
          </Link>
          <Link
            to="/sermons"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Sermons
          </Link>
          <Link
            to="/events"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Events
          </Link>
          <Link
            to="/blog"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md hover:bg-church-primary/80 text-white"
            onClick={toggleMenu}
          >
            Contact
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 rounded-md bg-white text-church-primary"
            onClick={toggleMenu}
          >
            Join Us
          </Link>
          <Link
            to="/donate"
            className="block px-3 py-2 rounded-md bg-church-accent text-church-dark"
            onClick={toggleMenu}
          >
            Donate
          </Link>
          {isAuthenticated && (
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md bg-church-secondary text-white"
              onClick={toggleMenu}
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
