'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter } from 'next/navigation';

interface HeroProps {
  onStartClick: () => void;
  isLoading?: boolean;
}

export default function Hero({ onStartClick, isLoading = false }: HeroProps) {
  const router = useRouter();

  const handleRestaurantApplication = () => {
    router.push('/restaurant-application');
  };

  const handleAdvertiserApplication = () => {
    router.push('/advertiser-application');
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(to right, #FF5722, #FF9800)',
      color: 'white',
      py: 8
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
            <Typography variant="overline" sx={{ fontWeight: 600, letterSpacing: 1.5 }}>
              RESTORAN QR MENÜ
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Yeni Nesil Dijital QR Kod Menü & Sipariş Sistemi
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, opacity: 0.9 }}>
              Restoran, cafe, pastane ve oteller için yeni nesil temassız dijital menü, karekodlu qr menü sistemi
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                color="secondary"
                onClick={handleRestaurantApplication}
                startIcon={<RestaurantIcon />}
                disabled={isLoading}
                sx={{ color: '#fff', borderRadius: 4 }}
              >
                Restoran Başvurusu
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={handleAdvertiserApplication}
                startIcon={<CampaignIcon />}
                sx={{ borderRadius: 4, borderColor: 'white', color: 'white' }}
              >
                Reklam Veren Başvurusu
              </Button>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="contained" 
                size="large" 
                color="info"
                onClick={() => router.push('/menu/restaurant-list')}
                startIcon={<QrCodeIcon />}
                disabled={isLoading}
                sx={{ color: '#fff', borderRadius: 4 }}
              >
                Sistemdeki restoranları görüntüle
              </Button>
            </Stack>
          </Box>
          <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: 400,
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 30px 40px rgba(0,0,0,0.1)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                transition: 'all 0.3s ease'
              }}
            >
              <img 
                src="/qr-menu-hero.jpg" 
                alt="QR Menü Örneği" 
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 