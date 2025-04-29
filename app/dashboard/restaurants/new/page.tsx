'use client';

import { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Stack, Alert } from '@mui/material';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function NewRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Kullanıcıyı kontrol et
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Oturum açık değil!');
      }

      // Restoranı oluştur
      const { data, error } = await supabase
        .from('restaurants')
        .insert({
          name: formData.name,
          description: formData.description || null,
          address: formData.address || null,
          phone: formData.phone || null,
          user_id: user.id,
          is_active: false,
          pending_approval: true,
        })
        .select();

      if (error) throw error;

      setSuccess('Restoran başarıyla oluşturuldu. Admin onayından sonra aktif olacaktır.');
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
      });
    } catch (error: any) {
      console.error('Restoran oluşturma hatası:', error);
      setError(error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/dashboard')}
            sx={{ mr: 2 }}
          >
            Geri
          </Button>
          <Typography variant="h4">Yeni Restoran Ekle</Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Restoran Adı"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Açıklama"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Adres"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Telefon"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => router.push('/dashboard')}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 