import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FaShoppingBag, FaCreditCard } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getCartTotal(),
        shippingAddress: formData
      };

      const response = await axios.post(`${API_URL}/api/orders`, orderData, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });

      clearCart();
      navigate('/order-confirmation', { state: { orderId: response.data.orderId } });
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-8 text-brand-dark">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FaShoppingBag className="mr-2" /> Order Summary</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center">
                  {item.image_url ? (
                    <img
                      src={`${API_URL}/uploads/${item.image_url}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-xl font-bold mt-4 pt-4 border-t">
              Total: ${getCartTotal().toFixed(2)}
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FaCreditCard className="mr-2" /> Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label htmlFor={key} className="block mb-1 font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-brand-brown text-white py-3 rounded-full hover:bg-opacity-90 transition duration-300 text-lg font-semibold"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;