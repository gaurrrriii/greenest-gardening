import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  nursery_id: string | null;
  price: number;
  stock: number;
  plant_type: string;
  image_url: string;
  care_instructions: string;
  description: string;
  featured: boolean;
  rating: number;
};

export type Nursery = {
  id: string;
  name: string;
  city: string;
  description: string;
  verified: boolean;
  rating: number;
};

export type Gardener = {
  id: string;
  name: string;
  city: string;
  specialties: string;
  bio: string;
  avatar_url: string;
  rating: number;
  years_experience: number;
  verified: boolean;
};

export type Service = {
  id: string;
  gardener_id: string;
  name: string;
  description: string;
  price: number;
  duration_mins: number;
};

export type ServiceWithGardener = Service & {
  gardener: Gardener;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_address: string;
  city: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};

export type Booking = {
  id: string;
  user_id: string;
  service_id: string;
  gardener_name: string;
  service_name: string;
  service_price: number;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  city: string;
  status: string;
  notes: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  role: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
