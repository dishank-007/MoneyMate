import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext();

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('moneymate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('moneymate_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('moneymate_token');
      if (storedToken) {
        try {
          const res = await userService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('moneymate_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Failed to verify existing session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('moneymate_token', jwtToken);
      localStorage.setItem('moneymate_user', JSON.stringify(userData));
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { token: jwtToken, user: newUser } = res.data;
      setToken(jwtToken);
      setUser(newUser);
      localStorage.setItem('moneymate_token', jwtToken);
      localStorage.setItem('moneymate_user', JSON.stringify(newUser));
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('moneymate_token');
    localStorage.removeItem('moneymate_user');
  };

  const updateProfile = async (profileData) => {
    const res = await userService.updateProfile(profileData);
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('moneymate_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Profile update failed');
  };

  const currency = user?.currency || 'INR';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '₹';

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return `${currencySymbol} 0.00`;
    const num = Number(amount);
    return `${currencySymbol} ${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    currency,
    currencySymbol,
    formatCurrency,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
