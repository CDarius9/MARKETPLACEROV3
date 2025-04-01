import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-peach">About LocalMarket</h3>
            <p className="text-sm">Connecting local producers with conscious consumers, fostering community, and promoting sustainable shopping.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-peach">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-green transition duration-300">Home</Link></li>
              <li><Link to="/products" className="hover:text-brand-green transition duration-300">Products</Link></li>
              <li><Link to="/shops" className="hover:text-brand-green transition duration-300">Shops</Link></li>
              <li><Link to="/about" className="hover:text-brand-green transition duration-300">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-green transition duration-300">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-peach">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-brand-green transition duration-300">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-green transition duration-300">Shipping & Returns</Link></li>
              <li><Link to="/terms" className="hover:text-brand-green transition duration-300">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-green transition duration-300">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-brand-peach">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-brand-green transition duration-300"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-brand-green transition duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-brand-green transition duration-300"><FaInstagram size={24} /></a>
            </div>
            <div className="flex items-center">
              <FaEnvelope size={20} className="mr-2" />
              <span className="text-sm">info@localmarket.com</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; 2024 LocalMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;