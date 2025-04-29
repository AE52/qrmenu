'use client';

import { Box, Container, Typography, Paper, Grid, Divider } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import DevicesIcon from '@mui/icons-material/Devices';
import PhoneIcon from '@mui/icons-material/Phone';
import CloudIcon from '@mui/icons-material/Cloud';
import StoreIcon from '@mui/icons-material/Store';

export default function Features() {
  const featureItems = [
    {
      icon: <QrCodeIcon fontSize="large" color="primary" />,
      title: 'QR Kod ile Kolay Erişim',
      description: 'Müşterileriniz için telefon kamerası ile taranarak saniyeler içinde menüye erişim.'
    },
    {
      icon: <DevicesIcon fontSize="large" color="primary" />,
      title: 'Tüm Cihazlara Uyumlu',
      description: 'Responsive tasarım sayesinde bütün cihazlarda sorunsuz çalışır.'
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Temassız Sipariş',
      description: 'Müşterileriniz QR kodu okutarak temassız şekilde sipariş verebilir.'
    },
    {
      icon: <CloudIcon fontSize="large" color="primary" />,
      title: 'Bulut Tabanlı Sistem',
      description: 'Menünüzü ve siparişlerinizi bulut tabanlı sistemimizde yönetin.'
    },
    {
      icon: <StoreIcon fontSize="large" color="primary" />,
      title: 'Çoklu Restoran Desteği',
      description: 'Birden fazla restoranınız varsa hepsini tek panelden yönetin.'
    },
    {
      icon: <RestaurantIcon fontSize="large" color="primary" />,
      title: 'Menü Kişiselleştirme',
      description: 'Menünüzü ihtiyaçlarınıza göre tamamen özelleştirme imkanı.'
    }
  ];

  return (
    <Box sx={{ my: 8 }}>
      <Container maxWidth="lg">
        {/* Özellikler Bölümü 1 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 8 }}>
          <Box sx={{ flex: '1 1 500px', minWidth: 0 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Dijital QR Menü ile beklemeden, hızlı sipariş!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Dijital QR menü ile akıllı telefonunuzun kamerasına QR kodunu tarayarak saniyeler içinde menüye ulaşabilirsiniz. 
              QR kod menü ile ürünlerinizi görsel olarak sunabilir, kolay ve hızlı bir şekilde sipariş alabilirsiniz.
            </Typography>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
              Etkileyici ve kullanıcı dostu tasarım
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              QR menü ürünlerinizi düzenli, anlaşılır ve etkileyici bir şekilde sunmanıza yardımcı olur. 
              Akıllı telefonlara özel tasarımı sayesinde ürünlerinizi etkileyici görseller ve detaylı açıklamalarla sunabilirsiniz. 
              QR kodlu menü ile müşterileriniz üzerinde olumlu bir etki yaratabilir, satışlarınızı artırabilirsiniz.
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 500px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src="/qr-menu-hero.jpg"
              alt="QR Menü Uygulaması"
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Özellikler Bölümü 2 */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Özellikler
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary' }}>
            QR Menü sistemimizin sunduğu özelliklerle işletmenizi bir adım öne taşıyın.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {featureItems.map((feature, index) => (
            <Paper 
              key={index} 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: '1px solid #eee',
                flex: '0 0 calc(33.33% - 16px)',
                minWidth: 280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
} 