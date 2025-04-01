import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaTags, FaUsers, FaStore, 
         FaShoppingCart, FaChartLine, FaCog, FaSearch,
         FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.user_type !== 'admin') {
      navigate('/');
    } else {
      fetchCategories();
    }
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/categories`, {
        headers: { 'x-auth-token': token }
      });
      setCategories(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/admin/categories`, { name: newCategory }, {
        headers: { 'x-auth-token': token }
      });
      setNewCategory('');
      setSuccess('Category added successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const updateCategory = async (id, name) => {
    if (!name.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/admin/categories/${id}`, { name }, {
        headers: { 'x-auth-token': token }
      });
      setEditingCategory(null);
      setSuccess('Category updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/categories/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setSuccess('Category deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: 'Total Categories', value: categories.length, icon: FaTags, color: 'bg-purple-500' },
    { title: 'Active Users', value: '1.2k', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Total Stores', value: '156', icon: FaStore, color: 'bg-green-500' },
    { title: 'Total Orders', value: '2.4k', icon: FaShoppingCart, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <FaCog className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: 'categories', label: 'Categories', icon: FaTags },
                { id: 'users', label: 'Users', icon: FaUsers },
                { id: 'stores', label: 'Stores', icon: FaStore },
                { id: 'orders', label: 'Orders', icon: FaShoppingCart },
                { id: 'analytics', label: 'Analytics', icon: FaChartLine },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2
                    ${activeTab === tab.id 
                      ? 'border-brand-brown text-brand-brown' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Notifications */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700">
                <FaExclamationCircle />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center gap-3 text-green-700">
                <FaCheckCircle />
                {success}
              </div>
            )}

            {activeTab === 'categories' && (
              <>
                {/* Search and Add */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-brown/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-brown/20"
                    />
                    <button
                      onClick={addCategory}
                      className="px-4 py-2 bg-brand-brown text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    >
                      <FaPlus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="bg-gray-50 rounded-xl">
                  {filteredCategories.map((category) => (
                    <div 
                      key={category.id} 
                      className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0"
                    >
                      {editingCategory === category.id ? (
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => setCategories(categories.map(c => 
                            c.id === category.id ? { ...c, name: e.target.value } : c
                          ))}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 mr-4 focus:outline-none focus:ring-2 focus:ring-brand-brown/20"
                        />
                      ) : (
                        <span className="text-gray-700">{category.name}</span>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {editingCategory === category.id ? (
                          <button
                            onClick={() => updateCategory(category.id, category.name)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FaCheckCircle className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingCategory(category.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No categories found
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab !== 'categories' && (
              <div className="text-center py-12 text-gray-500">
                This feature is coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;