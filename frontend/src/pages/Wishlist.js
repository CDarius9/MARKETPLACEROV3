import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaHeart, FaShoppingCart, FaImage } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

 useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlists`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      console.log('Wishlist items:', response.data);
      setWishlistItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to fetch wishlist');
      setLoading(false);
    }
  };

  fetchWishlist();
}, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlists`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setWishlistItems(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to fetch wishlist');
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlists/${productId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchWishlist();
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally, you can remove the item from the wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  if (loading) return <div>Loading wishlist...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-brand-dark">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Your wishlist is empty.</p>
          <Link to="/products" className="mt-4 inline-block bg-brand-brown text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/products/${item.id}`}>
                {item.image_url ? (
                  <img
                    src={`${API_URL}/uploads/${item.image_url}`}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <FaImage className="text-gray-400 text-4xl" />
                  </div>
                )}
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-2 h-12 overflow-hidden">{item.description}</p>
                <p className="text-2xl font-bold mb-4 text-brand-brown">${parseFloat(item.price).toFixed(2)}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-brand-green text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300 flex items-center"
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;