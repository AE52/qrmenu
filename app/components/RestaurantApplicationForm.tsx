'use client';

import { useState, ChangeEvent, FormEvent } from 'react'; // Import specific event types
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage-helpers';
import { useRouter } from 'next/navigation';
// import Image from 'next/image'; // Removed, using Avatar or img tag within Box

// --- MUI Imports ---
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Avatar from '@mui/material/Avatar';
import FormLabel from '@mui/material/FormLabel';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline'; // Optional: for baseline styles

// --- MUI Icons ---
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Lock'; // Using Lock for Password
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
// import TableBarIcon from '@mui/icons-material/TableBar'; // No direct equivalent, using RestaurantIcon or similar
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// --- End MUI Icons ---

// --- Removed SVG Icons ---

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        logo: file,
      });

      const reader = new FileReader();
      reader.onload = (loadEvent) => { // Renamed event variable
        setLogoPreview(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
       // Handle case where file selection is cancelled
       setFormData({ ...formData, logo: null });
       setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccess(false);

    // Basic Frontend Validation (Optional but Recommended)
    if (!formData.name || !formData.address || !formData.phone || !formData.email || !formData.owner_name || !formData.tc_no || !formData.password) {
       setErrorMessage('Lütfen tüm zorunlu alanları (*) doldurun.');
       setLoading(false);
       return;
    }
    if (!/^\d{11}$/.test(formData.tc_no)) {
        setErrorMessage('Lütfen geçerli bir TC Kimlik Numarası girin (11 rakam).');
        setLoading(false);
        return;
    }
     if (formData.password.length < 6) {
        setErrorMessage('Şifre en az 6 karakter olmalıdır.');
        setLoading(false);
        return;
    }


    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.owner_name,
            // You might want to store the TC No securely here if needed for auth context
            // tc_no: formData.tc_no,
          },
        }
      });

      // Improved error handling for sign up
      if (authError) {
        console.error('Supabase Auth Error:', authError);
        // Provide more user-friendly error messages
        if (authError.message.includes('User already registered')) {
           setErrorMessage('Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta deneyin veya giriş yapın.');
        } else if (authError.message.includes('Password should be at least 6 characters')) {
           setErrorMessage('Şifre en az 6 karakter uzunluğunda olmalıdır.');
        } else {
           setErrorMessage(`Hesap oluşturulurken bir hata oluştu: ${authError.message}`);
        }
        throw authError; // Re-throw to stop execution if needed, or handle differently
      }


      if (!authData?.user) {
         throw new Error("Kullanıcı oluşturulamadı veya kullanıcı bilgisi alınamadı.");
      }

      let logoUrl = null;

      if (formData.logo) { // Upload logo only if a file is selected
          try {
        logoUrl = await uploadImage(formData.logo, 'restaurant-logos', `${authData.user.id}/${formData.logo.name}`);
          } catch (uploadError: any) {
              console.error("Logo yükleme hatası:", uploadError);
              // Decide if the process should continue without a logo or show an error
              setErrorMessage(`Logo yüklenirken bir hata oluştu: ${uploadError.message}. Başvuruya logosuz devam edilecek.`);
              // Optionally re-throw if logo is critical: throw uploadError;
          }
      }


      const { error: insertError } = await supabase
        .from('restaurants')
        .insert({
          name: formData.name,
          description: formData.description || null,
          logo_url: logoUrl,
          address: formData.address,
          phone: formData.phone,
          // email: formData.email, // Email is managed by auth user, maybe store as contact_email?
          owner_name: formData.owner_name,
          // Storing TC No in plain text is a security risk. Consider alternatives
          // or ensure proper database-level encryption and access control.
          tc_no: formData.tc_no,
          user_id: authData.user.id, // Use the confirmed user id
          status: 'pending',
          contact_email: formData.email // Added a separate field for contact email
        });

      if (insertError) {
          console.error('Supabase Insert Error:', insertError);
          // Attempt to clean up the created user if the restaurant insert fails? Complex logic.
          // Example: await supabase.auth.admin.deleteUser(authData.user.id); // Requires admin privileges
          setErrorMessage(`Restoran bilgileri kaydedilirken bir hata oluştu: ${insertError.message}`);
          throw insertError;
      }

      setSuccess(true);
      setFormData({ // Reset form
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

      setTimeout(() => {
        router.push('/dashboard/restaurants'); // Redirect to restaurant list or confirmation
      }, 3000);

    } catch (error: any) {
      // Catch errors thrown from try block
      console.error('Genel Başvuru Hatası:', error);
      // Ensure an error message is set if not already done
      if (!error) { // Check if 'error' state is already set
         setErrorMessage(error.message || 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Using AppTheme or ThemeProvider is recommended if you have a custom theme
    // <AppTheme>
    <>
      <CssBaseline /> {/* Ensures baseline styles */}
      <Container component="main" maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Card 
          elevation={5} 
          sx={{ 
            overflow: 'visible',
            borderRadius: 2,
            boxShadow: (theme) => `0 8px 24px rgba(0,0,0,0.12)`,
          }}
        > {/* Allow potential overflows for header */}

        {/* Header */}
          <Box
            sx={{
              // Similar gradient to Tailwind, adjust colors as needed
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', // Better gradient angle
              color: 'white',
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              borderTopLeftRadius: (theme) => theme.shape.borderRadius, // Match card radius
              borderTopRightRadius: (theme) => theme.shape.borderRadius,
              position: 'relative', // For potential decorative elements
              mb: 4, // Margin bottom to separate from form content
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow for depth
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
              <RestaurantIcon sx={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
              Restoran Başvuru Formu
              </Typography>
            </Stack>
            <Typography variant="body1" color="rgba(255, 255, 255, 0.85)">
            QR Menü ailesine katılmak için aşağıdaki bilgileri doldurun.
            </Typography>
          </Box>

          {/* Form Content */}
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

              {/* Success Alert */}
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <AlertTitle>Başarılı!</AlertTitle>
                  Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz. Yönlendiriliyorsunuz...
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Hata</AlertTitle>
                  {error}
                </Alert>
              )}

              {/* Form Sections */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Restaurant Info Section */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 1, 
                    mb: 2,
                    color: (theme) => theme.palette.primary.main
                  }}>
                    <RestaurantIcon color="primary"/> Restoran Bilgileri
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Restoran Adı"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Örn: Lezzet Durağı"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <RestaurantIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="phone"
                      label="Telefon Numarası"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XXXXXXXXX"
                       InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>

                <Box>
                  <TextField
                    fullWidth
                    id="description"
                    label="Restoran Açıklaması (Opsiyonel)"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Restoranınız hakkında kısa bir bilgi"
                    InputProps={{
                     startAdornment: (
                       <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                         <DescriptionIcon color="action" />
                       </InputAdornment>
                     ),
                     sx: { alignItems: 'flex-start' } // Align start icon to top
                   }}
                  />
                </Box>

                <Box>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Adres"
                    name="address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Cadde, Sokak, No, İlçe, İl"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                          <HomeIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { alignItems: 'flex-start' } // Align start icon to top
                    }}
                  />
                </Box>

                {/* Logo Upload */}
                <Box>
                  <FormLabel component="legend" sx={{ mb: 1 }}>Restoran Logosu (Opsiyonel)</FormLabel>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={logoPreview || undefined} // Use undefined if null for default avatar
                      sx={{ width: 64, height: 64, bgcolor: 'grey.200', border: '1px solid', borderColor: 'divider' }}
                      variant="rounded" // or "circular"
                    >
                      {!logoPreview && <RestaurantIcon color="action"/> /* Placeholder Icon */}
                    </Avatar>
                    <Button
                      variant="outlined"
                      component="label" // Makes the button act as a label for the hidden input
                      startIcon={<CloudUploadIcon />}
                      disabled={loading}
                    >
                      Logo Seç
                      <input
                        type="file"
                        hidden // Hide the actual file input
                        id="logo-upload"
                        name="logo"
                        onChange={handleLogoChange}
                        accept="image/png, image/jpeg, image/gif" // Specify accepted formats
                      />
                    </Button>
                  </Stack>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{mt: 1}}>
                      PNG, JPG, GIF - Maks 2MB
                  </Typography>
                </Box>

                {/* Owner & Auth Info Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 1, 
                    mb: 2,
                    color: (theme) => theme.palette.primary.main 
                  }}>
                    <PersonIcon color="primary"/> Yetkili Bilgileri & Hesap
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="owner_name"
                      label="Yetkili Adı Soyadı"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      placeholder="Adınız Soyadınız"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="tc_no"
                      label="TC Kimlik Numarası"
                      name="tc_no"
                      value={formData.tc_no}
                      onChange={handleChange}
                      placeholder="XXXXXXXXXXX"
                      inputProps={{ maxLength: 11, pattern: '[0-9]{11}' }} // HTML5 validation
                      helperText="Fatura ve yasal işlemler için gereklidir."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="E-posta Adresi"
                      name="email"
                      type="email"
                      autoComplete="email" // Help browsers autofill
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="hesap@example.com"
                      helperText="Giriş yapmak ve iletişim için kullanılacaktır."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                    <TextField
                      required
                      fullWidth
                      id="password"
                      label="Şifre"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="En az 6 karakter"
                      inputProps={{ minLength: 6 }} // HTML5 validation
                      helperText="Hesabınıza giriş yapmak için kullanılacaktır."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PasswordIcon color="action" />
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
                  </Box>
                </Stack>
              </Box> {/* End Form Sections */}

              {/* Submit Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || success}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (success ? <CheckCircleIcon /> : <SaveIcon />)}
                  sx={{ 
                    minWidth: 180,
                    borderRadius: 2,
                    py: 1.5,
                    boxShadow: (theme) => `0 4px 8px rgba(0,0,0,0.12)`,
                  }} // Ensure button has a decent width
                >
                  {loading ? 'Gönderiliyor...' : (success ? 'Başvuru Alındı' : 'Başvuruyu Gönder')}
                </Button>
              </Box>

            </Box> {/* End Form Box */}
          </CardContent>
        </Card>
      </Container>
      </>
    // </AppTheme>
  );
} 