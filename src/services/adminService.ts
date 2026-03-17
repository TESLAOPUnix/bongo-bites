import { apiClient } from '@/lib/apiClient';
import type { Product, Blog, DashboardStats, PaginatedResponse } from '@/types';

export const adminService = {
  getDashboard: () =>
    apiClient.get<DashboardStats>('/api/admin/dashboard'),

  // Products
  getProducts: (page = 1) =>
    apiClient.get<{ data: Product[]; total: number }>('/api/admin/products', { page }),

  createProduct: (data: Partial<Product>) =>
    apiClient.post<Product>('/api/admin/products', data),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/api/admin/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete<void>(`/api/admin/products/${id}`),

  // Blogs
  getBlogs: (page = 1) =>
    apiClient.get<PaginatedResponse<Blog>>('/api/admin/blogs', { page }),

  createBlog: (data: Partial<Blog>) =>
    apiClient.post<Blog>('/api/admin/blogs', data),

  updateBlog: (id: string, data: Partial<Blog>) =>
    apiClient.put<Blog>(`/api/admin/blogs/${id}`, data),

  deleteBlog: (id: string) =>
    apiClient.delete<void>(`/api/admin/blogs/${id}`),
};
