import { apiClient } from '@/lib/apiClient';
import type { WishlistItem, WishlistStats } from '@/types';

export const wishlistService = {
  getAll: () =>
    apiClient.get<WishlistItem[]>('/api/wishlist'),

  add: (productId: string) =>
    apiClient.post<WishlistItem>('/api/wishlist/add', { product_id: productId }),

  remove: (productId: string) =>
    apiClient.delete<void>(`/api/wishlist/remove`),

  // Admin
  getStats: () =>
    apiClient.get<WishlistStats[]>('/api/admin/wishlist/stats'),
};
