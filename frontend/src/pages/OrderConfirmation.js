import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaHome, FaBox } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = location.state?.orderId;
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [location.state]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-brown"></div>
    </div>
  );

  if (error || !order) return (
    <div className="max-w-2xl mx-auto mt-12 text-center">
      <p className="text-xl text-red-500 mb-4">{error || 'No order found. Please try again or contact support.'}</p>
      <button onClick={() => navigate('/')} className="bg-brand-brown text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
        <FaHome className="inline-block mr-2" /> Go to Home
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-12 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-brand-dark">Order Confirmation</h1>
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 mb-8 rounded-lg" role="alert">
        <p className="flex items-center font-bold text-xl mb-2">
          <FaCheckCircle className="mr-2" /> Thank you for your order!
        </p>
        <p>Your order has been successfully placed and is being processed.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-brand-dark">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-brand-dark">Shipping Address</h2>
        <p>{order.full_name}</p>
        <p>{order.address}</p>
        <p>{order.city}, {order.zip_code}</p>
        <p>{order.country}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-brand-dark">Order Items</h2>
      {order.items && order.items.map((item, index) => (
        
        <div key={index} className="flex items-center justify-between mb-4 pb-4 border-b">
          <div className="flex items-center">
            {item.image_url ? (
              <img
                src={`${API_URL}/uploads/${item.image_url}`}
                alt={item.product_name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                <FaBox className="text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-semibold">{item.product_name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
          </div>
          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
      <Link to="/" className="bg-brand-brown text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition duration-300 inline-flex items-center">
        <FaHome className="mr-2" /> Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmation;