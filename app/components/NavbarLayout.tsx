'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon, Container, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { supabase } from '../lib/supabase';
import LoginDialog from './LoginDialog';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarLayoutProps {
  children: ReactNode;
  hideNavbarOnPath?: string;
}

export default function NavbarLayout({ children, hideNavbarOnPath }: NavbarLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isMenuOpen = Boolean(menuAnchorEl);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Menüde navbar'ı gizlemek için
  const shouldHideNavbar = hideNavbarOnPath && pathname?.startsWith(hideNavbarOnPath);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
        fetchUserProfile(session.user.id);
      }
    });

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        checkAdminStatus(user.id);
        fetchUserProfile(user.id);
      }
    };

    getUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (data && data.full_name) {
        setProfileName(data.full_name);
      }
    } catch (error) {
      console.error('Profil bilgisi alma hatası:', error);
    }
  };

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
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    if (pathname?.startsWith('/dashboard')) {
      router.push('/');
    }
  };

  const handleDashboardClick = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    router.push('/dashboard');
  };

  const handleAdminClick = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    router.push('/dashboard/admin');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    router.push('/dashboard/profile');
  };

  const handleApplicationClick = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    router.push('/restaurant-application');
  };

  const handleAdvertiserApplicationClick = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    router.push('/advertiser-application');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {!shouldHideNavbar && (
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
              onClick={() => router.push('/')}
            >
              <RestaurantIcon />
              QR MENÜ
            </Typography>
            
            {user ? (
              <>
                {/* Desktop Menü */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {profileName || user.email}
                    </Typography>
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
                        {(profileName ? profileName.charAt(0) : user.email?.charAt(0) || 'U').toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Box>
                </Box>
                
                {/* Mobil Hamburger Menü */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton 
                    color="inherit" 
                    onClick={toggleMobileMenu}
                    edge="end"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
                
                {/* User Menu */}
                <Menu
                  anchorEl={menuAnchorEl}
                  id="account-menu"
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleProfileClick}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profilim
                  </MenuItem>
                
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
                {/* Desktop Menü */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                  <Button 
                    color="inherit"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleApplicationClick}
                  >
                    Restoran Başvurusu
                  </Button>
                  <Button 
                    color="inherit"
                    startIcon={<CampaignIcon />}
                    onClick={handleAdvertiserApplicationClick}
                  >
                    Reklam Veren Başvurusu
                  </Button>
                  <Button 
                    color="inherit" 
                    variant="outlined"
                    onClick={handleLoginClick}
                  >
                    Giriş Yap
                  </Button>
                </Box>
                
                {/* Mobil Hamburger Menü */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <Button 
                    color="inherit" 
                    variant="outlined"
                    onClick={handleLoginClick}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Giriş Yap
                  </Button>
                  <IconButton 
                    color="inherit" 
                    onClick={toggleMobileMenu}
                    edge="end"
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
      
      {/* Mobil Menü Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': { 
            width: '70%', 
            maxWidth: 300,
            boxSizing: 'border-box' 
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <RestaurantIcon />
            QR MENÜ
          </Typography>
          <IconButton onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {user ? (
            <>
              <ListItem button onClick={handleProfileClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profilim" />
              </ListItem>
              
              <ListItem button onClick={handleDashboardClick}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
              
              {isAdmin && (
                <ListItem button onClick={handleAdminClick}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItem>
              )}
              
              <Divider />
              
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Çıkış Yap" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button onClick={handleApplicationClick}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Restoran Başvurusu" />
              </ListItem>
              
              <ListItem button onClick={handleAdvertiserApplicationClick}>
                <ListItemIcon>
                  <CampaignIcon />
                </ListItemIcon>
                <ListItemText primary="Reklam Veren Başvurusu" />
              </ListItem>
              
              <Divider />
              
              <ListItem button onClick={handleLoginClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Giriş Yap" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      
      <LoginDialog 
        open={loginDialogOpen} 
        onClose={handleLoginDialogClose} 
      />
      
      <Box component="main">
        {children}
      </Box>
    </>
  );
} 