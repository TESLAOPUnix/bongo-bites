import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getAll(),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orderService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}
