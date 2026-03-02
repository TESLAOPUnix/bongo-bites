import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = useUserOrders();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="section-container section-padding text-center py-16">
          <p className="text-muted-foreground mb-4">Please sign in to view your orders.</p>
          <Link to="/login"><Button>Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success';
      case 'shipped': return 'bg-primary/10 text-primary';
      case 'processing': case 'confirmed': return 'bg-accent/10 text-accent-foreground';
      case 'cancelled': case 'returned': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <Layout>
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link><span>/</span>
            <Link to="/account" className="breadcrumb-link">My Account</Link><span>/</span>
            <span className="text-foreground">Orders</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <Link to="/account" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />Back to Account
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Order History</h1>

          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
          ) : (orders || []).length > 0 ? (
            <div className="space-y-4">
              {(orders || []).map((order) => (
                <div key={order.id} className="p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Package className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)} • {(order.items || []).length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                      <p className="font-semibold">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  {/* Order items */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item) => (
                          <span key={item.id} className="text-xs bg-secondary px-2 py-1 rounded">
                            {item.product_name_snapshot} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Link to="/shop"><Button>Browse Products</Button></Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
