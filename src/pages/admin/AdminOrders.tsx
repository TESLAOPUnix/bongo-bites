import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Eye } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

export default function AdminOrders() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filtered = statusFilter === 'all' ? (orders || []) : (orders || []).filter((o) => o.status === statusFilter);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast({ title: 'Order status updated' });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline', confirmed: 'secondary', processing: 'secondary',
      shipped: 'default', delivered: 'default', cancelled: 'destructive', returned: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'} className="capitalize">{status}</Badge>;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage all orders ({(orders || []).length} total)</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <div className="bg-background rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-3 px-4 text-sm">{(order.items || []).length} items</td>
                    <td className="py-3 px-4 font-medium">₹{Number(order.total_amount).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4"><Badge variant="outline" className="capitalize">{order.payment_status}</Badge></td>
                    <td className="py-3 px-4">
                      <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">{getStatusBadge(order.status)}</SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(order.created_at)}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No orders found</div>
          )}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Order Details</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Order ID:</span><p className="font-mono">{selectedOrder.id.slice(0, 8).toUpperCase()}</p></div>
                <div><span className="text-muted-foreground">Date:</span><p>{formatDate(selectedOrder.created_at)}</p></div>
                <div><span className="text-muted-foreground">Status:</span><p className="capitalize">{selectedOrder.status}</p></div>
                <div><span className="text-muted-foreground">Payment:</span><p className="capitalize">{selectedOrder.payment_status}</p></div>
                <div><span className="text-muted-foreground">Total:</span><p className="font-bold">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p></div>
                {selectedOrder.notes && <div className="col-span-2"><span className="text-muted-foreground">Notes:</span><p>{selectedOrder.notes}</p></div>}
              </div>
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm bg-muted/50 p-2 rounded">
                        <span>{item.product_name_snapshot} × {item.quantity}</span>
                        <span>₹{Number(item.price_snapshot * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedOrder.address && (
                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.address.name}, {selectedOrder.address.address_line1}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
