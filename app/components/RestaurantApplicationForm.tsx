'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper, 
  Stack, 
  Container,
  CircularProgress,
  FormHelperText
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage-helpers';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';

export default function RestaurantApplicationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    owner_name: '',
    tc_no: '',
    password: '',
    logo: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        logo: file,
      });

      // Önizleme için URL oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccess(false);

    try {
      // Önce kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.owner_name,
          },
        }
      });
      
      if (authError) throw authError;
      
      let logoUrl = null;
      
      // Logo yükle (varsa)
      if (formData.logo) {
        logoUrl = await uploadImage(formData.logo, 'restaurant-logos');
      }

      // Başvuruyu oluştur
      const { error } = await supabase
        .from('restaurant_applications')
        .insert({
          name: formData.name,
          description: formData.description || null,
          logo_url: logoUrl,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          owner_name: formData.owner_name,
          tc_no: formData.tc_no,
          password: formData.password,
          user_id: authData.user?.id || null,
          status: 'pending'
        });

      if (error) throw error;

      // Başarılı mesajı göster
      setSuccess(true);
      
      // Formu temizle
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        owner_name: '',
        tc_no: '',
        password: '',
        logo: null,
      });
      setLogoPreview(null);
      
      // 3 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error: any) {
      console.error('Başvuru hatası:', error);
      setErrorMessage(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Restoran Başvurusu
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          QR Menü sistemimizde restoranınızı tanıtmak için aşağıdaki formu doldurun. 
          Başvurunuz incelendikten sonra size e-posta ile bilgi verilecektir.
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Başvurunuz başarıyla alındı! İncelendikten sonra size bilgi verilecektir. Ana sayfaya yönlendiriliyorsunuz...
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Restoran Adı"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Açıklama"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
              <FormHelperText>Opsiyonel</FormHelperText>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Adres"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="E-posta"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="İşletme Sahibinin Adı"
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="TC Kimlik No"
                name="tc_no"
                value={formData.tc_no}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Şifre"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="column" spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  disabled={loading}
                >
                  Logo Yükle
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </Button>
                <FormHelperText>Opsiyonel</FormHelperText>
                
                {logoPreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img 
                      src={logoPreview} 
                      alt="Logo önizleme" 
                      style={{ maxWidth: '200px', maxHeight: '200px' }} 
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={24} /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
} 