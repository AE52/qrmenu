'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Switch,
  FormGroup,
  FormControlLabel,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [annually, setAnnually] = useState(false);
  
  const handlePricingChange = () => {
    setAnnually(!annually);
  };

  const pricingPlans = [
    {
      title: "Ücretsiz",
      price: 0,
      annualPrice: 0,
      description: "Tek restoran için dijital menü çözümü.",
      features: [
        { text: "1 Restoran", available: true },
        { text: "5 QR Kod", available: true },
        { text: "Temel Menü Yönetimi", available: true },
        { text: "Sınırlı Tema Seçenekleri", available: true },
        { text: "Temel İstatistikler", available: true },
        { text: "Standart Destek", available: true },
        { text: "QR Menü Logosu", available: false },
        { text: "Çoklu Dil Desteği", available: false },
        { text: "Özel Alan Adı", available: false },
        { text: "Gelişmiş Raporlama", available: false },
      ]
    },
    {
      title: "Standart",
      popular: true,
      price: 149,
      annualPrice: 1490,
      discount: "20% tasarruf",
      description: "Büyüyen restoranlar için ideal çözüm.",
      features: [
        { text: "1 Restoran", available: true },
        { text: "Sınırsız QR Kod", available: true },
        { text: "Gelişmiş Menü Yönetimi", available: true },
        { text: "Tüm Tema Seçenekleri", available: true },
        { text: "Detaylı İstatistikler", available: true },
        { text: "Öncelikli Destek", available: true },
        { text: "QR Menü Logosuz", available: true },
        { text: "Çoklu Dil Desteği", available: true },
        { text: "Özel Alan Adı", available: false },
        { text: "Gelişmiş Raporlama", available: false },
      ]
    },
    {
      title: "Premium",
      price: 299,
      annualPrice: 2990,
      discount: "20% tasarruf",
      description: "Profesyonel restoran zincirleri için.",
      features: [
        { text: "5 Restoran", available: true },
        { text: "Sınırsız QR Kod", available: true },
        { text: "Tam Menü Yönetimi", available: true },
        { text: "Özel Tema Oluşturma", available: true },
        { text: "Gelişmiş İstatistikler", available: true },
        { text: "7/24 Öncelikli Destek", available: true },
        { text: "QR Menü Logosuz", available: true },
        { text: "Çoklu Dil Desteği", available: true },
        { text: "Özel Alan Adı", available: true },
        { text: "Gelişmiş Raporlama", available: true },
      ]
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Fiyatlandırma
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 5 }}>
            İşletmenizin ihtiyaçlarına uygun fiyatlandırma seçeneklerimiz ile dijital menü sistemine geçişi kolaylaştırıyoruz.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
            <FormGroup>
              <Paper elevation={2} sx={{ px: 3, py: 1, borderRadius: 5 }}>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={annually}
                      onChange={handlePricingChange}
                      color="primary"
                    />
                  } 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>
                        {annually ? 'Yıllık %20 indirim' : 'Aylık ödeme'}
                      </Typography>
                      {annually && (
                        <Box 
                          component="span" 
                          sx={{ 
                            ml: 1, 
                            bgcolor: 'primary.main', 
                            color: 'white', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          TASARRUF
                        </Box>
                      )}
                    </Box>
                  }
                />
              </Paper>
            </FormGroup>
          </Box>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={plan.popular ? 8 : 3} 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  },
                  border: plan.popular ? 2 : 0,
                  borderColor: 'primary.main'
                }}
              >
                {plan.popular && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 15, 
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      py: 0.5,
                      px: 2,
                      fontWeight: 'bold',
                      borderTopLeftRadius: 4,
                      borderBottomLeftRadius: 4,
                      zIndex: 1
                    }}
                  >
                    ÖNERİLEN
                  </Box>
                )}
                <CardHeader
                  title={plan.title}
                  titleTypographyProps={{ align: 'center', variant: 'h5', fontWeight: 'bold' }}
                  subheader={plan.description}
                  subheaderTypographyProps={{ align: 'center' }}
                  sx={{ bgcolor: plan.popular ? 'primary.lighter' : 'background.paper' }}
                />
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography component="h2" variant="h3" color="text.primary">
                      {annually ? 
                        <>
                          {plan.annualPrice > 0 ? `${plan.annualPrice} ₺` : 'Ücretsiz'}
                          <Typography variant="subtitle1" component="span">/yıl</Typography>
                        </> : 
                        <>
                          {plan.price > 0 ? `${plan.price} ₺` : 'Ücretsiz'}
                          <Typography variant="subtitle1" component="span">/ay</Typography>
                        </>
                      }
                    </Typography>
                    {annually && plan.discount && (
                      <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                        {plan.discount}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <List sx={{ mb: 3 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} alignItems="flex-start" disableGutters>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {feature.available ? 
                            <CheckIcon color="success" /> : 
                            <CloseIcon color="error" />
                          }
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: feature.available ? 'text.primary' : 'text.secondary'
                          }}
                        />
                        <Tooltip title="Daha fazla bilgi">
                          <IconButton size="small">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    component={Link}
                    href="/restaurant-application"
                    fullWidth
                    variant={plan.popular ? "contained" : "outlined"}
                    sx={{ py: 1.5 }}
                  >
                    {plan.price > 0 ? 'Hemen Başla' : 'Ücretsiz Başla'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Sık Sorulan Sorular
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Ödeme yapmadan önce deneme süresi var mı?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Evet, ücretsiz planımız ile sistemimizi test edebilirsiniz. Ayrıca tüm ücretli planlarımız için 14 gün para iade garantisi sunuyoruz.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Aboneliğimi istediğim zaman iptal edebilir miyim?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Evet, aboneliklerimiz herhangi bir sözleşme gerektirmez. İstediğiniz zaman iptal edebilir veya planınızı değiştirebilirsiniz.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Daha fazla restorana ihtiyacım olursa ne yapmalıyım?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Premium planımızda 5 restoran hakkı bulunmaktadır. Daha fazla restorana ihtiyacınız olursa, özel kurumsal çözümlerimiz için bizimle iletişime geçebilirsiniz.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'left', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Teknik destek alabilir miyim?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Tüm planlarımızda teknik destek sunuyoruz. Standart ve Premium planlarımızda öncelikli destek ve daha hızlı yanıt süreleri mevcuttur.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8, textAlign: 'center', bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Özel ihtiyaçlarınız mı var?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Restoran zincirleri, oteller ve özel işletmeler için kurumsal çözümlerimiz hakkında bilgi alın.
          </Typography>
          <Button 
            component={Link}
            href="/contact"
            variant="contained" 
            size="large"
          >
            Bizimle İletişime Geçin
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 