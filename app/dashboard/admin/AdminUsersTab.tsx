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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { supabase, Profile, Role } from '../../lib/supabase';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function AdminUsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Kullanıcı profil bilgileri al
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Auth kullanıcılarını al
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Kullanıcı bilgilerini birleştir
      const mergedUsers = authUsers.users.map((user: any) => {
        const profile = profiles.find((p: any) => p.id === user.id) || {};
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          full_name: profile.full_name || '',
          role: profile.role || 'user'
        };
      });
      
      setUsers(mergedUsers);
    } catch (error: any) {
      console.error('Kullanıcıları alma hatası:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setSelectedRole(user.role as Role);
    setEditDialogOpen(true);
  };

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value as Role);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    
    setProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      setSuccess(`Kullanıcı rolü başarıyla güncellendi: ${selectedUser.email}`);
      await fetchUsers();
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Rol güncelleme hatası:', error);
      setError('Kullanıcı rolü güncellenirken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleChip = (role: string) => {
    switch (role) {
      case 'admin':
        return <Chip color="primary" label="Admin" />;
      case 'user':
        return <Chip color="default" label="Kullanıcı" />;
      default:
        return <Chip label={role} />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Kullanıcılar yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Kullanıcılar</Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          onClick={fetchUsers}
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
      
      {users.length === 0 ? (
        <Alert severity="info">
          Henüz kullanıcı bulunmamaktadır.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>E-posta</TableCell>
                <TableCell>Ad Soyad</TableCell>
                <TableCell>Kayıt Tarihi</TableCell>
                <TableCell>Son Giriş</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.full_name || '-'}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleEditClick(user)}
                      title="Rol Düzenle"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Rol Düzenleme Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => !processing && setEditDialogOpen(false)}
      >
        {selectedUser && (
          <>
            <DialogTitle>Kullanıcı Rolünü Düzenle</DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2 }}>
                <strong>Kullanıcı:</strong> {selectedUser.email}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole}
                  label="Rol"
                  onChange={handleRoleChange}
                  disabled={processing}
                >
                  <MenuItem value="user">Kullanıcı</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} disabled={processing}>
                İptal
              </Button>
              <Button 
                onClick={handleSaveRole} 
                color="primary" 
                variant="contained"
                disabled={processing}
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