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
  FormHelperText,
  useMediaQuery,
  useTheme,
  Divider,
  Card,
  CardMedia,
  Avatar,
  InputAdornment,
  IconButton,
  alpha,
  Chip,
  Grid
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage-helpers';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import DescriptionIcon from '@mui/icons-material/Description';
import CampaignIcon from '@mui/icons-material/Campaign';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';

export default function AdvertiserApplicationForm() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    tc_no: '',
    password: '',
    logo: null as File | null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
            full_name: formData.company_name,
          },
        }
      });
      
      if (authError) throw authError;
      
      let logoUrl = null;
      
      // Logo yükle (varsa)
      if (formData.logo) {
        logoUrl = await uploadImage(formData.logo, 'advertiser-logos');
      }

      // Başvuruyu oluştur
      const { error } = await supabase
        .from('advertisers')
        .insert({
          company_name: formData.company_name,
          description: formData.description || null,
          logo_url: logoUrl,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          tc_no: formData.tc_no,
          user_id: authData.user?.id || null,
          status: 'pending'
        });

      if (error) throw error;

      // Başarılı mesajı göster
      setSuccess(true);
      
      // Formu temizle
      setFormData({
        company_name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Input alanlarının ortak özellikleri
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.2s',
      height: '56px',
      '&:hover': {
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
      }
    },
    width: '100%',
    maxWidth: '500px',
    mx: 'auto'
  };

  // Multiline alanların özellikleri
  const multilineInputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)',
      }
    },
    width: '100%',
    maxWidth: '500px',
    mx: 'auto'
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: '#ffffff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}
      >
        {/* Header Bölümü */}
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            py: 3, 
            px: { xs: 3, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: `linear-gradient(135deg, transparent 0%, ${alpha(theme.palette.primary.light, 0.4)} 100%)`,
              zIndex: 1
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <CampaignIcon 
                sx={{ 
                  fontSize: { xs: 36, md: 42 }, 
                  color: 'white',
                  mr: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} 
              />
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="800" 
                color="white"
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Reklamveren Başvurusu
              </Typography>
            </Box>
            <Typography 
              variant="body1"
              color="white"
              align="center"
              sx={{ 
                mt: 1, 
                mb: 0, 
                maxWidth: '600px',
                opacity: 0.9,
                mx: 'auto'
              }}
            >
              QR Menü sistemimize reklamveren olarak katılmak için başvuru formunu eksiksiz doldurun.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sol Bilgi Paneli */}
          <Box
            sx={{
              width: { xs: '100%', md: '33.33%' },
              bgcolor: alpha(theme.palette.primary.light, 0.05),
              p: { xs: 3, md: 4 },
              borderRight: { md: `1px solid ${alpha(theme.palette.divider, 0.08)}` },
              display: { xs: 'none', md: 'block' }
            }}
          >
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="600" color="primary.dark" gutterBottom align="center">
                Reklam Avantajları
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), p: 2, borderRadius: 3 }}>
                  <Box display="flex">
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="h6" color="primary.main">1</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Geniş Erişim
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Binlerce restoran müşterisine reklamlarınızı ulaştırın
                      </Typography>
                    </Box>
                  </Box>
                </Card>
                
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), p: 2, borderRadius: 3 }}>
                  <Box display="flex">
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="h6" color="primary.main">2</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Hedefli Pazarlama
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Belirli restoran türlerine özel reklamlar sunabilirsiniz
                      </Typography>
                    </Box>
                  </Box>
                </Card>
                
                <Card elevation={0} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), p: 2, borderRadius: 3 }}>
                  <Box display="flex">
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <Typography variant="h6" color="primary.main">3</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" color="text.primary">
                        Etki Ölçümü
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reklamlarınızın etkisini analitiklerle ölçümleyin
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Stack>
              
              {logoPreview && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: '4px solid white',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.1)',
                        zIndex: 1
                      }
                    }}
                  >
                    <img 
                      src={logoPreview} 
                      alt="Logo önizleme"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Şirket logo önizleme
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          {/* Form Alanı */}
          <Box
            sx={{
              width: { xs: '100%', md: '66.67%' }
            }}
          >
            <Box 
              component="form" 
              onSubmit={handleSubmit}
              sx={{ 
                p: { xs: 3, md: 5 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {success && (
                <Alert 
                  severity="success" 
                  variant="filled"
                  sx={{ 
                    mb: 4, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,150,0,0.15)',
                    py: 2,
                    width: '100%',
                    maxWidth: 500
                  }}
                >
                  Başvurunuz başarıyla alındı! İncelendikten sonra size bilgi verilecektir. Ana sayfaya yönlendiriliyorsunuz...
                </Alert>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  variant="filled"
                  sx={{ 
                    mb: 4, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(150,0,0,0.15)',
                    py: 2,
                    width: '100%',
                    maxWidth: 500
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
                <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 3, textAlign: 'center' }}>
                  Şirket Bilgileri
                </Typography>
                
                <Divider sx={{ mb: 4 }}>
                  <Chip icon={<CampaignIcon />} label="Firma Bilgileri" color="primary" />
                </Divider>
                
                <Grid container spacing={3}>
                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        maxWidth: 220,
                        textAlign: 'center'
                      }}
                    >
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoChange}
                      />
                      <label htmlFor="logo-upload">
                        <Box 
                          sx={{ 
                            position: 'relative',
                            width: 'fit-content',
                            mx: 'auto'
                          }}
                        >
                          <Avatar 
                            variant="rounded"
                            src={logoPreview || '/placeholder-logo.png'}
                            sx={{ 
                              width: 150, 
                              height: 150, 
                              mx: 'auto',
                              borderRadius: 2,
                              mb: 1,
                              bgcolor: theme.palette.mode === 'dark' ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
                              }
                            }}
                          />
                          <Box 
                            sx={{ 
                              position: 'absolute',
                              bottom: 10,
                              right: -10,
                              zIndex: 2,
                              bgcolor: 'primary.main',
                              borderRadius: '50%',
                              width: 36,
                              height: 36,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 1
                            }}
                          >
                            <UploadFileIcon sx={{ color: 'white', fontSize: 22 }} />
                          </Box>
                        </Box>
                      </label>
                      <FormHelperText sx={{ textAlign: 'center' }}>
                        Şirket logonuzu yükleyin
                      </FormHelperText>
                    </Box>
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="company_name"
                      label="Şirket Adı"
                      value={formData.company_name}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="email"
                      label="E-posta"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      name="description"
                      label="Açıklama"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      sx={multilineInputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="address"
                      label="Adres"
                      value={formData.address}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="phone"
                      label="Telefon"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="tc_no"
                      label="TC Kimlik No"
                      value={formData.tc_no}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <TextField
                      required
                      name="password"
                      label="Şifre"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordIcon color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={toggleShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 4,
                        boxShadow: 2,
                        width: { xs: '100%', sm: 'auto' },
                        maxWidth: '500px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Başvuruyu Gönder'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 