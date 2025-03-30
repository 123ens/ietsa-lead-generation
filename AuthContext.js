import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { data } = await axios.post('/api/auth/google', {
        token: response.tokenId
      });
      const { token, user } = data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Google login failed');
      throw error;
    }
  };

  const handleFacebookLogin = async (response) => {
    try {
      const { data } = await axios.post('/api/auth/facebook', {
        accessToken: response.accessToken
      });
      const { token, user } = data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Facebook login failed');
      throw error;
    }
  };

  const verifyEmail = async (token) => {
    try {
      await axios.get(`/api/auth/verify-email/${token}`);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Email verification failed');
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset request failed');
      throw error;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await axios.post('/api/auth/reset-password', { token, password });
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    handleGoogleLogin,
    handleFacebookLogin,
    verifyEmail,
    requestPasswordReset,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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

export const GoogleLoginButton = ({ onSuccess, onFailure }) => (
  <GoogleLogin
    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
    buttonText="Login with Google"
    onSuccess={onSuccess}
    onFailure={onFailure}
    cookiePolicy={'single_host_origin'}
    className="google-login-button"
  />
);

export const FacebookLoginButton = ({ onSuccess, onFailure }) => (
  <FacebookLogin
    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
    autoLoad={false}
    fields="name,email,picture"
    callback={onSuccess}
    onFailure={onFailure}
    cssClass="facebook-login-button"
  />
); 