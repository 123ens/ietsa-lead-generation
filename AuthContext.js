import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/google', {
        credential: credentialResponse.credential
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Google login failed');
      throw error;
    }
  };

  const handleFacebookLogin = async (response) => {
    try {
      setError(null);
      const { accessToken, userID } = response;
      const authResponse = await axios.post('/api/auth/facebook', {
        accessToken,
        userID
      });
      const { token, user } = authResponse.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Facebook login failed');
      throw error;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      await axios.post('/api/auth/forgot-password', { email });
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset request failed');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      await axios.post('/api/auth/reset-password', { token, newPassword });
    } catch (error) {
      setError(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
  };

  const verifyEmail = async (token) => {
    try {
      setError(null);
      await axios.post('/api/auth/verify-email', { token });
    } catch (error) {
      setError(error.response?.data?.message || 'Email verification failed');
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setError(null);
      await axios.post('/api/auth/resend-verification');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend verification email');
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
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onFailure}
      useOneTap
      theme="filled_blue"
      size="large"
      width="100%"
    />
  );
};

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
