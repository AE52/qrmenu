'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon } from '@mui/material';
import { supabase } from '../lib/supabase';
import LoginDialog from './LoginDialog';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CampaignIcon from '@mui/icons-material/Campaign';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isMenuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      checkAdminStatus(session?.user?.id);
    });

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      checkAdminStatus(user?.id);
    };

    getUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Admin rolü kontrolü hatası:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Admin rolü kontrolü hatası:', error);
      setIsAdmin(false);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await supabase.auth.signOut();
    setUser(null);
    if (pathname.startsWith('/dashboard')) {
      window.location.href = '/';
    }
  };

  const handleDashboardClick = () => {
    handleMenuClose();
    window.location.href = '/dashboard';
  };

  const handleAdminClick = () => {
    handleMenuClose();
    window.location.href = '/dashboard/admin';
  };

  const handleRestaurantApplicationClick = () => {
    router.push('/restaurant-application');
  };

  const handleAdvertiserApplicationClick = () => {
    router.push('/advertiser-application');
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontWeight: 'bold' 
            }}
            onClick={() => window.location.href = '/'}
          >
            QR MENÜ
          </Typography>
          
          {user ? (
            <>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button 
                  color="inherit" 
                  startIcon={<DashboardIcon />}
                  onClick={handleDashboardClick}
                >
                  Dashboard
                </Button>
                
                {isAdmin && (
                  <Button 
                    color="inherit" 
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={handleAdminClick}
                  >
                    Admin Panel
                  </Button>
                )}
              </Box>
              
              <IconButton
                onClick={handleMenuClick}
                size="small"
                aria-controls={isMenuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                color="inherit"
              >
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}
                >
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              
              <Menu
                anchorEl={menuAnchorEl}
                id="account-menu"
                open={isMenuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleDashboardClick}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  Dashboard
                </MenuItem>
                
                {isAdmin && (
                  <MenuItem onClick={handleAdminClick}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Admin Panel
                  </MenuItem>
                )}
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Çıkış Yap
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit"
                startIcon={<RestaurantIcon />}
                onClick={handleRestaurantApplicationClick}
                sx={{ mr: 1 }}
              >
                Restoran Başvurusu
              </Button>
              <Button 
                color="inherit"
                startIcon={<CampaignIcon />}
                onClick={handleAdvertiserApplicationClick}
                sx={{ mr: 1 }}
              >
                Reklam Veren
              </Button>
              <Button 
                color="inherit" 
                variant="outlined"
                onClick={handleLoginClick}
              >
                Giriş Yap
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <LoginDialog 
        open={loginDialogOpen} 
        onClose={handleLoginDialogClose} 
      />
    </>
  );
} 