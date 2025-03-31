
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-church-dark text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">GlobalCathedral</h3>
            <p className="mb-4">
              Transforming lives through the power of God's Word and building a
              community of faith, hope, and love.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-church-accent" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-church-accent" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-church-accent" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-church-accent" aria-label="Youtube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-church-accent">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-church-accent">About Us</Link>
              </li>
              <li>
                <Link to="/sermons" className="hover:text-church-accent">Sermons</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-church-accent">Events</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-church-accent">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-church-accent">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Service Times</h3>
            <ul className="space-y-2">
              <li className="flex flex-col">
                <span className="font-semibold">Sunday Service</span>
                <span>10:00 AM - 11:30 AM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Wednesday Bible Study</span>
                <span>7:00 PM - 8:30 PM</span>
              </li>
              <li className="flex flex-col">
                <span className="font-semibold">Youth Group</span>
                <span>Friday, 6:30 PM - 8:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5" />
                <span>123 Faith Street, Sanctuary City, SC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>info@globalcathedral.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} GlobalCathedral Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
