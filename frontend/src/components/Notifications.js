import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaBell, FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNotifications(response.data);
      setLoading(false);
      markAllAsRead();
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/api/notifications/mark-all-read`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  if (!user) return null;
  if (loading) return <div className="p-4">Loading notifications...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  
  return (
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold text-brand-dark flex items-center">
          <FaBell className="mr-2 text-brand-brown" /> Notifications
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No notifications</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map(notif => (
              <li key={notif.id} className="p-4 hover:bg-gray-50 transition duration-150">
                <p className="font-semibold text-brand-dark">{notif.type}</p>
                <p className="text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;