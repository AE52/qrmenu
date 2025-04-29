'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Container, Box, Typography, Card, CardContent, 
  Divider, Stack, Chip, CircularProgress, Paper,
  Tabs, Tab, List, ListItem, ListItemText, Avatar,
  Button, AppBar, Toolbar, Grid, CardActionArea, CardMedia
} from '@mui/material';
import { supabase, Restaurant, Category, Product } from '../../lib/supabase';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

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
      id={`menu-tabpanel-${index}`}
      aria-labelledby={`menu-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function RestaurantMenu() {
  const params = useParams();
  const restaurantId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Restoran bilgilerini al
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .eq('is_active', true)
          .single();

        if (restaurantError) throw restaurantError;
        
        if (!restaurantData) {
          setError('Menü bulunamadı veya bu menü aktif değil.');
          setLoading(false);
          return;
        }
        
        setRestaurant(restaurantData);
        
        // Kategorileri al
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_active', true)
          .order('order_num', { ascending: true });
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Ürünleri al
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true)
          .order('order_num', { ascending: true });
          
        if (productsError) throw productsError;
        setProducts(productsData || []);
        
      } catch (error) {
        console.error('Veri alma hatası:', error);
        setError('Menü bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products
      .filter(product => product.category_id === categoryId)
      .sort((a, b) => a.order_num - b.order_num);
  };

  const getFeaturedProducts = () => {
    return products
      .filter(product => product.is_featured)
      .sort((a, b) => a.order_num - b.order_num);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(to right, #FF5722, #FF9800)',
      }}>
        <Box sx={{ 
          p: 4, 
          borderRadius: 3, 
          bgcolor: 'white', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <CircularProgress sx={{ color: '#FF5722', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>Menü yükleniyor...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(to right, #FF5722, #FF9800)',
      }}>
        <Card sx={{ 
          maxWidth: 500, 
          width: '100%', 
          borderRadius: 3, 
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ bgcolor: '#f44336', p: 2 }}>
            <Typography variant="h6" color="white" textAlign="center">
              Hata
            </Typography>
          </Box>
          <CardContent>
            <Typography color="error" textAlign="center" paragraph>
              {error || 'Menü bulunamadı.'}
            </Typography>
            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => window.location.href = '/'}
              sx={{ mt: 2 }}
            >
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="sticky" sx={{ bgcolor: '#FF5722' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            fontWeight: 600
          }}>
            <RestaurantIcon />
            {restaurant.name}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ pt: 3, pb: 8 }}>
        {/* Restaurant Header Card */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {restaurant.banner_url && (
            <Box 
              sx={{ 
                height: 200, 
                width: '100%', 
                overflow: 'hidden', 
                position: 'relative'
              }}
            >
              <img 
                src={restaurant.banner_url} 
                alt={restaurant.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: '50%', 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2
                }}
              >
                <Typography variant="h4" color="white" fontWeight={600}>
                  {restaurant.name}
                </Typography>
              </Box>
            </Box>
          )}
          
          <CardContent sx={{ p: 3 }}>
            {!restaurant.banner_url && (
              <Typography variant="h4" gutterBottom fontWeight={600}>
                {restaurant.name}
              </Typography>
            )}
            
            {restaurant.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {restaurant.description}
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ my: 2 }}
              flexWrap="wrap"
            >
              {restaurant.address && (
                <Chip 
                  icon={<LocationOnIcon color="primary" />} 
                  label={restaurant.address} 
                  variant="outlined"
                  sx={{ borderRadius: 2, py: 0.5 }}
                />
              )}
              {restaurant.phone && (
                <Chip 
                  icon={<PhoneIcon color="primary" />} 
                  label={restaurant.phone} 
                  variant="outlined"
                  sx={{ borderRadius: 2, py: 0.5 }}
                />
              )}
              {restaurant.opening_hours && (
                <Chip 
                  icon={<AccessTimeIcon color="primary" />} 
                  label={restaurant.opening_hours} 
                  variant="outlined"
                  sx={{ borderRadius: 2, py: 0.5 }}
                />
              )}
            </Stack>
          </CardContent>
        </Card>
        
        {categories.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Typography variant="h6">Bu restoran için henüz menü oluşturulmamış.</Typography>
          </Paper>
        ) : (
          <Box 
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 3, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider', 
                bgcolor: '#FF5722',
                position: 'sticky',
                top: 64,
                zIndex: 1,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
                aria-label="menu categories"
                textColor="inherit"
                sx={{ 
                  '& .MuiTabs-indicator': { 
                    backgroundColor: 'white',
                    height: 3
                  },
                  '& .MuiTab-root': { 
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '1rem',
                    py: 2
                  },
                  '& .Mui-selected': { 
                    color: 'white', 
                    fontWeight: 600 
                  }
                }}
              >
                <Tab label="Öne Çıkanlar" icon={<StarIcon />} iconPosition="start" />
                {categories.map((category) => (
                  <Tab key={category.id} label={category.name} />
                ))}
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontWeight: 600,
                color: '#FF5722',
                mb: 3
              }}>
                <StarIcon sx={{ mr: 1 }} /> Öne Çıkan Ürünler
              </Typography>
              
              {getFeaturedProducts().length === 0 ? (
                <Typography textAlign="center" sx={{ p: 3, color: 'text.secondary' }}>
                  Öne çıkan ürün bulunmamaktadır.
                </Typography>
              ) : (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Öne Çıkan Ürünler
                  </Typography>
                  <Grid container spacing={2}>
                    {getFeaturedProducts().map((product) => (
                      // @ts-ignore
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card
                          elevation={0}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                          }}
                        >
                          {product.is_new && (
                            <Chip
                              label="Yeni"
                              color="primary"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 1,
                              }}
                            />
                          )}
                          <CardActionArea>
                            <CardMedia
                              component="img"
                              height="140"
                              image={product.image_url || "https://via.placeholder.com/300x200"}
                              alt={product.name}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography gutterBottom variant="h6" component="div">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {product.description}
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                {product.price.toFixed(2)} TL
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </TabPanel>
            
            {categories.map((category, index) => (
              <TabPanel key={category.id} value={tabValue} index={index + 1}>
                <Typography variant="h5" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: '#FF5722',
                  mb: 3
                }}>
                  {category.name}
                </Typography>
                
                {getProductsByCategory(category.id).length === 0 ? (
                  <Typography textAlign="center" sx={{ p: 3, color: 'text.secondary' }}>
                    Bu kategoride ürün bulunmamaktadır.
                  </Typography>
                ) : (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {category.name}
                    </Typography>
                    <Grid container spacing={2}>
                      {getProductsByCategory(category.id).map((product) => (
                        // @ts-ignore
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <Card
                            elevation={0}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              position: "relative",
                            }}
                          >
                            {product.is_new && (
                              <Chip
                                label="Yeni"
                                color="primary"
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  zIndex: 1,
                                }}
                              />
                            )}
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                height="140"
                                image={product.image_url || "https://via.placeholder.com/300x200"}
                                alt={product.name}
                              />
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                  {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {product.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                  {product.price.toFixed(2)} TL
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </TabPanel>
            ))}
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#FF5722', color: 'white', py: 3, mt: 'auto' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {restaurant.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Dijital QR Menü tarafından oluşturulmuştur
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2023 QR Menü Sistemi | Tüm Hakları Saklıdır
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 