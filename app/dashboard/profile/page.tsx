'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Stack
} from '@mui/material';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Kullanıcı bilgilerini al
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }
        
        setUser(user);

        // Profil bilgilerini al
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setAvatarUrl(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Profil yükleme hatası:', error);
        setError('Profil bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (!user) {
        throw new Error('Kullanıcı bilgisi bulunamadı.');
      }
      
      // Profil güncelleme
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        throw updateError;
      }
      
      // Başarılı güncelleme mesajı
      setSuccessMessage('Profil bilgileriniz başarıyla güncellendi.');
      
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      setError('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Profil yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard')}
          sx={{ mb: 3 }}
        >
          Dashboard'a Dön
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Profil Bilgilerim
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: { xs: '100%', md: '30%' } 
              }}>
                <Avatar 
                  src={avatarUrl || undefined} 
                  alt={fullName || user?.email}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Temel Bilgiler
                </Typography>
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="E-posta"
                  value={user?.email || ''}
                  InputProps={{ readOnly: true }}
                  disabled
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ad Soyad"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ad ve soyadınızı girin"
                />
                
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  {profile?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'} hesabı
                </Typography>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 