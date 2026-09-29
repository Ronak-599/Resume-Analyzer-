import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('job_portal_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('job_portal_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('job_portal_token', token);
    } else {
      localStorage.removeItem('job_portal_token');
      localStorage.removeItem('job_portal_user');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const data = response.data;
      setToken(data.token);
      const userData = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        companyName: data.companyName,
      };
      setUser(userData);
      localStorage.setItem('job_portal_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/auth/register', userData);
      const data = response.data;
      setToken(data.token);
      const newUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        companyName: data.companyName,
      };
      setUser(newUser);
      localStorage.setItem('job_portal_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('job_portal_token');
    localStorage.removeItem('job_portal_user');
  };

  const demoLogin = async (roleName) => {
    if (roleName === 'CANDIDATE') {
      return await login('ronak@example.com', 'candidate123');
    } else if (roleName === 'RECRUITER') {
      return await login('recruiter@techcorp.com', 'recruiter123');
    } else if (roleName === 'ADMIN') {
      return await login('admin@jobportal.com', 'admin123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
