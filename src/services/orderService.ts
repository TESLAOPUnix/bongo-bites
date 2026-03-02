import { apiClient } from '@/lib/apiClient';
import type { Order, PaginatedResponse } from '@/types';

export const orderService = {
  // User endpoints
  create: (data: { items: { product_id: string; quantity: number }[]; address_id: string }) =>
    apiClient.post<Order>('/api/orders', data),

  getAll: () =>
    apiClient.get<Order[]>('/api/orders'),

  getById: (id: string) =>
    apiClient.get<Order>(`/api/orders/${id}`),

  // Admin endpoints
  adminGetAll: (page = 1) =>
    apiClient.get<PaginatedResponse<Order>>('/api/admin/orders', { page }),

  adminGetById: (id: string) =>
    apiClient.get<Order>(`/api/admin/orders/${id}`),

  adminCreateManual: (data: Record<string, unknown>) =>
    apiClient.post<Order>('/api/admin/orders/manual', data),

  adminUpdateStatus: (id: string, status: string) =>
    apiClient.put<Order>(`/api/admin/orders/${id}`, { status }),
};
