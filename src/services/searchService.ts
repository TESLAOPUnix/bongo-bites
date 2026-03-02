import { apiClient } from '@/lib/apiClient';
import type { SearchResult, DeliveryCheck } from '@/types';

export const searchService = {
  search: (query: string) =>
    apiClient.get<SearchResult>('/api/search', { q: query }),

  checkDelivery: (pincode: string) =>
    apiClient.get<DeliveryCheck>('/api/delivery/check', { pincode }),
};
