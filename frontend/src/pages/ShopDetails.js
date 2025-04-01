import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import MessageButton from '../components/MessageButton';
import { FaStore, FaSpinner, FaShoppingCart } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const [shopResponse, productsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/shops/${id}`),
          axios.get(`${API_URL}/api/products?shopId=${id}`)
        ]);
        
        setShop(shopResponse.data);
        setProducts(Array.isArray(productsResponse.data.products) ? productsResponse.data.products : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shop details:', err);
        setError('Failed to fetch shop details');
        setLoading(false);
      }
    };
  
    fetchShopDetails();
  }, [id]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <FaSpinner className="animate-spin text-4xl text-brand-brown" />
    </div>
  );
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;
  if (!shop) return <div className="text-center text-xl">Shop not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative h-96">
        {shop.cover_photo_url ? (
          <img 
            src={`${API_URL}/uploads/${shop.cover_photo_url}`} 
            alt={`${shop.name} cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <FaStore className="text-6xl text-gray-500" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-8">
          <div className="flex items-center">
            {shop.logo_url ? (
              <img 
                src={`${API_URL}/uploads/${shop.logo_url}`} 
                alt={`${shop.name} logo`} 
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg mr-6" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-brand-brown flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg mr-6">
                {shop.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{shop.name}</h1>
              <p className="text-xl text-gray-200 mb-4">{shop.description}</p>
              <MessageButton sellerId={shop.owner_id} sellerName={shop.name} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-brand-dark">Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products available for this shop.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <Link to={`/products/${product.id}`}>
                  {product.image_url ? (
                    <img 
                      src={`${API_URL}/uploads/${product.image_url}`} 
                      alt={product.name} 
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <FaStore className="text-4xl text-gray-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-brand-dark">{product.name}</h3>
                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">{product.description}</p>
                    <p className="text-2xl font-bold text-brand-brown mb-4">${parseFloat(product.price).toFixed(2)}</p>
                  </div>
                </Link>
                <div className="px-6 pb-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;