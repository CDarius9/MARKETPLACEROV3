import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ShopManagement = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [logo, setLogo] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/seller/shop`, {
        headers: { 'x-auth-token': token }
      });
      setShop(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching shop details:', err);
      setError('Failed to fetch shop details');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    setCoverPhoto(file);
    setPreviewCover(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    if (logo) formDataToSend.append('logo', logo);
    if (coverPhoto) formDataToSend.append('coverPhoto', coverPhoto);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/seller/shop`, formDataToSend, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditMode(false);
      fetchShopDetails();
    } catch (err) {
      console.error('Error updating shop:', err);
      setError('Failed to update shop');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!shop) return <div>No shop found. Please contact support.</div>;

  const coverPhotoUrl = previewCover || (shop.cover_photo_url ? `${API_URL}/uploads/${shop.cover_photo_url}` : null);
  const logoUrl = previewLogo || (shop.logo_url ? `${API_URL}/uploads/${shop.logo_url}` : null);

 
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">{editMode ? 'Edit Your Shop' : 'Your Shop'}</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64">
          {coverPhotoUrl && (
            <img 
              src={coverPhotoUrl}
              alt="Shop Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-4">
            {logoUrl && (
              <img 
                src={logoUrl}
                alt="Shop Logo" 
                className="w-24 h-24 object-cover rounded-full border-4 border-white"
              />
            )}
          </div>
        </div>
        <div className="p-6">
          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Shop Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label htmlFor="logo" className="block mb-1 font-medium">Logo</label>
                <input
                  type="file"
                  id="logo"
                  onChange={handleLogoUpload}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="coverPhoto" className="block mb-1 font-medium">Cover Photo</label>
                <input
                  type="file"
                  id="coverPhoto"
                  onChange={handleCoverPhotoUpload}
                  className="w-full"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-brand-brown text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-2">{shop.name}</h2>
              <p className="text-gray-600 mb-4">{shop.description}</p>
              <button 
                onClick={() => setEditMode(true)} 
                className="bg-brand-brown text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
              >
                Edit Shop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;