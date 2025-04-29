'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, Box, Typography, Button, Card, CardContent, 
  Tabs, Tab, Divider, Stack, Chip, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { supabase, Restaurant } from '../../../lib/supabase';
import QRCode from 'react-qr-code';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function RestaurantDetail() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // Kullanıcı kontrolü
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }
        
        // Restoran bilgilerini al
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          setError('Restoran bulunamadı veya bu restoranı görüntüleme yetkiniz yok.');
          setLoading(false);
          return;
        }
        
        setRestaurant(data);
        setEditFormData({
          name: data.name,
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Veri alma hatası:', error);
        setError('Restoran bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: editFormData.name,
          description: editFormData.description || null,
          address: editFormData.address || null,
          phone: editFormData.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', restaurantId);

      if (error) throw error;
      
      // Restoran bilgilerini güncelle
      setRestaurant({
        ...restaurant!,
        name: editFormData.name,
        description: editFormData.description || null,
        address: editFormData.address || null,
        phone: editFormData.phone || null,
        updated_at: new Date().toISOString(),
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setError('Restoran güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId);

      if (error) throw error;
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Silme hatası:', error);
      setError('Restoran silinirken bir hata oluştu.');
      setDeleteDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Restoran bilgileri yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/dashboard')}
            sx={{ mb: 2 }}
          >
            Geri Dön
          </Button>
          <Card>
            <CardContent>
              <Typography color="error">{error || 'Restoran bulunamadı.'}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/dashboard')}
          sx={{ mb: 2 }}
        >
          Restoranlarıma Geri Dön
        </Button>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4">{restaurant.name}</Typography>
              {restaurant.is_active ? (
                <Chip size="small" color="success" label="Aktif" />
              ) : (
                <Chip size="small" color="error" label="Pasif" />
              )}
            </Stack>
            {restaurant.description && (
              <Typography variant="body1" color="text.secondary">
                {restaurant.description}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Düzenle
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Sil
            </Button>
          </Stack>
        </Stack>
        
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="restaurant tabs"
            >
              <Tab label="Genel Bilgiler" icon={<RestaurantMenuIcon />} iconPosition="start" />
              <Tab label="Menü" icon={<MenuBookIcon />} iconPosition="start" />
              <Tab label="QR Kodları" icon={<QrCodeIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>Restoran Bilgileri</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">Adres</Typography>
                    <Typography>{restaurant.address || 'Belirtilmemiş'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Telefon</Typography>
                    <Typography>{restaurant.phone || 'Belirtilmemiş'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Oluşturulma Tarihi</Typography>
                    <Typography>{new Date(restaurant.created_at).toLocaleDateString('tr-TR')}</Typography>
                  </Box>
                </Stack>
              </Box>
              
              <Box>
                <Typography variant="h6" gutterBottom>Menü Bağlantısı</Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  value={`${window.location.origin}/menu/${restaurant.id}`}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                    <QRCode
                      size={200}
                      value={`${window.location.origin}/menu/${restaurant.id}`}
                    />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>Menü Yönetimi</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">
              Bu bölümde restoran menünüzü yönetebilirsiniz. Kategoriler ekleyip menü öğelerinizi düzenleyebilirsiniz.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary"
                href={`/dashboard/restaurants/${restaurant.id}/menu`}
              >
                Menüyü Düzenle
              </Button>
            </Box>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>QR Kod Yönetimi</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              Bu bölümde QR kodlarınızı görüntüleyebilir ve indirebilirsiniz.
            </Typography>
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="contained" 
                color="primary"
                href={`/dashboard/restaurants/${restaurant.id}/qr`}
              >
                QR Kodları Yönet
              </Button>
            </Box>
          </TabPanel>
        </Card>
        
        {/* Düzenleme Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={handleEditDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Restoran Bilgilerini Düzenle</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                margin="dense"
                name="name"
                label="Restoran Adı"
                value={editFormData.name}
                onChange={handleInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="dense"
                name="description"
                label="Açıklama"
                value={editFormData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="dense"
                name="address"
                label="Adres"
                value={editFormData.address}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                margin="dense"
                name="phone"
                label="Telefon"
                value={editFormData.phone}
                onChange={handleInputChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditDialogClose} disabled={saving}>
              İptal
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              color="primary" 
              variant="contained"
              disabled={saving || !editFormData.name.trim()}
            >
              {saving ? <CircularProgress size={24} /> : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Silme Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
        >
          <DialogTitle>Restoran Silinecek</DialogTitle>
          <DialogContent>
            <Typography>
              "{restaurant.name}" isimli restoranı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} disabled={saving}>
              İptal
            </Button>
            <Button 
              onClick={handleDeleteRestaurant} 
              color="error" 
              variant="contained"
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Evet, Sil'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 