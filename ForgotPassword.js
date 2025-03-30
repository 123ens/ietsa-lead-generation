import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/main.css';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await requestPasswordReset(values.email);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Password reset request failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="auth-container">
      <Paper className="auth-paper">
        <Typography component="h1" variant="h5" className="auth-title">
          Reset Password
        </Typography>
        <Typography variant="body2" className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your password
        </Typography>

        {error && (
          <Alert severity="error" className="alert alert-error">
            {error}
          </Alert>
        )}

        {isSubmitted ? (
          <>
            <Alert severity="success" className="alert alert-success">
              Password reset instructions have been sent to your email address.
            </Alert>
            <Typography variant="body2" color="textSecondary" paragraph>
              Please check your inbox and follow the instructions to reset your password.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              className="form-button"
              fullWidth
            >
              Back to Login
            </Button>
          </>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              className="form-field"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={`form-button ${isLoading ? 'loading-button' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" className="auth-link">
            Back to Login
          </Link>
        </Box>
      </Paper>
    </div>
  );
};

export default ForgotPassword; 
