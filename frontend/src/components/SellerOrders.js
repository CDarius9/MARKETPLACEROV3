import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/seller/orders`, {
        headers: { 'x-auth-token': token }
      });
      console.log('Fetched orders:', response.data.orders);
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      const response = await axios.put(
        `${API_URL}/api/seller/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      console.log('Order status update response:', response.data);
      fetchOrders(); // Refresh the orders list
    } catch (err) {
      console.error('Error updating order status:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      setError(`Failed to update order status: ${err.response?.data?.error || err.message}`);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/seller/debug/all-orders`, {
        headers: { 'x-auth-token': token }
      });
      console.log('All orders in database:', response.data.orders);
    } catch (err) {
      console.error('Error fetching all orders:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-200 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-200 text-purple-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="mb-2">Total Amount: ${order.total_amount.toFixed(2)}</p>
              <p className="mb-4">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
              
              <h4 className="text-lg font-semibold mb-2">Order Items:</h4>
              <ul className="list-disc list-inside mb-4 space-y-1">
                {order.items && order.items.map((item, index) => (
                  <li key={index}>
                    {item.product_name} - Quantity: {item.quantity}, Price: ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                >
                  Mark as Processing
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                >
                  Mark as Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;