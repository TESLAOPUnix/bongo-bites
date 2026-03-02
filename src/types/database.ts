// TypeScript types matching the Supabase database schema

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  purchase_price: number | null;
  sku: string | null;
  stock: number;
  weight: string | null;
  size_or_dimensions: string | null;
  keywords: string[] | null;
  is_visible: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  is_upcoming: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: string | null;
  address_id: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
  address?: Address;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_snapshot: number;
  product_name_snapshot: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistStat {
  product_id: string;
  product_name: string;
  product_slug: string;
  wishlist_count: number;
}
