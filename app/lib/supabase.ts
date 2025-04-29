import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Role = 'admin' | 'user';

export type Restaurant = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  banner_url?: string | null;
  address: string | null;
  phone: string | null;
  opening_hours?: string | null;
  user_id: string;
  is_active: boolean;
  pending_approval: boolean;
};

export type Category = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  restaurant_id: string;
  order_num: number;
  is_active: boolean;
  image_url: string | null;
};

export type Product = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string;
  restaurant_id: string;
  is_available: boolean;
  order_num: number;
  is_featured: boolean;
  is_new?: boolean;
};

export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  role?: Role;
};

export type RestaurantApplication = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  logo: File | null;
  logo_url: string | null;
  address: string;
  phone: string;
  email: string;
  owner_name: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  user_id: string | null;
}; 