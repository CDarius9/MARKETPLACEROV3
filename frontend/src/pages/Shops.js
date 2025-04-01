import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaStore, FaMapMarkerAlt, FaStar, FaHeart, 
         FaSearch, FaLeaf, FaShoppingBag, FaRegClock } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/shops`);
        setShops(response.data.shops || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to fetch shops');
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const categories = [
    { id: 'all', name: 'All Shops', icon: FaStore },
    { id: 'featured', name: 'Featured', icon: FaStar },
    { id: 'new', name: 'New Arrivals', icon: FaLeaf },
    { id: 'trending', name: 'Trending', icon: FaShoppingBag }
  ];

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || shop.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-brown via-brand-dark to-brand-brown overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-lg bg-white/20"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `float ${Math.random() * 10 + 10}s infinite linear`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Amazing Local Shops
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Support your community by shopping from talented local artisans and entrepreneurs
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for shops..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md rounded-xl text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,146.22,85.35,321.39,56.44Z" />
          </svg>
        </div>
      </div>

{/* Categories */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => setSelectedCategory(category.id)}
        className={`
          px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap
          ${selectedCategory === category.id 
            ? 'bg-brand-brown text-white transform scale-105 shadow-lg' 
            : 'bg-white text-brand-dark hover:bg-brand-brown/10 shadow-md border border-gray-200'}
        `}
      >
        <category.icon className={`text-lg ${
          selectedCategory === category.id ? 'text-white' : 'text-brand-brown'
        }`} />
        <span className="font-medium">{category.name}</span>
      </button>
    ))}
  </div>
</div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-brand-green/20 rounded-full animate-spin" />
              <div className="absolute inset-0 border-4 border-t-brand-green rounded-full animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShops.map((shop) => (
              <div key={shop.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-48">
                  {shop.cover_photo_url ? (
                    <img
                      src={`${API_URL}/uploads/${shop.cover_photo_url}`}
                      alt={`${shop.name} cover`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-brown/20 to-brand-peach/20 flex items-center justify-center">
                      <FaStore className="text-5xl text-brand-brown/40" />
                    </div>
                  )}
                  
                  {/* Shop Logo */}
                  <div className="absolute -bottom-10 left-6">
                    {shop.logo_url ? (
                      <img
                        src={`${API_URL}/uploads/${shop.logo_url}`}
                        alt={`${shop.name} logo`}
                        className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-brand-brown flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                        {shop.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-brand-peach hover:scale-110 transition-transform">
                      <FaHeart />
                    </button>
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="text-brand-dark font-medium">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-12">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-brand-dark">{shop.name}</h2>
                    <span className="px-3 py-1 bg-brand-green/10 rounded-full text-brand-green text-sm">
                      Open
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <FaMapMarkerAlt className="text-brand-brown" />
                    <span>Local Artisan</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <FaRegClock className="text-brand-brown" />
                    <span>Quick Delivery</span>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2">{shop.description}</p>

                  <Link
                    to={`/shops/${shop.id}`}
                    className="block w-full bg-brand-brown text-white text-center py-3 rounded-xl hover:bg-brand-green transition-colors duration-300"
                  >
                    Visit Shop
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Shops;