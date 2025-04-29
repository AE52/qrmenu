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
  Alert
} from '@mui/material';
import { supabase, RestaurantApplication } from '../../lib/supabase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { v4 as uuidv4 } from 'uuid';

export default function RestaurantApplicationsTab() {
  const [applications, setApplications] = useState<RestaurantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<RestaurantApplication | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('admin_restaurant_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setApplications(data || []);
    } catch (error: any) {
      console.error('Başvuruları alma hatası:', error);
      setError('Başvurular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: RestaurantApplication) => {
    setSelectedApplication(application);
    setViewDialogOpen(true);
  };

  const handleApproveClick = (application: RestaurantApplication) => {
    setSelectedApplication(application);
    setNotes('');
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (application: RestaurantApplication) => {
    setSelectedApplication(application);
    setNotes('');
    setRejectDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 1. Önce başvuruyu güncelle
      const { error: updateError } = await supabase
        .from('restaurant_applications')
        .update({
          status: 'approved',
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);
      
      if (updateError) throw updateError;
      
      // 2. Eğer kullanıcı belirlenmişse, o kullanıcı için yeni bir restoran oluştur
      if (selectedApplication.user_id) {
        const { error: restaurantError } = await supabase
          .from('restaurants')
          .insert({
            name: selectedApplication.name,
            description: selectedApplication.description,
            logo_url: selectedApplication.logo_url,
            address: selectedApplication.address,
            phone: selectedApplication.phone,
            user_id: selectedApplication.user_id,
            is_active: true
          });
        
        if (restaurantError) throw restaurantError;
      }
      
      // 3. Başarılı mesajını göster
      setSuccess(`Başvuru başarıyla onaylandı: ${selectedApplication.name}`);
      
      // 4. Başvuru listesini yenile
      await fetchApplications();
      
      // 5. Dialog'ı kapat
      setApproveDialogOpen(false);
    } catch (error: any) {
      console.error('Onaylama hatası:', error);
      setError('Başvuru onaylanırken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('restaurant_applications')
        .update({
          status: 'rejected',
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);
      
      if (error) throw error;
      
      setSuccess(`Başvuru reddedildi: ${selectedApplication.name}`);
      await fetchApplications();
      setRejectDialogOpen(false);
    } catch (error: any) {
      console.error('Reddetme hatası:', error);
      setError('Başvuru reddedilirken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip color="warning" label="Bekliyor" />;
      case 'approved':
        return <Chip color="success" label="Onaylandı" />;
      case 'rejected':
        return <Chip color="error" label="Reddedildi" />;
      default:
        return <Chip label={status} />;
    }
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

  if (loading && applications.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Başvurular yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Restoran Başvuruları</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={fetchApplications}
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
      
      {applications.length === 0 ? (
        <Alert severity="info">
          Henüz bir başvuru bulunmamaktadır.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Restoran Adı</TableCell>
                <TableCell>Sahibi</TableCell>
                <TableCell>Başvuru Tarihi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.name}</TableCell>
                  <TableCell>{application.owner_name}</TableCell>
                  <TableCell>{formatDate(application.created_at)}</TableCell>
                  <TableCell>{getStatusChip(application.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleViewDetails(application)}
                      title="Detayları Görüntüle"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    
                    {application.status === 'pending' && (
                      <>
                        <IconButton 
                          color="success" 
                          onClick={() => handleApproveClick(application)}
                          title="Onayla"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRejectClick(application)}
                          title="Reddet"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
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
        {selectedApplication && (
          <>
            <DialogTitle>Başvuru Detayları: {selectedApplication.name}</DialogTitle>
            <DialogContent>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Restoran Adı</strong></TableCell>
                      <TableCell>{selectedApplication.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Açıklama</strong></TableCell>
                      <TableCell>{selectedApplication.description || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Adres</strong></TableCell>
                      <TableCell>{selectedApplication.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Telefon</strong></TableCell>
                      <TableCell>{selectedApplication.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell>{selectedApplication.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>İşletme Sahibi</strong></TableCell>
                      <TableCell>{selectedApplication.owner_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Başvuru Tarihi</strong></TableCell>
                      <TableCell>{formatDate(selectedApplication.created_at)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Durum</strong></TableCell>
                      <TableCell>{getStatusChip(selectedApplication.status)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Notlar</strong></TableCell>
                      <TableCell>{selectedApplication.notes || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedApplication.logo_url && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="subtitle1" gutterBottom>Logo:</Typography>
                  <img 
                    src={selectedApplication.logo_url} 
                    alt="Restaurant Logo" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Kapat</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Onaylama Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => !processing && setApproveDialogOpen(false)}
      >
        {selectedApplication && (
          <>
            <DialogTitle>Restoran Başvurusunu Onayla</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                <strong>{selectedApplication.name}</strong> isimli restoran başvurusunu onaylamak üzeresiniz.
              </Typography>
              <TextField
                margin="dense"
                label="Notlar (İsteğe bağlı)"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={processing}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setApproveDialogOpen(false)} disabled={processing}>
                İptal
              </Button>
              <Button 
                onClick={handleApprove} 
                color="success" 
                variant="contained"
                disabled={processing}
                startIcon={processing ? <CircularProgress size={24} /> : <CheckCircleIcon />}
              >
                {processing ? 'İşleniyor...' : 'Onayla'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Reddetme Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => !processing && setRejectDialogOpen(false)}
      >
        {selectedApplication && (
          <>
            <DialogTitle>Restoran Başvurusunu Reddet</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                <strong>{selectedApplication.name}</strong> isimli restoran başvurusunu reddetmek üzeresiniz.
              </Typography>
              <TextField
                margin="dense"
                label="Red Nedeni"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={processing}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRejectDialogOpen(false)} disabled={processing}>
                İptal
              </Button>
              <Button 
                onClick={handleReject} 
                color="error" 
                variant="contained"
                disabled={processing || !notes.trim()}
                startIcon={processing ? <CircularProgress size={24} /> : <CancelIcon />}
              >
                {processing ? 'İşleniyor...' : 'Reddet'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
} 