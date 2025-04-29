'use client';

import { Box, Container, Typography, Link, IconButton, Stack, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                QR Menü Sistemi
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Restoran, cafe, pastane ve oteller için yeni nesil temassız dijital menü çözümü.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" aria-label="Facebook" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn" size="small">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Hızlı Bağlantılar
            </Typography>
            <Link href="/" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Ana Sayfa
            </Link>
            <Link href="/features" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Özellikler
            </Link>
            <Link href="/pricing" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Fiyatlandırma
            </Link>
            <Link href="/about" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              Hakkımızda
            </Link>
            <Link href="/contact" color="inherit" underline="hover" display="block" sx={{ mb: 1 }}>
              İletişim
            </Link>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Typography variant="h6" component="div" gutterBottom>
              İletişim
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Adres: Merkez Mah. Şişli, İstanbul
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@qrmenusistemi.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Telefon: +90 (212) 123 45 67
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {currentYear} QR Menü Sistemi. Tüm hakları saklıdır.
          </Typography>
          <Box>
            <Link href="/privacy" color="inherit" underline="hover" sx={{ mr: 2 }}>
              Gizlilik Politikası
            </Link>
            <Link href="/terms" color="inherit" underline="hover">
              Kullanım Şartları
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 