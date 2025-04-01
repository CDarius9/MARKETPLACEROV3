import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Orders from '../components/Orders';
import { FaStar, FaEnvelope, FaUser, FaUserTag, FaComment, 
         FaShoppingBag, FaHeart, FaEdit, FaCog, FaMapMarkerAlt,
         FaCalendarAlt, FaBox } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
    fetchUserReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/user`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching user reviews:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
      setError('Failed to fetch user reviews');
    }
  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data available</div>;

  
  const stats = [
    { title: 'Total Orders', value: '24', icon: FaShoppingBag, color: 'bg-blue-500' },
    { title: 'Reviews Given', value: reviews.length, icon: FaStar, color: 'bg-yellow-500' },
    { title: 'Wishlist Items', value: '12', icon: FaHeart, color: 'bg-red-500' },
    { title: 'Active Orders', value: '2', icon: FaBox, color: 'bg-green-500' },
  ];


  const StarRating = ({ rating }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((star, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="relative w-20 h-20">
          <div className="absolute border-4 border-brand-green/20 rounded-full w-full h-full animate-spin" />
          <div className="absolute border-4 border-t-brand-green rounded-full w-full h-full animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center py-12">No profile data available</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12">
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-brown to-brand-dark rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <FaEdit className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <FaEnvelope className="opacity-75" /> {profile.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaUserTag className="opacity-75" /> {profile.user_type}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="opacity-75" /> New York, USA
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="opacity-75" /> Joined 2023
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link to="/messages" 
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                    <FaEnvelope />
                    Messages
                  </Link>
                  <Link to="/settings"
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2">
                    <FaCog />
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto hide-scrollbar">
              {[
                { id: 'overview', label: 'Overview', icon: FaUser },
                { id: 'orders', label: 'Orders', icon: FaShoppingBag },
                { id: 'reviews', label: 'Reviews', icon: FaStar },
                { id: 'wishlist', label: 'Wishlist', icon: FaHeart },
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
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  {/* Add recent activity content */}
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                  {/* Add account details content */}
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && <Orders />}
            
            {activeTab === 'reviews' && (
              <div className="grid md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        {review.product_image ? (
                          <img
                            src={`${API_URL}/uploads/${review.product_image}`}
                            alt={review.product_name}
                            className="w-20 h-20 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'path/to/placeholder-image.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h4 className="font-medium text-gray-900">{review.product_name}</h4>
                            <StarRating rating={review.rating} />
                          </div>
                          <p className="text-gray-600 mb-2">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            {review.edited && <span className="italic">(Edited)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-gray-500 text-center py-8">
                Wishlist feature coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;