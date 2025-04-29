'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Tab, 
  Tabs, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { supabase, Role, RestaurantApplication } from '../../lib/supabase';
import AdminUsersTab from './AdminUsersTab';
import { useRouter } from 'next/navigation';

// RestaurantApplicationsTab ve RestaurantsTab'ı dinamik import ile yükleyelim
import dynamic from 'next/dynamic';

const RestaurantApplicationsTab = dynamic(() => import('./RestaurantApplicationsTab'), {
  loading: () => <p>Yükleniyor...</p>,
});

const RestaurantsTab = dynamic(() => import('./RestaurantsTab'), {
  loading: () => <p>Yükleniyor...</p>,
});

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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Kullanıcı bilgilerini al
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }
        
        setUser(user);

        // Kullanıcının profil bilgilerini ve rol kontrolünü yap
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profile?.role !== 'admin') {
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Admin kontrolü hatası:', error);
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Bu sayfaya erişim yetkiniz bulunmamaktadır.'}
          </Alert>
          <Button variant="contained" onClick={() => router.push('/')}>
            Ana Sayfaya Dön
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Admin Paneli
        </Typography>

        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Başvurular" />
            <Tab label="Restoranlar" />
            <Tab label="Kullanıcılar" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <RestaurantApplicationsTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <RestaurantsTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <AdminUsersTab />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 