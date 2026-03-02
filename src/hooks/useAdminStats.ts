import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return {
          totalOrders: 0,
          ordersToday: 0,
          ordersThisMonth: 0,
          fulfilledOrders: 0,
          pendingOrders: 0,
          inDelivery: 0,
          totalRevenue: 0,
          revenueThisMonth: 0,
          totalProducts: 0,
          outOfStock: 0,
          totalUsers: 0,
        };
      }

      const today = new Date().toISOString().split('T')[0];
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [
        { count: totalOrders },
        { count: ordersToday },
        { count: ordersThisMonth },
        { count: fulfilledOrders },
        { count: pendingOrders },
        { count: inDelivery },
        { data: revenueData },
        { data: revenueMonthData },
        { count: totalProducts },
        { count: outOfStock },
        { count: totalUsers },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
        supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'shipped'),
        supabase.from('orders').select('total_amount'),
        supabase.from('orders').select('total_amount').gte('created_at', monthStart),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock', 0).eq('is_upcoming', false),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);

      const totalRevenue = (revenueData || []).reduce((sum: number, o: { total_amount: number }) => sum + Number(o.total_amount), 0);
      const revenueThisMonth = (revenueMonthData || []).reduce((sum: number, o: { total_amount: number }) => sum + Number(o.total_amount), 0);

      return {
        totalOrders: totalOrders || 0,
        ordersToday: ordersToday || 0,
        ordersThisMonth: ordersThisMonth || 0,
        fulfilledOrders: fulfilledOrders || 0,
        pendingOrders: pendingOrders || 0,
        inDelivery: inDelivery || 0,
        totalRevenue,
        revenueThisMonth,
        totalProducts: totalProducts || 0,
        outOfStock: outOfStock || 0,
        totalUsers: totalUsers || 0,
      };
    },
    staleTime: 30 * 1000,
  });
}
