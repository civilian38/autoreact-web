import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        // You might want to fetch user profile here upon initial load
        // For now, we'll just assume a logged-in state if token exists.
        setUser({ loggedIn: true });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/authentication/token/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      setUser({ loggedIn: true });
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const signup = async (userData) => {
    try {
      await api.post('/authentication/register/', userData);
      alert('Signup successful! Please log in.');
      navigate('/auth/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please check your information.');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/auth/login');
  };

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
