import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaShieldAlt } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = { username, email, password, userType };
      if (userType === 'admin') {
        userData.adminSecretKey = adminSecretKey;
      }
      const user = await register(userData);
      console.log('Registration successful, user:', user);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of local sellers and buyers
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-brown/20"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-brown/20"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-brown/20"
            />
          </div>

          <div className="relative">
            <FaUserTag className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-brown/20 appearance-none"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {userType === 'admin' && (
            <div className="relative">
              <FaShieldAlt className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="adminSecretKey"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                required
                placeholder="Admin Secret Key"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-brown/20"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-brown text-white py-3 rounded-xl hover:bg-opacity-90 transition-colors font-medium"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-brown hover:text-brand-brown/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;