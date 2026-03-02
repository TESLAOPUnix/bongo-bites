import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { UIProduct } from './useProducts';

export function useWishlist() {
  const { user } = useAuth();
  return useQuery<UIProduct[]>({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !user) return [];
      const { data, error } = await supabase
        .from('wishlists')
        .select('product_id, products:product_id(*, category:categories(*), images:product_images(*))')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data || []).map((w: any) => {
        const p = w.products;
        if (!p) return null;
        const imgs = (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.image_url);
        const stockStatus = p.is_upcoming ? 'upcoming' : p.stock > 0 ? 'in-stock' : 'out-of-stock';
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.sale_price ?? p.price,
          originalPrice: p.sale_price ? p.price : undefined,
          category: p.category?.name || 'Uncategorized',
          categorySlug: p.category?.slug || 'uncategorized',
          image: imgs[0] || '/placeholder.svg',
          images: imgs.length > 0 ? imgs : ['/placeholder.svg'],
          description: p.description || '',
          stock: p.stock,
          stockStatus,
          isBestseller: p.is_bestseller,
          isNew: p.is_new,
          isUpcoming: p.is_upcoming,
          isVisible: p.is_visible,
        } as UIProduct;
      }).filter(Boolean) as UIProduct[];
    },
    enabled: !!user && isSupabaseConfigured,
  });
}

export function useWishlistIds() {
  const { user } = useAuth();
  return useQuery<Set<string>>({
    queryKey: ['wishlist-ids', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !user) return new Set();
      const { data } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', user.id);
      return new Set((data || []).map((w: { product_id: string }) => w.product_id));
    },
    enabled: !!user && isSupabaseConfigured,
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ productId, isWished }: { productId: string; isWished: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      if (isWished) {
        await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      qc.invalidateQueries({ queryKey: ['wishlist-ids'] });
      qc.invalidateQueries({ queryKey: ['wishlist-stats'] });
    },
  });
}

export function useWishlistStats() {
  return useQuery({
    queryKey: ['wishlist-stats'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('wishlist_stats')
        .select('*')
        .gt('wishlist_count', 0)
        .order('wishlist_count', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });
}
