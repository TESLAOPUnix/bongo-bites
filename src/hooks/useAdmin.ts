import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { orderService } from '@/services/orderService';
import { wishlistService } from '@/services/wishlistService';
import type { Product, Blog } from '@/types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
  });
}

export function useAdminProducts(page = 1) {
  return useQuery({
    queryKey: ['admin', 'products', page],
    queryFn: () => adminService.getProducts(page),
  });
}

export function useAdminOrders(page = 1) {
  return useQuery({
    queryKey: ['admin', 'orders', page],
    queryFn: () => orderService.adminGetAll(page),
  });
}

export function useAdminWishlistStats() {
  return useQuery({
    queryKey: ['admin', 'wishlist-stats'],
    queryFn: () => wishlistService.getStats(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => adminService.createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => adminService.updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  });
}

// ===== Blog Hooks =====

export function useAdminBlogs(page = 1) {
  return useQuery({
    queryKey: ['admin', 'blogs', page],
    queryFn: () => adminService.getBlogs(page),
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Blog>) => adminService.createBlog(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Blog> }) => adminService.updateBlog(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteBlog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] }),
  });
}
