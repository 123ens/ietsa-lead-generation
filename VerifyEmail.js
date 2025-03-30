import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { resendVerificationEmail, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await resendVerificationEmail();
      setCountdown(60);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Verify Your Email
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" color="textSecondary" paragraph>
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </Typography>

          <Typography variant="body2" color="textSecondary" paragraph>
            If you don't see the email, please check your spam folder.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResendEmail}
              disabled={isLoading || countdown > 0}
              fullWidth
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyEmail; 