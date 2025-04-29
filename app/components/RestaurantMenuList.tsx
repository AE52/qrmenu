'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CloseIcon from '@mui/icons-material/Close';
import QRCode from 'react-qr-code';
// import { formatCurrency } from '../lib/utils'; // Bu import hata verdiği için yorumlandı

// Tip tanımlamaları
type RestaurantMenuItem = {
  restaurant_id: string;
  restaurant_name: string;
  restaurant_description: string;
  restaurant_address: string;
  restaurant_phone: string;
  restaurant_logo_url: string | null;
  category_id: string;
  category_name: string;
  category_description: string | null;
  category_image_url: string | null;
  product_id: string;
  product_name: string;
  product_description: string | null;
  product_price: number;
  product_image_url: string | null;
  product_is_featured: boolean;
};

// Kategoriye göre gruplandırılmış ürün tipi
type GroupedByCategory = {
  [key: string]: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    products: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      image_url: string | null;
      is_featured: boolean;
    }[];
  };
};

// Restorana göre gruplandırılmış veri tipi
type GroupedByRestaurant = {
  [key: string]: {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    logo_url: string | null;
    categories: GroupedByCategory;
  };
};

export default function RestaurantMenuList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<GroupedByRestaurant>({});
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [currentQrRestaurant, setCurrentQrRestaurant] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        
        // Tüm restoran menülerini getiren fonksiyonu çağır
        const { data, error } = await supabase.rpc('get_all_restaurant_menus');
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setError('Listelenecek menü bulunamadı.');
          setLoading(false);
          return;
        }
        
        // Verileri restoranlara göre grupla
        const groupedData = groupMenuItemsByRestaurant(data);
        setRestaurants(groupedData);
        
        // İlk restoranı otomatik olarak seç
        const firstRestaurantId = Object.keys(groupedData)[0];
        setSelectedRestaurantId(firstRestaurantId);
        
      } catch (error: any) {
        console.error('Menü verilerini alma hatası:', error);
        setError(`Menü bilgileri yüklenirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Verileri restoranlara göre gruplandırma fonksiyonu
  function groupMenuItemsByRestaurant(items: RestaurantMenuItem[]): GroupedByRestaurant {
    const grouped: GroupedByRestaurant = {};
    
    items.forEach(item => {
      // Restoran daha önce eklenmemişse ekle
      if (!grouped[item.restaurant_id]) {
        grouped[item.restaurant_id] = {
          id: item.restaurant_id,
          name: item.restaurant_name,
          description: item.restaurant_description,
          address: item.restaurant_address,
          phone: item.restaurant_phone,
          logo_url: item.restaurant_logo_url,
          categories: {}
        };
      }
      
      // Kategori daha önce eklenmemişse ekle
      if (!grouped[item.restaurant_id].categories[item.category_id]) {
        grouped[item.restaurant_id].categories[item.category_id] = {
          id: item.category_id,
          name: item.category_name,
          description: item.category_description,
          image_url: item.category_image_url,
          products: []
        };
      }
      
      // Ürünü kategoriye ekle
      grouped[item.restaurant_id].categories[item.category_id].products.push({
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
        image_url: item.product_image_url,
        is_featured: item.product_is_featured
      });
    });
    
    return grouped;
  }

  const handleRestaurantChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedRestaurantId(newValue);
  };

  const handleOpenQrDialog = (restaurantId: string, restaurantName: string) => {
    setCurrentQrRestaurant({id: restaurantId, name: restaurantName});
    setQrDialogOpen(true);
  };

  const handleCloseQrDialog = () => {
    setQrDialogOpen(false);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Menü bilgileri yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  const restaurantIds = Object.keys(restaurants);
  
  if (restaurantIds.length === 0) {
    return (
      <Container>
        <Box sx={{ my: 4 }}>
          <Alert severity="info">Henüz hiç menü bulunmuyor.</Alert>
        </Box>
      </Container>
    );
  }

  const selectedRestaurant = selectedRestaurantId ? restaurants[selectedRestaurantId] : null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          <RestaurantIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Sistemdeki Restoranlar ve Menüleri
        </Typography>
        
        <Paper elevation={3} sx={{ mb: 4 }}>
          <Tabs
            value={selectedRestaurantId}
            onChange={handleRestaurantChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {restaurantIds.map(restaurantId => (
              <Tab 
                key={restaurantId} 
                value={restaurantId} 
                label={restaurants[restaurantId].name} 
                icon={<LocalDiningIcon />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {selectedRestaurant && (
          <Box>
            <Card sx={{ mb: 4 }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedRestaurant.logo_url && (
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, mr: 2, borderRadius: '8px' }}
                      image={selectedRestaurant.logo_url}
                      alt={selectedRestaurant.name}
                    />
                  )}
                  <Box>
                    <Typography variant="h5" component="div">
                      {selectedRestaurant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedRestaurant.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Adres:</strong> {selectedRestaurant.address}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Telefon:</strong> {selectedRestaurant.phone}
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<QrCodeIcon />}
                  onClick={() => handleOpenQrDialog(selectedRestaurant.id, selectedRestaurant.name)}
                  sx={{ minWidth: '120px', height: '40px' }}
                >
                  QR Kod
                </Button>
              </Box>
            </Card>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                <LunchDiningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Öne Çıkan Ürünler
              </Typography>
              
              <Grid container spacing={3}>
                {Object.values(selectedRestaurant.categories).flatMap(category => 
                  category.products.filter(product => product.is_featured).map(product => (
                    // @ts-ignore 
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {product.image_url && (
                          <CardMedia
                            component="img"
                            height="140"
                            image={product.image_url}
                            alt={product.name}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="div">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.description}
                          </Typography>
                          <Chip 
                            // label={formatCurrency(product.price)} // formatCurrency fonksiyonu bulunamadığı için yorumlandı
                            label={`${product.price} TL`} // Geçici olarak para birimi eklendi
                            color="primary" 
                            variant="outlined" 
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
                
                {Object.values(selectedRestaurant.categories).flatMap(category => 
                  category.products.filter(product => product.is_featured)).length === 0 && (
                  // @ts-ignore 
                  <Grid item xs={12}>
                    <Alert severity="info">Bu restoran için öne çıkan ürün bulunmuyor.</Alert>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom>
                <LunchDiningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Kategoriler ve Ürünler
              </Typography>
              
              {Object.values(selectedRestaurant.categories).map(category => (
                <Accordion key={category.id} defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                      borderRadius: '4px 4px 0 0' 
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.image_url && (
                        <Box
                          component="img"
                          src={category.image_url}
                          alt={category.name}
                          sx={{ width: 50, height: 50, mr: 2, borderRadius: '4px' }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6">{category.name}</Typography>
                        {category.description && (
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                      {category.products.map((product) => (
                        <Box key={product.id}>
                          <ListItem alignItems="flex-start">
                            {product.image_url && (
                              <Box
                                component="img"
                                src={product.image_url}
                                alt={product.name}
                                sx={{ width: 80, height: 80, mr: 2, borderRadius: '4px' }}
                              />
                            )}
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" component="span">
                                    {product.name}
                                    {product.is_featured && (
                                      <Chip 
                                        label="Öne Çıkan" 
                                        size="small" 
                                        color="secondary" 
                                        sx={{ ml: 1, height: 20 }} 
                                      />
                                    )}
                                  </Typography>
                                  <Chip 
                                    // label={formatCurrency(product.price)} // formatCurrency fonksiyonu bulunamadığı için yorumlandı
                                    label={`${product.price} TL`} // Geçici olarak para birimi eklendi
                                    color="primary" 
                                  />
                                </Box>
                              }
                              secondary={product.description}
                            />
                          </ListItem>
                          <Divider component="li" />
                        </Box>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* QR Code Dialog */}
      <Dialog 
        open={qrDialogOpen} 
        onClose={handleCloseQrDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {currentQrRestaurant?.name} - QR Kod
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseQrDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 3,
              bgcolor: 'white' 
            }}
          >
            {currentQrRestaurant && (
              <>
                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, mb: 2 }}>
                  <QRCode 
                    value={`${window.location.origin}/menu/${currentQrRestaurant.id}`} 
                    size={250}
                    level="M"
                    fgColor="#000000"
                    bgColor="#FFFFFF"
                  />
                </Box>
                <Typography variant="body1" align="center">
                  Bu QR kodu akıllı telefonunuzla tarayarak {currentQrRestaurant.name} restoranının menüsüne doğrudan erişebilirsiniz.
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
} 