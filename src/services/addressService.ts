import { apiClient } from '@/lib/apiClient';
import type { Address } from '@/types';

export const addressService = {
  getAll: () =>
    apiClient.get<Address[]>('/api/account/addresses'),

  create: (data: Omit<Address, 'id'>) =>
    apiClient.post<Address>('/api/account/addresses', data),

  update: (id: string, data: Partial<Address>) =>
    apiClient.put<Address>(`/api/account/addresses/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/account/addresses/${id}`),
};
