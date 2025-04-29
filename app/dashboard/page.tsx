'use client';

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, Divider, Stack, Chip } from '@mui/material';
import { supabase, Restaurant } from '../lib/supabase';
import QRCode from 'react-qr-code';
import AddIcon from '@mui/icons-material/Add';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndRestaurants = async () => {
      try {
        // Kullanıcı bilgilerini al
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/';
          return;
        }
        
        setUser(user);

        // Kullanıcının restoranlarını al
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        setRestaurants(data || []);
      } catch (error) {
        console.error('Veri alma hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRestaurants();
  }, []);

  const handleCreateRestaurant = () => {
    window.location.href = '/dashboard/restaurants/new';
  };

  const getStatusChip = (restaurant: Restaurant) => {
    if (restaurant.pending_approval) {
      return <Chip color="warning" label="Onay Bekliyor" />;
    }
    return restaurant.is_active ? <Chip color="success" label="Aktif" /> : <Chip color="error" label="Pasif" />;
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4">Restoranlarım</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleCreateRestaurant}
          >
            Yeni Restoran Ekle
          </Button>
        </Stack>

        {restaurants.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <CardContent>
              <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Henüz Restoranınız Yok</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                İlk restoranınızı ekleyerek QR menü oluşturmaya başlayın.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleCreateRestaurant}
              >
                İlk Restoranımı Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {restaurants.map((restaurant) => (
              <Box key={restaurant.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(33.33% - 16px)' } }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="h6">{restaurant.name}</Typography>
                      {getStatusChip(restaurant)}
                    </Stack>
                    
                    {restaurant.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {restaurant.description}
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                        <QRCode
                          size={128}
                          value={`${window.location.origin}/menu/${restaurant.id}`}
                        />
                      </Box>
                    </Box>
                    
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<QrCodeIcon />}
                        href={`/dashboard/restaurants/${restaurant.id}/qr`}
                      >
                        QR Kodu
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        href={`/dashboard/restaurants/${restaurant.id}`}
                      >
                        Yönet
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
} 