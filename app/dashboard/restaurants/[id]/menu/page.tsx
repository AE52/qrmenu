'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, Box, Typography, Button, Card, CardContent, 
  Divider, Stack, Chip, TextField, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Accordion, AccordionSummary, AccordionDetails,
  MenuItem, InputAdornment, Paper, Tabs, Tab, Avatar
} from '@mui/material';
import { supabase, Restaurant, Category, Product } from '../../../../lib/supabase';
import { uploadImage } from '../../../../lib/storage-helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ImageIcon from '@mui/icons-material/Image';

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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function RestaurantMenu() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Kategori yönetimi
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    image_url: null as string | null
  });
  
  // Ürün yönetimi
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_featured: false,
    image: null as File | null,
    image_url: null as string | null
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kullanıcı kontrolü
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/');
          return;
        }
        
        // Restoran bilgilerini al
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .eq('user_id', user.id)
          .single();

        if (restaurantError) throw restaurantError;
        
        if (!restaurantData) {
          setError('Restoran bulunamadı veya bu restoranı görüntüleme yetkiniz yok.');
          setLoading(false);
          return;
        }
        
        setRestaurant(restaurantData);
        
        // Kategorileri al
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('order_num', { ascending: true });
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Ürünleri al
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('restaurant_id', restaurantId)
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
  }, [restaurantId, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Kategori işlemleri
  const handleCategoryDialogOpen = (category?: Category) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        image: null,
        image_url: category.image_url
      });
    } else {
      setSelectedCategory(null);
      setCategoryFormData({
        name: '',
        description: '',
        image: null,
        image_url: null
      });
    }
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files.length > 0) {
      setCategoryFormData({
        ...categoryFormData,
        image: files[0]
      });
    } else {
      setCategoryFormData({
        ...categoryFormData,
        [name]: value
      });
    }
  };

  const handleCategorySave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Eğer yeni bir resim yüklenmişse
      let imageUrl = categoryFormData.image_url;
      if (categoryFormData.image) {
        try {
          console.log('Kategori resmi yükleniyor...');
          imageUrl = await uploadImage(
            categoryFormData.image, 
            'category-images', 
            selectedCategory?.image_url
          );
          console.log('Kategori resmi başarıyla yüklendi:', imageUrl);
        } catch (err: any) {
          console.error('Kategori resmi yükleme hatası:', err);
          setError(`Resim yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
          setSaving(false);
          return;
        }
      }
      
      if (selectedCategory) {
        // Kategori güncelleme
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryFormData.name,
            description: categoryFormData.description || null,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCategory.id);

        if (error) throw error;
        
        // Yerel state'i güncelle
        setCategories(categories.map(cat => 
          cat.id === selectedCategory.id 
            ? { 
                ...cat, 
                name: categoryFormData.name, 
                description: categoryFormData.description || null,
                image_url: imageUrl,
                updated_at: new Date().toISOString()
              } 
            : cat
        ));
      } else {
        // Yeni kategori ekleme
        const maxOrderNum = categories.length > 0 
          ? Math.max(...categories.map(c => c.order_num)) 
          : 0;
          
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: categoryFormData.name,
            description: categoryFormData.description || null,
            image_url: imageUrl,
            restaurant_id: restaurantId,
            order_num: maxOrderNum + 1,
            is_active: true
          })
          .select();

        if (error) throw error;
        
        // Yerel state'e ekle
        if (data && data.length > 0) {
          setCategories([...categories, data[0]]);
        }
      }
      
      setCategoryDialogOpen(false);
    } catch (error: any) {
      console.error('Kategori kaydetme hatası:', error);
      setError(`Kategori kaydedilirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryDelete = async (categoryId: string) => {
    const confirmDelete = window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem, kategoriye ait tüm ürünleri de silecektir.');
    
    if (!confirmDelete) return;
    
    setSaving(true);
    
    try {
      // Önce kategoriye ait ürünleri sil
      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .eq('category_id', categoryId);
        
      if (productsError) throw productsError;
      
      // Kategoriyi sil
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      // Yerel state'ten kaldır
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setProducts(products.filter(prod => prod.category_id !== categoryId));
      
    } catch (error) {
      console.error('Kategori silme hatası:', error);
      setError('Kategori silinirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryOrderChange = async (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (
      (direction === 'up' && categoryIndex === 0) || 
      (direction === 'down' && categoryIndex === categories.length - 1)
    ) {
      return; // Sıralamada değişiklik yapılamaz
    }
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    
    // Swap order_num values
    const currentOrderNum = newCategories[categoryIndex].order_num;
    const targetOrderNum = newCategories[targetIndex].order_num;
    
    newCategories[categoryIndex] = { ...newCategories[categoryIndex], order_num: targetOrderNum };
    newCategories[targetIndex] = { ...newCategories[targetIndex], order_num: currentOrderNum };
    
    // Sort by order_num
    newCategories.sort((a, b) => a.order_num - b.order_num);
    
    setCategories(newCategories);
    
    // Update in database
    try {
      const updates = [
        { id: newCategories[categoryIndex].id, order_num: newCategories[categoryIndex].order_num },
        { id: newCategories[targetIndex].id, order_num: newCategories[targetIndex].order_num }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from('categories')
          .update({ order_num: update.order_num })
          .eq('id', update.id);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Kategori sıralama hatası:', error);
      setError('Kategori sıralaması güncellenirken bir hata oluştu.');
    }
  };

  // Ürün işlemleri
  const handleProductDialogOpen = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        category_id: product.category_id,
        is_featured: product.is_featured,
        image: null,
        image_url: product.image_url
      });
    } else {
      setSelectedProduct(null);
      setProductFormData({
        name: '',
        description: '',
        price: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        is_featured: false,
        image: null,
        image_url: null
      });
    }
    setProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setProductDialogOpen(false);
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'image' && files && files.length > 0) {
      setProductFormData({
        ...productFormData,
        image: files[0]
      });
    } else {
      setProductFormData({
        ...productFormData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleProductSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const price = parseFloat(productFormData.price);
      
      if (isNaN(price)) {
        setError('Lütfen geçerli bir fiyat girin.');
        setSaving(false);
        return;
      }
      
      // Eğer yeni bir resim yüklenmişse
      let imageUrl = productFormData.image_url;
      if (productFormData.image) {
        try {
          console.log('Ürün resmi yükleniyor...');
          imageUrl = await uploadImage(
            productFormData.image, 
            'product-images', 
            selectedProduct?.image_url
          );
          console.log('Ürün resmi başarıyla yüklendi:', imageUrl);
        } catch (err: any) {
          console.error('Ürün resmi yükleme hatası:', err);
          setError(`Resim yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
          setSaving(false);
          return;
        }
      }
      
      if (selectedProduct) {
        // Ürün güncelleme
        const { error } = await supabase
          .from('products')
          .update({
            name: productFormData.name,
            description: productFormData.description || null,
            price,
            category_id: productFormData.category_id,
            is_featured: productFormData.is_featured,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedProduct.id);

        if (error) throw error;
        
        // Yerel state'i güncelle
        setProducts(products.map(prod => 
          prod.id === selectedProduct.id 
            ? { 
                ...prod, 
                name: productFormData.name, 
                description: productFormData.description || null,
                price,
                category_id: productFormData.category_id,
                is_featured: productFormData.is_featured,
                image_url: imageUrl,
                updated_at: new Date().toISOString()
              } 
            : prod
        ));
      } else {
        // Kategorideki diğer ürünlerin maksimum sırasını bul
        const categoryProducts = products.filter(p => p.category_id === productFormData.category_id);
        const maxOrderNum = categoryProducts.length > 0 
          ? Math.max(...categoryProducts.map(p => p.order_num)) 
          : 0;
          
        // Yeni ürün ekleme
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: productFormData.name,
            description: productFormData.description || null,
            price,
            category_id: productFormData.category_id,
            restaurant_id: restaurantId,
            is_available: true,
            is_featured: productFormData.is_featured,
            image_url: imageUrl,
            order_num: maxOrderNum + 1
          })
          .select();

        if (error) throw error;
        
        // Yerel state'e ekle
        if (data && data.length > 0) {
          setProducts([...products, data[0]]);
        }
      }
      
      setProductDialogOpen(false);
    } catch (error: any) {
      console.error('Ürün kaydetme hatası:', error);
      setError(`Ürün kaydedilirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleProductDelete = async (productId: string) => {
    const confirmDelete = window.confirm('Bu ürünü silmek istediğinizden emin misiniz?');
    
    if (!confirmDelete) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      // Yerel state'ten kaldır
      setProducts(products.filter(prod => prod.id !== productId));
      
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      setError('Ürün silinirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleProductOrderChange = async (productId: string, direction: 'up' | 'down') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const categoryProducts = products
      .filter(p => p.category_id === product.category_id)
      .sort((a, b) => a.order_num - b.order_num);
    
    const productIndex = categoryProducts.findIndex(p => p.id === productId);
    
    if (
      (direction === 'up' && productIndex === 0) || 
      (direction === 'down' && productIndex === categoryProducts.length - 1)
    ) {
      return; // Sıralamada değişiklik yapılamaz
    }
    
    const targetIndex = direction === 'up' ? productIndex - 1 : productIndex + 1;
    
    // Swap order_num values
    const currentOrderNum = categoryProducts[productIndex].order_num;
    const targetOrderNum = categoryProducts[targetIndex].order_num;
    
    categoryProducts[productIndex] = { ...categoryProducts[productIndex], order_num: targetOrderNum };
    categoryProducts[targetIndex] = { ...categoryProducts[targetIndex], order_num: currentOrderNum };
    
    // Update local state
    const newProducts = [...products];
    const prodIndex = newProducts.findIndex(p => p.id === productId);
    const targetProdIndex = newProducts.findIndex(p => p.id === categoryProducts[targetIndex].id);
    
    newProducts[prodIndex] = { ...newProducts[prodIndex], order_num: targetOrderNum };
    newProducts[targetProdIndex] = { ...newProducts[targetProdIndex], order_num: currentOrderNum };
    
    setProducts(newProducts);
    
    // Update in database
    try {
      const updates = [
        { id: newProducts[prodIndex].id, order_num: newProducts[prodIndex].order_num },
        { id: newProducts[targetProdIndex].id, order_num: newProducts[targetProdIndex].order_num }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from('products')
          .update({ order_num: update.order_num })
          .eq('id', update.id);
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Ürün sıralama hatası:', error);
      setError('Ürün sıralaması güncellenirken bir hata oluştu.');
    }
  };

  const getProductsByCategory = (categoryId: string) => {
    return products
      .filter(product => product.category_id === categoryId)
      .sort((a, b) => a.order_num - b.order_num);
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
          onClick={() => router.push(`/dashboard/restaurants/${restaurantId}`)}
          sx={{ mb: 2 }}
        >
          Restorana Geri Dön
        </Button>
        
        <Typography variant="h4" sx={{ mb: 3 }}>
          {restaurant.name} - Menü Yönetimi
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="menu tabs"
          >
            <Tab label="Kategoriler" />
            <Tab label="Ürünler" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Kategoriler</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleCategoryDialogOpen()}
            >
              Yeni Kategori Ekle
            </Button>
          </Box>
          
          {categories.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Henüz kategori eklenmemiş. Menü oluşturmak için kategori eklemelisiniz.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleCategoryDialogOpen()}
              >
                İlk Kategoriyi Ekle
              </Button>
            </Paper>
          ) : (
            <List>
              {categories.map((category, index) => (
                <Card key={category.id} sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <DragIndicatorIcon color="action" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{category.name}</Typography>
                        {category.description && (
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          disabled={index === 0}
                          onClick={() => handleCategoryOrderChange(category.id, 'up')}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          disabled={index === categories.length - 1}
                          onClick={() => handleCategoryOrderChange(category.id, 'down')}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleCategoryDialogOpen(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleCategoryDelete(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Ürünler</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={() => handleProductDialogOpen()}
              disabled={categories.length === 0}
            >
              Yeni Ürün Ekle
            </Button>
          </Box>
          
          {categories.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                Ürün eklemek için önce kategori oluşturmalısınız.
              </Typography>
            </Paper>
          ) : products.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Henüz ürün eklenmemiş. Menüye ürün ekleyin.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={() => handleProductDialogOpen()}
              >
                İlk Ürünü Ekle
              </Button>
            </Paper>
          ) : (
            categories.map((category) => (
              <Accordion key={category.id} defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="h6">{category.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {getProductsByCategory(category.id).length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Bu kategoride henüz ürün yok.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setProductFormData({
                            ...productFormData,
                            category_id: category.id
                          });
                          handleProductDialogOpen();
                        }}
                      >
                        Ürün Ekle
                      </Button>
                    </Box>
                  ) : (
                    <List disablePadding>
                      {getProductsByCategory(category.id).map((product, index) => (
                        <Card key={product.id} sx={{ mb: 1 }}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <DragIndicatorIcon color="action" />
                              <Box sx={{ flexGrow: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="subtitle1">{product.name}</Typography>
                                  {product.is_featured && (
                                    <Chip size="small" color="primary" label="Öne Çıkan" />
                                  )}
                                </Stack>
                                {product.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                  </Typography>
                                )}
                                <Typography variant="body2" fontWeight="bold" color="primary" sx={{ mt: 0.5 }}>
                                  {product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                </Typography>
                              </Box>
                              <Stack direction="row" spacing={1}>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  disabled={index === 0}
                                  onClick={() => handleProductOrderChange(product.id, 'up')}
                                >
                                  <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  disabled={index === getProductsByCategory(category.id).length - 1}
                                  onClick={() => handleProductOrderChange(product.id, 'down')}
                                >
                                  <ArrowDownwardIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleProductDialogOpen(product)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleProductDelete(product.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </TabPanel>
        
        {/* Kategori Dialog */}
        <Dialog
          open={categoryDialogOpen}
          onClose={handleCategoryDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && (
                <Box sx={{ p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              )}
              <TextField
                name="name"
                label="Kategori Adı"
                fullWidth
                value={categoryFormData.name}
                onChange={handleCategoryInputChange}
                required
              />
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                value={categoryFormData.description}
                onChange={handleCategoryInputChange}
              />
              
              {/* Resim yükleme alanı */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Kategori Resmi
                </Typography>
                
                {categoryFormData.image_url && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <img 
                      src={categoryFormData.image_url} 
                      alt="Kategori Resmi"
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                    <IconButton 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                      onClick={() => setCategoryFormData({
                        ...categoryFormData,
                        image: null,
                        image_url: null
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Resim Seç
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={handleCategoryInputChange}
                  />
                </Button>
                
                {categoryFormData.image && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Seçilen dosya: {categoryFormData.image.name}
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCategoryDialogClose}>İptal</Button>
            <Button 
              onClick={handleCategorySave} 
              variant="contained" 
              disabled={!categoryFormData.name || saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Ürün Dialog */}
        <Dialog
          open={productDialogOpen}
          onClose={handleProductDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {error && (
                <Box sx={{ p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                </Box>
              )}
              <TextField
                name="name"
                label="Ürün Adı"
                fullWidth
                value={productFormData.name}
                onChange={handleProductInputChange}
                required
              />
              <TextField
                name="description"
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                value={productFormData.description}
                onChange={handleProductInputChange}
              />
              <TextField
                name="price"
                label="Fiyat"
                fullWidth
                type="number"
                value={productFormData.price}
                onChange={handleProductInputChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
              />
              <TextField
                name="category_id"
                label="Kategori"
                fullWidth
                select
                value={productFormData.category_id}
                onChange={handleProductInputChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Özellikler
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={productFormData.is_featured}
                    onChange={handleProductInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <Typography>Öne Çıkan Ürün</Typography>
                </Box>
              </Box>
              
              {/* Resim yükleme alanı */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Ürün Resmi
                </Typography>
                
                {productFormData.image_url && (
                  <Box sx={{ mb: 2, position: 'relative' }}>
                    <img 
                      src={productFormData.image_url} 
                      alt="Ürün Resmi"
                      style={{ 
                        width: '100%', 
                        maxHeight: '200px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                    <IconButton 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.7)',
                        }
                      }}
                      onClick={() => setProductFormData({
                        ...productFormData,
                        image: null,
                        image_url: null
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Resim Seç
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    hidden
                    onChange={handleProductInputChange}
                  />
                </Button>
                
                {productFormData.image && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    Seçilen dosya: {productFormData.image.name}
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProductDialogClose}>İptal</Button>
            <Button 
              onClick={handleProductSave} 
              variant="contained" 
              disabled={!productFormData.name || !productFormData.price || !productFormData.category_id || saving}
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 