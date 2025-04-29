'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface CallToActionProps {
  onButtonClick: () => void;
  isLoading?: boolean;
}

export default function CallToAction({ onButtonClick, isLoading = false }: CallToActionProps) {
  return (
    <Box sx={{ 
      background: 'linear-gradient(to right, #FF5722, #FF9800)',
      color: 'white',
      py: 6
    }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
            QR Menü Sistemi ile hep bir adım önde olun!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Dijital QR menü ile işletmenizi modernleştirin, maliyetleri azaltın ve müşteri memnuniyetini artırın.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            onClick={onButtonClick}
            startIcon={<DownloadIcon />}
            disabled={isLoading}
            sx={{ color: '#fff', borderRadius: 4, py: 1.5, px: 4 }}
          >
            Hemen Başlayın
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 