import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchResults, setSearchResults] = useState({ products: [], shops: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get('q');
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = async (query) => {
    setLoading(true);
    setError('');
    try {
      const [productsResponse, shopsResponse] = await Promise.all([
        axios.get(`/api/products/search?q=${query}`),
        axios.get(`/api/shops/search?q=${query}`)
      ]);
      setSearchResults({
        products: productsResponse.data,
        shops: shopsResponse.data
      });
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Search Results</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {searchResults.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchResults.products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
                <Link
                  to={`/products/${product.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Shops</h2>
        {searchResults.shops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {searchResults.shops.map((shop) => (
              <div key={shop.id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                <p className="text-gray-600 mb-4">{shop.description}</p>
                <Link
                  to={`/shops/${shop.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Visit Shop
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No shops found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;