'use client';

import { Container, Typography, Box, Grid, Paper, Icon, Button } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import EditIcon from '@mui/icons-material/Edit';
import LanguageIcon from '@mui/icons-material/Language';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SecurityIcon from '@mui/icons-material/Security';
import Link from 'next/link';

export default function FeaturesPage() {
  const features = [
    {
      icon: <RestaurantMenuIcon fontSize="large" color="primary" />,
      title: 'Dijital Menü Yönetimi',
      description: 'Menülerinizi kolayca oluşturun, düzenleyin ve gerçek zamanlı olarak güncelleyin. Kategorileri ve ürünleri sürükle-bırak ile düzenleyin.'
    },
    {
      icon: <QrCodeIcon fontSize="large" color="primary" />,
      title: 'QR Kod Oluşturma',
      description: 'Masalarınız için özel QR kodlar oluşturun. Özelleştirilebilir tasarım ve kolay erişim seçenekleriyle müşterilerinize temassız menü deneyimi sunun.'
    },
    {
      icon: <PhoneAndroidIcon fontSize="large" color="primary" />,
      title: 'Mobil Uyumlu Tasarım',
      description: 'Tüm cihazlarda mükemmel görünen duyarlı menüler. Müşterileriniz kendi telefonlarından sorunsuzca menülerinize erişir.'
    },
    {
      icon: <EqualizerIcon fontSize="large" color="primary" />,
      title: 'Analitik ve Raporlama',
      description: 'Menünüzün performansını takip edin, popüler ürünleri görün ve müşteri etkileşimlerini analiz ederek işletmenizi büyütün.'
    },
    {
      icon: <EditIcon fontSize="large" color="primary" />,
      title: 'Kolay Fiyat Güncelleme',
      description: 'Fiyatlarınızı anında güncelleyin, promosyonlar ekleyin ve özel teklifler oluşturun. Tüm değişiklikler anında menünüzde görünür.'
    },
    {
      icon: <LanguageIcon fontSize="large" color="primary" />,
      title: 'Çoklu Dil Desteği',
      description: 'Birden fazla dilde menü sunarak uluslararası müşterilerinize hitap edin. Otomatik dil algılama ile konforlu bir deneyim sunun.'
    },
    {
      icon: <CloudUploadIcon fontSize="large" color="primary" />,
      title: 'Bulut Tabanlı Sistem',
      description: 'Verileriniz güvenle bulutta saklanır. İnternet bağlantısı olan her yerden menülerinize erişin ve yönetin.'
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Güvenli Altyapı',
      description: 'En yüksek güvenlik standartlarıyla korunan sisteme güvenle verilerinizi emanet edin. Düzenli yedeklemeler ve şifreli veri transferi.'
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Özelliklerimiz
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
            QR Menü Sistemi ile restoranınızı dijital dünyaya taşıyın ve müşterilerinize modern bir deneyim sunun.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" textAlign="center">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Dijital menüleriniz ile restoranınızı modernleştirin
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            QR Menü Sistemi ile işletmenizin verimliliğini artırın, müşteri deneyimini iyileştirin ve maliyetlerinizi düşürün. Temassız, dijital ve modern bir menü deneyimi sunun.
          </Typography>
          <Button 
            component={Link}
            href="/pricing"
            variant="contained" 
            size="large"
            sx={{ mr: 2 }}
          >
            Fiyatları İncele
          </Button>
          <Button 
            component={Link}
            href="/contact"
            variant="outlined" 
            size="large"
          >
            Bizimle İletişime Geçin
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 