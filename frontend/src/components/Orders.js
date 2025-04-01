import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/api/orders/${orderId}/cancel`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      console.log('Cancel response:', response.data);
      fetchOrders(); // Refresh orders after cancellation
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleReturn = async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/api/orders/${orderId}/return`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      console.log('Return response:', response.data);
      fetchOrders(); // Refresh orders after requesting return
    } catch (err) {
      console.error('Error requesting return:', err);
      setError('Failed to request return: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Amount:</strong> ${order.total_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              {order.status === 'pending' && (
                <button
                  onClick={() => handleCancel(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 mr-2"
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'delivered' && (
                <button
                  onClick={() => handleReturn(order.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                >
                  Request Return
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;