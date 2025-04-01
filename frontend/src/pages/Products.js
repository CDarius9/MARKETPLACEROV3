import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { FaSearch, FaTimes, FaShoppingCart, FaFilter, 
         FaHeart, FaStar, FaLeaf, FaGem, FaPalette } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Products = () => {
  const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const { addToCart } = useContext(CartContext);

const [filters, setFilters] = useState({
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
});
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: {
          ...filters,
          page: currentPage,
          limit: 9
        }
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  
 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header with Dynamic Background */}
      <div className="relative bg-gradient-to-r from-brand-brown via-brand-dark to-brand-brown overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated shapes background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s infinite linear`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-white/80">
              From local artisans crafted with love ❤️
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="What are you looking for?"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md rounded-xl text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              </div>
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="px-6 py-2 bg-brand-green text-white rounded-xl hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
              >
                <FaFilter /> Filters
              </button>
            </div>

            {/* Expandable Filters */}
            <div className={`mt-4 transition-all duration-300 ${isFilterVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4 pointer-events-none'}`}>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="w-full p-3 bg-white/20 rounded-xl text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min Price"
                      className="w-full p-3 bg-white/20 rounded-xl text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green placeholder-white/60"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max Price"
                      className="w-full p-3 bg-white/20 rounded-xl text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-green placeholder-white/60"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap
                ${filters.category === category.id ? 
                  'bg-brand-brown text-white transform scale-105' : 
                  'bg-white text-brand-dark hover:bg-brand-brown/10'}`}
            >
              {category.id % 3 === 0 ? <FaGem className="text-brand-peach" /> :
               category.id % 2 === 0 ? <FaLeaf className="text-brand-green" /> :
               <FaPalette className="text-brand-brown" />}
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
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
            {products.map((product) => (
              <div key={product.id} 
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Link to={`/products/${product.id}`}>
                  <div className="relative overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={`${API_URL}/uploads/${product.image_url}`} 
                        alt={product.name} 
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                        <FaLeaf className="text-4xl text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-brand-brown text-sm font-medium">
                        {product.category_name}
                      </span>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-brand-peach hover:scale-110 transition-transform">
                        <FaHeart />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-brand-dark mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-brand-peach w-4 h-4" />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">(52)</span>
                      </div>
                      <p className="text-2xl font-bold text-brand-brown">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-brand-brown text-white py-3 rounded-xl flex items-center justify-center gap-2
                               group-hover:bg-brand-green transition-colors duration-300"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="inline-flex gap-2 p-2 bg-white rounded-2xl shadow-lg">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                    ${currentPage === page 
                      ? 'bg-brand-brown text-white transform scale-105' 
                      : 'text-brand-dark hover:bg-brand-brown/10'}`}
                >
                  {page}
                </button>
              ))}
            </div>
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

export default Products;
