
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ngo-dark text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* NGO Info */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">HopeHarbor</h3>
            <p className="mb-4">
              Empowering communities through sustainable development and education.
              Together, we can build a better future for all.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-ngo-accent" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-ngo-accent" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-ngo-accent" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-ngo-accent" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-ngo-accent">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-ngo-accent">About Us</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-ngo-accent">Projects</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-ngo-accent">Events</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-ngo-accent">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ngo-accent">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Our Programs</h3>
            <ul className="space-y-2">
              <li className="flex flex-col">
                <span className="font-semibold">Clean Water Initiative</span>
                <span>Providing access to clean water</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Education For All</span>
                <span>Building schools and training teachers</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Community Development</span>
                <span>Supporting sustainable local economies</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5" />
                <span>123 Impact Avenue, Changemaker City, CM 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>info@hopeharbor.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} HopeHarbor NGO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
