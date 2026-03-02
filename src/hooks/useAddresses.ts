import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services/addressService';
import type { Address } from '@/types';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressService.getAll(),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Address, 'id'>) => addressService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) => addressService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
}
