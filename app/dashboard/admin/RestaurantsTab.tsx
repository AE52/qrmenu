'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { supabase, Restaurant } from '../../lib/supabase';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function RestaurantsTab() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    is_active: false,
    pending_approval: false
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setRestaurants(data || []);
    } catch (error: any) {
      console.error('Restoranları alma hatası:', error);
      setError('Restoranlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setViewDialogOpen(true);
  };

  const handleEditClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditFormData({
      name: restaurant.name,
      description: restaurant.description || '',
      address: restaurant.address || '',
      phone: restaurant.phone || '',
      is_active: restaurant.is_active,
      pending_approval: restaurant.pending_approval
    });
    setEditDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'is_active' ? checked : value,
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedRestaurant) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: editFormData.name,
          description: editFormData.description || null,
          address: editFormData.address || null,
          phone: editFormData.phone || null,
          is_active: editFormData.is_active,
          pending_approval: editFormData.pending_approval,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRestaurant.id);
      
      if (error) throw error;
      
      setSuccess(`Restoran başarıyla güncellendi: ${editFormData.name}`);
      await fetchRestaurants();
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Güncelleme hatası:', error);
      setError('Restoran güncellenirken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async (restaurant: Restaurant) => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          is_active: true,
          pending_approval: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', restaurant.id);
      
      if (error) throw error;
      
      setSuccess(`Restoran başarıyla onaylandı: ${restaurant.name}`);
      await fetchRestaurants();
    } catch (error: any) {
      console.error('Onaylama hatası:', error);
      setError('Restoran onaylanırken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusChip = (restaurant: Restaurant) => {
    if (restaurant.pending_approval) {
      return <Chip color="warning" label="Onay Bekliyor" />;
    }
    return restaurant.is_active ? 
      <Chip color="success" label="Aktif" /> : 
      <Chip color="error" label="Pasif" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && restaurants.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Restoranlar yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Restoranlar</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={fetchRestaurants}
          disabled={loading}
        >
          Yenile
        </Button>
      </Stack>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {restaurants.length === 0 ? (
        <Alert severity="info">
          Henüz bir restoran bulunmamaktadır.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Restoran Adı</TableCell>
                <TableCell>Adres</TableCell>
                <TableCell>Oluşturulma Tarihi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>{restaurant.address || '-'}</TableCell>
                  <TableCell>{formatDate(restaurant.created_at)}</TableCell>
                  <TableCell>{getStatusChip(restaurant)}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleViewDetails(restaurant)}
                      title="Detayları Görüntüle"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleEditClick(restaurant)}
                      title="Düzenle"
                    >
                      <EditIcon />
                    </IconButton>
                    {restaurant.pending_approval && (
                      <IconButton 
                        color="success" 
                        onClick={() => handleApprove(restaurant)}
                        title="Onayla"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Detay Görüntüleme Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRestaurant && (
          <>
            <DialogTitle>Restoran Detayları: {selectedRestaurant.name}</DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Restoran Adı</strong></TableCell>
                      <TableCell>{selectedRestaurant.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Açıklama</strong></TableCell>
                      <TableCell>{selectedRestaurant.description || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Adres</strong></TableCell>
                      <TableCell>{selectedRestaurant.address || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Telefon</strong></TableCell>
                      <TableCell>{selectedRestaurant.phone || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Oluşturulma Tarihi</strong></TableCell>
                      <TableCell>{formatDate(selectedRestaurant.created_at)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Durum</strong></TableCell>
                      <TableCell>{getStatusChip(selectedRestaurant)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedRestaurant.logo_url && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" gutterBottom>Logo:</Typography>
                  <img 
                    src={selectedRestaurant.logo_url} 
                    alt="Restaurant Logo" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </Box>
              )}
              
              {selectedRestaurant.pending_approval && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleApprove(selectedRestaurant);
                      setViewDialogOpen(false);
                    }}
                    startIcon={<CheckCircleIcon />}
                  >
                    Restoranı Onayla
                  </Button>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Kapat</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Düzenleme Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !processing && setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedRestaurant && (
          <>
            <DialogTitle>Restoran Düzenle: {selectedRestaurant.name}</DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="dense"
                  label="Restoran Adı"
                  fullWidth
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  disabled={processing}
                  required
                />
                <TextField
                  margin="dense"
                  label="Açıklama"
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  disabled={processing}
                />
                <TextField
                  margin="dense"
                  label="Adres"
                  fullWidth
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  disabled={processing}
                />
                <TextField
                  margin="dense"
                  label="Telefon"
                  fullWidth
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  disabled={processing}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={editFormData.is_active}
                      onChange={handleInputChange}
                      name="is_active"
                      disabled={processing}
                    />
                  }
                  label="Aktif"
                  sx={{ mt: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={!editFormData.pending_approval}
                      onChange={(e) => {
                        setEditFormData({
                          ...editFormData,
                          pending_approval: !e.target.checked
                        });
                      }}
                      name="approved"
                      disabled={processing}
                    />
                  }
                  label="Onaylandı"
                  sx={{ mt: 2, ml: 2 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} disabled={processing}>
                İptal
              </Button>
              <Button 
                onClick={handleSaveChanges} 
                color="primary" 
                variant="contained"
                disabled={processing || !editFormData.name.trim()}
                startIcon={processing ? <CircularProgress size={24} /> : <SaveIcon />}
              >
                {processing ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 