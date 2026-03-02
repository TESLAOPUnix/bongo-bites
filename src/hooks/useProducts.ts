import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product, Category, ProductImage } from '@/types/database';

// ---------- public product type for UI ----------
export interface UIProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  categoryId?: string;
  image: string;
  images: string[];
  description: string;
  weight?: string;
  sizeOrDimensions?: string;
  sku?: string;
  stock: number;
  keywords?: string[];
  stockStatus: 'in-stock' | 'out-of-stock' | 'upcoming';
  isBestseller: boolean;
  isNew: boolean;
  isUpcoming: boolean;
  isVisible: boolean;
  purchasePrice?: number;
  salePrice?: number;
  createdAt?: string;
}

export interface UICategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

function mapProduct(p: Product & { category?: Category; images?: ProductImage[] }): UIProduct {
  const stockStatus: UIProduct['stockStatus'] =
    p.is_upcoming ? 'upcoming' : p.stock > 0 ? 'in-stock' : 'out-of-stock';

  const imgs = (p.images || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.image_url);

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.sale_price ?? p.price,
    originalPrice: p.sale_price ? p.price : undefined,
    category: p.category?.name || 'Uncategorized',
    categorySlug: p.category?.slug || 'uncategorized',
    categoryId: p.category_id || undefined,
    image: imgs[0] || '/placeholder.svg',
    images: imgs.length > 0 ? imgs : ['/placeholder.svg'],
    description: p.description || '',
    weight: p.weight || undefined,
    sizeOrDimensions: p.size_or_dimensions || undefined,
    sku: p.sku || undefined,
    stock: p.stock,
    keywords: p.keywords || undefined,
    stockStatus,
    isBestseller: p.is_bestseller,
    isNew: p.is_new,
    isUpcoming: p.is_upcoming,
    isVisible: p.is_visible,
    purchasePrice: p.purchase_price ?? undefined,
    salePrice: p.sale_price ?? undefined,
    createdAt: p.created_at,
  };
}

// ---- Queries ----

export function useCategories() {
  return useQuery<UICategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;

      // Get product counts per category
      const { data: counts } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_visible', true);

      const countMap: Record<string, number> = {};
      (counts || []).forEach((p: { category_id: string | null }) => {
        if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
      });

      return (data || []).map((c: Category) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        description: c.description || '',
        productCount: countMap[c.id] || 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(opts?: { categorySlug?: string; visible?: boolean }) {
  return useQuery<UIProduct[]>({
    queryKey: ['products', opts?.categorySlug, opts?.visible],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      let query = supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .order('created_at', { ascending: false });

      if (opts?.visible !== false) {
        query = query.eq('is_visible', true);
      }

      if (opts?.categorySlug) {
        // first get category id
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', opts.categorySlug)
          .single();
        if (cat) {
          query = query.eq('category_id', cat.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery<UIProduct | null>({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!isSupabaseConfigured || !slug) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('slug', slug)
        .single();
      if (error) return null;
      return mapProduct(data);
    },
    enabled: !!slug,
  });
}

export function useBestsellers() {
  return useQuery<UIProduct[]>({
    queryKey: ['bestsellers'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_visible', true)
        .eq('is_bestseller', true)
        .limit(12);
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingProducts() {
  return useQuery<UIProduct[]>({
    queryKey: ['upcoming-products'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('is_visible', true)
        .eq('is_upcoming', true);
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ---- Admin Mutations ----

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      product: Partial<Product>;
      imageUrls: { url: string; alt: string }[];
    }) => {
      const { data, error } = await supabase
        .from('products')
        .insert(payload.product)
        .select()
        .single();
      if (error) throw error;

      if (payload.imageUrls.length > 0) {
        const images = payload.imageUrls.map((img, i) => ({
          product_id: data.id,
          image_url: img.url,
          alt_text: img.alt || null,
          sort_order: i,
        }));
        const { error: imgErr } = await supabase.from('product_images').insert(images);
        if (imgErr) throw imgErr;
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['bestsellers'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      product: Partial<Product>;
      imageUrls?: { url: string; alt: string }[];
    }) => {
      const { error } = await supabase
        .from('products')
        .update(payload.product)
        .eq('id', payload.id);
      if (error) throw error;

      if (payload.imageUrls) {
        // delete existing images and re-insert
        await supabase.from('product_images').delete().eq('product_id', payload.id);
        if (payload.imageUrls.length > 0) {
          const images = payload.imageUrls.map((img, i) => ({
            product_id: payload.id,
            image_url: img.url,
            alt_text: img.alt || null,
            sort_order: i,
          }));
          await supabase.from('product_images').insert(images);
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['bestsellers'] });
      qc.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useToggleProductVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isVisible }: { id: string; isVisible: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_visible: isVisible })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
