import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminOrders } from '@/hooks/useOrders';
import { useWishlistStats } from '@/hooks/useWishlist';
import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart, Package, IndianRupee, TrendingUp, Clock, Truck,
  CheckCircle, AlertTriangle, Calendar, Box, Users, Heart,
} from 'lucide-react';

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'outline', label: 'Pending' },
    confirmed: { variant: 'secondary', label: 'Confirmed' },
    processing: { variant: 'secondary', label: 'Processing' },
    shipped: { variant: 'default', label: 'Shipped' },
    delivered: { variant: 'default', label: 'Delivered' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminDashboard() {
  const { data: stats } = useAdminStats();
  const { data: orders } = useAdminOrders();
  const { data: wishlistStats } = useWishlistStats();

  const recentOrders = (orders || []).slice(0, 5);
  const formatCurrency = (v: number) => `₹${v.toLocaleString('en-IN')}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingCart} />
        <StatCard title="Orders Today" value={stats?.ordersToday ?? 0} icon={Calendar} />
        <StatCard title="Orders This Month" value={stats?.ordersThisMonth ?? 0} icon={TrendingUp} />
        <StatCard title="Fulfilled Orders" value={stats?.fulfilledOrders ?? 0} icon={CheckCircle} />
        <StatCard title="Pending Orders" value={stats?.pendingOrders ?? 0} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="In Delivery" value={stats?.inDelivery ?? 0} icon={Truck} />
        <StatCard title="Total Revenue" value={formatCurrency(stats?.totalRevenue ?? 0)} icon={IndianRupee} />
        <StatCard title="Revenue This Month" value={formatCurrency(stats?.revenueThisMonth ?? 0)} icon={IndianRupee} />
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
        <StatCard title="Out of Stock" value={stats?.outOfStock ?? 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Box className="h-5 w-5" />Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-3 px-4">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Most Wishlisted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" />Most Wishlisted Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(wishlistStats || []).slice(0, 5).map((item: any) => (
                <div key={item.product_id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium text-sm">{item.product_name}</span>
                  <Badge variant="secondary">{item.wishlist_count} ♥</Badge>
                </div>
              ))}
              {(wishlistStats || []).length === 0 && (
                <p className="text-center text-muted-foreground py-4">No wishlist data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
      </div>
    </div>
  );
}
