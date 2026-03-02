import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Order, OrderItem, Address } from '@/types/database';

export interface UIOrder extends Order {
  items?: OrderItem[];
  address?: Address;
}

// ---- User Queries ----

export function useUserOrders() {
  const { user } = useAuth();
  return useQuery<UIOrder[]>({
    queryKey: ['user-orders', user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured || !user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), address:addresses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as UIOrder[];
    },
    enabled: !!user && isSupabaseConfigured,
  });
}

export function useOrder(orderId: string) {
  const { user } = useAuth();
  return useQuery<UIOrder | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!isSupabaseConfigured || !orderId) return null;
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), address:addresses(*)')
        .eq('id', orderId)
        .single();
      if (error) return null;
      return data as UIOrder;
    },
    enabled: !!orderId && isSupabaseConfigured,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (payload: {
      addressId: string;
      items: { productId: string; quantity: number; price: number; name: string }[];
      paymentMethod?: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');
      const totalAmount = payload.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          address_id: payload.addressId,
          total_amount: totalAmount,
          payment_method: payload.paymentMethod || null,
          notes: payload.notes || null,
        })
        .select()
        .single();
      if (error) throw error;

      const orderItems = payload.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_snapshot: item.price,
        product_name_snapshot: item.name,
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      return order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user-orders'] });
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}

// ---- Admin Queries ----

export function useAdminOrders() {
  return useQuery<UIOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*), address:addresses(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as UIOrder[];
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      qc.invalidateQueries({ queryKey: ['user-orders'] });
      qc.invalidateQueries({ queryKey: ['order'] });
    },
  });
}

export function useCreateManualOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      userId?: string;
      addressId?: string;
      items: { productId: string; quantity: number; price: number; name: string }[];
      paymentMethod?: string;
      paymentStatus?: string;
      notes?: string;
    }) => {
      const totalAmount = payload.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: payload.userId || null,
          address_id: payload.addressId || null,
          total_amount: totalAmount,
          payment_method: payload.paymentMethod || null,
          payment_status: payload.paymentStatus || 'pending',
          notes: payload.notes || null,
        })
        .select()
        .single();
      if (error) throw error;

      const orderItems = payload.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_snapshot: item.price,
        product_name_snapshot: item.name,
      }));
      await supabase.from('order_items').insert(orderItems);
      return order;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
}
