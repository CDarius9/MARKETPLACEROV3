import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/seller/products`, {
        headers: { 'x-auth-token': token }
      });
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/categories`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('stock', newProduct.stock);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/seller/products`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '' });
      setImages([]);
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.error || 'Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('description', editingProduct.description);
      formData.append('price', editingProduct.price);
      formData.append('category', editingProduct.category);
      formData.append('stock', editingProduct.stock);
      
      if (editingProduct.newImage) {
        formData.append('image', editingProduct.newImage);
      }

      console.log('Updating product:', id);
      console.log('Form data:', Object.fromEntries(formData));

      const response = await axios.put(`${API_URL}/api/seller/products/${id}`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Product update response:', response.data);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/seller/products/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
    }
  };

  const handleImageUpload = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleImageChange = (e) => {
    setEditingProduct({ ...editingProduct, newImage: e.target.files[0] });
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      stock: product.stock || 0  // Ensure stock is always a number
    });
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Products</h2>
      
      <form onSubmit={handleAddProduct} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
            required
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-brand-brown"
          required
        ></textarea>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="mt-4"
        />
        <button type="submit" className="mt-6 bg-brand-brown text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300">
          Add Product
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {editingProduct && editingProduct.id === product.id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateProduct(product.id); }} className="p-4">
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 mb-2 border rounded"
                  placeholder="Product Name"
                />
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 mb-2 border rounded"
                  placeholder="Description"
                ></textarea>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="w-full px-3 py-2 mb-2 border rounded"
                  placeholder="Price"
                />
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className="w-full px-3 py-2 mb-2 border rounded"
                  placeholder="Stock"
                />
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 mb-2 border rounded"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full mb-2"
                />
                <div className="flex justify-between">
                  <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300">
                    Save
                  </button>
                  <button onClick={() => setEditingProduct(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {product.image_url && (
                  <img 
                    src={`${API_URL}/uploads/${product.image_url}`} 
                    alt={product.name} 
                    className="w-full h-48 object-cover" 
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-lg font-bold mb-2">${parseFloat(product.price).toFixed(2)}</p>
                  <p className="mb-2">Category: {product.category}</p>
                  <p className="mb-4">Stock: {product.stock}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;