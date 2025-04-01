import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHandsHelping, FaShoppingBasket, FaStore, FaPalette, 
         FaCarrot, FaGem, FaTshirt, FaHome, FaBook, FaArrowRight, 
         FaHeart, FaStar, FaShoppingCart } from 'react-icons/fa';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveCategory(prev => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Artisan Crafts', icon: FaPalette, color: 'bg-brand-peach', lightColor: 'bg-brand-peach/20', textColor: 'text-brand-peach' },
    { name: 'Fresh Produce', icon: FaCarrot, color: 'bg-brand-green', lightColor: 'bg-brand-green/20', textColor: 'text-brand-green' },
    { name: 'Jewelry', icon: FaGem, color: 'bg-brand-brown', lightColor: 'bg-brand-brown/20', textColor: 'text-brand-brown' },
    { name: 'Clothing', icon: FaTshirt, color: 'bg-brand-green', lightColor: 'bg-brand-green/20', textColor: 'text-brand-green' },
    { name: 'Home Decor', icon: FaHome, color: 'bg-brand-peach', lightColor: 'bg-brand-peach/20', textColor: 'text-brand-peach' },
    { name: 'Books & Prints', icon: FaBook, color: 'bg-brand-brown', lightColor: 'bg-brand-brown/20', textColor: 'text-brand-brown' }
  ];

  return (
    <div className="w-full">
      {/* Hero Section with Enhanced Background */}
      <section className="relative min-h-screen bg-gradient-to-b from-brand-dark via-brand-brown to-brand-dark overflow-hidden">
        {/* Enhanced Animated background grid */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-2 opacity-30">
          {[...Array(64)].map((_, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-white/30 to-transparent rounded-lg backdrop-blur-sm transition-all duration-1000 shadow-lg"
              style={{
                transform: `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 30}deg)`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `pulse ${Math.random() * 3 + 2}s infinite`
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-brand-peach/20 to-brand-green/20 rounded-lg mix-blend-overlay"
                style={{
                  animation: `glow ${Math.random() * 4 + 3}s infinite alternate`
                }}
              />
            </div>
          ))}
        </div>

        {/* Overlay gradient for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/50 to-brand-dark/80" />

        {/* Additional decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-peach/20 via-transparent to-transparent opacity-40" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-green/20 via-transparent to-transparent opacity-40" />
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left side - Text content */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Discover 
                  <span className="relative inline-block mx-3 px-4">
                    <span className="relative z-10 text-brand-dark">Local</span>
                    <div className={`absolute inset-0 ${categories[activeCategory].color} rounded-lg transform -rotate-2`} />
                  </span>
                  <br />
                  Treasures
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Connect with talented artisans and discover unique products that tell a story.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link to="/explore" className="group relative overflow-hidden px-8 py-4 rounded-xl bg-brand-green text-white font-semibold text-lg transition-transform hover:scale-105">
                    Start Exploring
                    <span className="absolute inset-0 w-full h-full bg-white/20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Link>
                  <Link to="/register" className="group px-8 py-4 rounded-xl border-2 border-brand-peach text-white font-semibold text-lg hover:bg-brand-peach/10 transition-colors">
                    Become a Seller
                  </Link>
                </div>
              </div>

              {/* Right side - Featured categories preview */}
              <div className="flex-1 grid grid-cols-2 gap-4 max-w-lg">
                {categories.slice(0, 4).map((category, index) => (
                  <div
                    key={index}
                    className={`${category.lightColor} ${category.textColor} p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <category.icon className="text-3xl mb-3" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats section */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '2K+', label: 'Active Artisans', icon: FaStore },
                { number: '15K+', label: 'Happy Customers', icon: FaHeart },
                { number: '50K+', label: 'Products', icon: FaShoppingCart },
                { number: '4.9', label: 'Average Rating', icon: FaStar },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-peach/20 text-brand-peach mb-4">
                    <stat.icon className="text-xl" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,146.22,85.35,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-green/10 text-brand-green font-medium mb-4">
              Featured Products
            </span>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">
              Trending This Week
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional local products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaStore className="text-4xl" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-brand-dark mb-1">Product Title</h3>
                      <p className="text-sm text-gray-500">By Local Artisan</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-sm">$99</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-brand-peach text-sm" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">5.0</span>
                    </div>
                    <button className="text-brand-brown hover:text-brand-brown/80 transition-colors">
                      <FaHeart className="text-xl" />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-brand-dark/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to="/product"
                    className="px-6 py-3 bg-brand-green text-white rounded-full font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-brand-brown/10 text-brand-brown font-medium mb-4">
              How It Works
            </span>
            <h2 className="text-4xl font-bold text-brand-dark mb-4">
              Simple & Seamless Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: FaStore,
                title: "Find Local Sellers",
                description: "Browse through our curated selection of local artisans and their unique products"
              },
              {
                icon: FaShoppingCart,
                title: "Make Your Purchase",
                description: "Securely purchase your favorite items directly from the creators"
              },
              {
                icon: FaHandsHelping,
                title: "Support Community",
                description: "Every purchase supports local businesses and strengthens our community"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="relative z-10 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-brand-peach/10 flex items-center justify-center mb-6">
                    <step.icon className="text-2xl text-brand-peach" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-dark mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-1/3 h-0.5 bg-gray-200 transform translate-x-1/2">
                    <div className="absolute right-0 top-1/2 w-3 h-3 rounded-full bg-brand-brown transform -translate-y-1/2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="relative py-20 bg-gradient-to-r from-brand-brown to-brand-dark text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-70" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Whether you're a creator or a conscious shopper, be part of something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 rounded-xl bg-brand-green text-white font-semibold text-lg hover:bg-brand-green/90 transition-colors"
            >
              Start Selling <FaStore className="ml-2" />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-brand-peach text-white font-semibold text-lg hover:bg-brand-peach/10 transition-colors"
            >
              Start Shopping <FaShoppingBasket className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Home;