import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ProductReviews from '../components/ProductReviews';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to fetch product details');
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/wishlists`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setIsInWishlist(response.data.some(item => item.id === parseInt(id)));
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      // Redirect to login or show login prompt
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`${API_URL}/api/wishlists/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      } else {
        await axios.post(`${API_URL}/api/wishlists`, { productId: id }, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
      }
      setIsInWishlist(!isInWishlist);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-brown"></div>
    </div>
  );
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;
  if (!product) return <div className="text-center text-xl">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {product.image_url ? (
              <img 
                src={`${API_URL}/uploads/${product.image_url}`} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4 text-brand-dark">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p className="text-3xl font-bold mb-6 text-brand-brown">${parseFloat(product.price).toFixed(2)}</p>
            <p className="mb-6 text-gray-700">Category: <span className="font-semibold">{product.category}</span></p>
            <div className="flex space-x-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-brand-brown text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button 
                onClick={handleToggleWishlist}
                className={`px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center ${
                  isInWishlist 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {isInWishlist ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />}
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetails;