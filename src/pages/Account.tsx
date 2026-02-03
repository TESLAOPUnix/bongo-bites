import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Account() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="section-container section-padding">
          <div className="max-w-md mx-auto text-center py-16">
            <User className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold mb-3">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your account details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      icon: User,
      title: 'Profile Information',
      description: 'Update your name and email',
      href: '/account/profile',
    },
    {
      icon: Package,
      title: 'Order History',
      description: 'View your past orders',
      href: '/account/orders',
    },
    {
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage your delivery addresses',
      href: '/account/addresses',
    },
  ];

  // Mock orders for display
  const recentOrders = [
    { id: 'ORD001', date: '2024-01-15', status: 'Delivered', total: 856 },
    { id: 'ORD002', date: '2024-01-08', status: 'Shipped', total: 1245 },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <span className="text-foreground">My Account</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">My Account</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}!
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Menu */}
            <div className="space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display text-lg font-semibold mb-4">Recent Orders</h2>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered'
                              ? 'bg-success/10 text-success'
                              : 'bg-accent/10 text-accent-foreground'
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="text-sm font-medium mt-1">₹{order.total}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/account/orders" className="text-sm text-primary hover:underline">
                    View All Orders →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No orders yet</p>
                  <Link to="/shop" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
