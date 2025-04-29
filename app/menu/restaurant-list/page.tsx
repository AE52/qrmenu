import RestaurantMenuList from '../../components/RestaurantMenuList';

export const metadata = {
  title: 'Tüm Restoranlar, Menüleri ve QR Kodları | QR Menü',
  description: 'Sistemimizde kayıtlı olan tüm restoranlar, menüleri ve QR kodlarını keşfedin ve kolayca erişin.',
};

export default function RestaurantListPage() {
  return <RestaurantMenuList />;
} 