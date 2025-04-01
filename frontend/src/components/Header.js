import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CartPopup from './CartPopup';
import Notifications from './Notifications';
import { FaBell, FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, scrolled]);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/unread-count`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  const headerClass = isHomePage
    ? `fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-dark shadow-lg' : 'bg-transparent'}`
    : 'bg-brand-dark shadow-lg';

  return (
    <header className={headerClass}>
      
<div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex-shrink-0">
            <Link to="/" className="text-4xl font-extrabold text-brand-peach hover:text-brand-green transition duration-300">
              LocalMarket
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/products" className="text-white text-lg font-semibold hover:text-brand-green transition duration-300">Products</Link>
            <Link to="/shops" className="text-white text-lg font-semibold hover:text-brand-green transition duration-300">Shops</Link>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white text-xl hover:text-brand-green transition duration-300">
              <FaSearch />
            </button>
            {user ? (
              <>
                <Link to="/profile" className="text-white text-xl hover:text-brand-green transition duration-300"><FaUser /></Link>
                {(user.user_type === 'seller' || user.user_type === 'admin') && (
                  <Link to="/seller-dashboard" className="text-white text-lg font-semibold hover:text-brand-green transition duration-300">Seller Dashboard</Link>
                )}
                {user.user_type === 'admin' && (
                  <Link to="/admin-dashboard" className="text-white text-lg font-semibold hover:text-brand-green transition duration-300">Admin Dashboard</Link>
                )}
                <Link to="/wishlist" className="text-white text-xl hover:text-brand-green transition duration-300"><FaHeart /></Link>
                <button 
                  onClick={handleNotificationClick}
                  className="text-white text-xl hover:text-brand-green transition duration-300 relative"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setShowCartPopup(!showCartPopup)}
                  className="text-white text-xl hover:text-brand-green transition duration-300"
                >
                  <FaShoppingCart />
                </button>
                <button onClick={logout} className="bg-brand-brown text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-opacity-90 transition duration-300">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white text-lg font-semibold hover:text-brand-green transition duration-300">Login</Link>
                <Link to="/register" className="bg-brand-brown text-white px-6 py-3 rounded-full text-lg font-bold hover:bg-opacity-90 transition duration-300">Sign Up</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-brand-peach text-3xl">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isSearchOpen && (
          <div className="py-4">
            <input type="text" placeholder="Search products..." className="w-full p-3 rounded-full bg-white text-brand-dark text-lg" />
          </div>
        )}

        {isMenuOpen && (
          <nav className="md:hidden bg-brand-dark mt-4 rounded-lg shadow-lg">
            <ul className="py-2">
              <li><Link to="/products" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Products</Link></li>
              <li><Link to="/shops" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Shops</Link></li>
              {user ? (
                <>
                  <li><Link to="/profile" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Profile</Link></li>
                  {(user.user_type === 'seller' || user.user_type === 'admin') && (
                    <li><Link to="/seller-dashboard" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Seller Dashboard</Link></li>
                  )}
                  {user.user_type === 'admin' && (
                    <li><Link to="/admin-dashboard" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Admin Dashboard</Link></li>
                  )}
                  <li><Link to="/wishlist" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Wishlist</Link></li>
                  <li><Link to="/cart" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Cart</Link></li>
                  <li><button onClick={logout} className="block w-full text-left px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Logout</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Login</Link></li>
                  <li><Link to="/register" className="block px-6 py-3 text-white text-lg font-semibold hover:bg-brand-brown">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10">
          <Notifications onClose={() => setShowNotifications(false)} />
        </div>
      )}
      
      {showCartPopup && <CartPopup onClose={() => setShowCartPopup(false)} />}
    </header>
  );
};

export default Header;