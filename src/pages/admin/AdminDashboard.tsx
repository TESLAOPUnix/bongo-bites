import { StatCard } from '@/components/admin/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/products';
import {
  ShoppingCart,
  Package,
  IndianRupee,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Box,
} from 'lucide-react';

// Mock order data
const mockOrders = [
  { id: 'ORD-001', customer: 'Amit Kumar', total: 1250, status: 'delivered', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Priya Sharma', total: 890, status: 'shipped', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Rajesh Das', total: 2100, status: 'pending', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Sunita Roy', total: 450, status: 'delivered', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Vikram Sen', total: 1680, status: 'processing', date: '2024-01-13' },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
    pending: { variant: 'outline', label: 'Pending' },
    processing: { variant: 'secondary', label: 'Processing' },
    shipped: { variant: 'default', label: 'Shipped' },
    delivered: { variant: 'default', label: 'Delivered' },
  };
  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminDashboard() {
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stockStatus === 'out-of-stock').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value="156"
          icon={ShoppingCart}
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Orders Today"
          value="8"
          icon={Calendar}
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Orders This Month"
          value="45"
          icon={TrendingUp}
          change={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Fulfilled Orders"
          value="142"
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Orders"
          value="14"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="In Delivery"
          value="9"
          icon={Truck}
        />
        <StatCard
          title="Total Revenue"
          value="₹1,45,890"
          icon={IndianRupee}
          change={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Revenue This Month"
          value="₹32,450"
          icon={IndianRupee}
          change={{ value: 3, isPositive: false }}
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          icon={AlertTriangle}
        />
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">₹{order.total}</td>
                    <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
