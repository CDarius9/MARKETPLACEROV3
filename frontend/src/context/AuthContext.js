import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/api/users/profile`, {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || 'An error occurred during login';
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || 'An error occurred during registration';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};