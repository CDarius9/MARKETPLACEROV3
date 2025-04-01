import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import SellerProducts from '../components/SellerProducts';
import SellerOrders from '../components/SellerOrders';
import ShopManagement from '../components/ShopManagement';
import { FaStore, FaBox, FaShoppingCart, FaEnvelope, 
         FaChartLine, FaDollarSign, FaUsers, FaBoxOpen,
         FaBell, FaSearch, FaCog } from 'react-icons/fa';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('shop');
  const [loading, setLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="relative w-24 h-24">
          <div className="absolute border-4 border-brand-green/20 rounded-full w-full h-full animate-spin" />
          <div className="absolute border-4 border-t-brand-green rounded-full w-full h-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (user.user_type !== 'seller' && user.user_type !== 'admin') return <Navigate to="/" />;

  const tabs = [
    { id: 'shop', name: 'Shop Management', icon: FaStore, count: null },
    { id: 'products', name: 'Products', icon: FaBox, count: 24 },
    { id: 'orders', name: 'Orders', icon: FaShoppingCart, count: 5 },
    { id: 'analytics', name: 'Analytics', icon: FaChartLine, count: null },
    { id: 'messages', name: 'Messages', icon: FaEnvelope, count: 3 },
    { id: 'settings', name: 'Settings', icon: FaCog, count: null },
  ];

  const stats = [
    { title: 'Total Sales', value: '$4,289', icon: FaDollarSign, trend: '+12%', color: 'bg-green-500' },
    { title: 'Active Products', value: '48', icon: FaBoxOpen, trend: '+3', color: 'bg-blue-500' },
    { title: 'Total Customers', value: '156', icon: FaUsers, trend: '+8%', color: 'bg-purple-500' },
    { title: 'Pending Orders', value: '5', icon: FaShoppingCart, trend: '-2', color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isNavCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className="sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-brown flex items-center justify-center text-white font-bold">
                {user.shop_name?.[0] || 'S'}
              </div>
              {!isNavCollapsed && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900 truncate">
                    {user.shop_name || 'Your Shop Name'}
                  </h2>
                  <p className="text-xs text-gray-500">Seller Dashboard</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200
                    ${activeTab === tab.id 
                      ? 'bg-brand-brown text-white' 
                      : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                  {!isNavCollapsed && (
                    <span className="flex-1 text-left text-sm">{tab.name}</span>
                  )}
                  {!isNavCollapsed && tab.count && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-white text-brand-brown' : 'bg-brand-brown/10 text-brand-brown'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-brand-green/20"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <FaBell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-brown/10 flex items-center justify-center text-brand-brown">
                  {user.name?.[0] || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} text-white flex items-center justify-center`}>
                    <stat.icon className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <span className={`text-sm ${
                        stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'shop' && <ShopManagement />}
            {activeTab === 'products' && <SellerProducts />}
            {activeTab === 'orders' && <SellerOrders />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;