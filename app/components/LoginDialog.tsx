'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography, Box, Divider, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleGoogleSignIn() {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Giriş hatası:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEmailSignIn() {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      const { error } = response;
      
      if (error) throw error;
      
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      setErrorMessage(error.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setErrorMessage('');
    setEmail('');
    setPassword('');
    onClose();
  };

  const handleRestaurantApplication = () => {
    handleClose();
    router.push('/restaurant-application');
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">Giriş Yap</Typography>
        <IconButton onClick={handleClose} edge="end" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          sx={{ mb: 2, py: 1 }}
        >
          Google ile Giriş Yap
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            veya
          </Typography>
        </Divider>
        
        <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
          <TextField
            label="E-posta"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <TextField
            label="Şifre"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleEmailSignIn}
          disabled={isLoading || !email || !password}
          sx={{ py: 1 }}
        >
          Giriş Yap
        </Button>
        <Button 
          onClick={handleRestaurantApplication}
          color="inherit" 
          sx={{ textTransform: 'none' }}
        >
          Hesabınız yok mu? Restoran başvurusu yapın
        </Button>
      </DialogActions>
    </Dialog>
  );
} 