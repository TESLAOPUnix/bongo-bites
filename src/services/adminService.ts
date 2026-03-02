import { apiClient } from '@/lib/apiClient';
import type { Product, DashboardStats } from '@/types';

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
};
