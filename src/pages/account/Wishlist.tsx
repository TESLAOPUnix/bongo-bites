import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const { addToCart } = useCart();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="section-container section-padding text-center py-16">
          <Heart className="h-20 w-20 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold mb-3">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view your wishlist.</p>
          <Link to="/login"><Button size="lg">Sign In</Button></Link>
        </div>
      </Layout>
    );
  }

  const handleRemove = (productId: string) => {
    toggleWishlist.mutate({ productId, isWished: true });
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (item: typeof wishlistItems extends (infer T)[] ? T : never) => {
    if (!item || item.stockStatus !== 'in-stock') return;
    addToCart({
      id: item.id, name: item.name, price: item.price,
      originalPrice: item.originalPrice, image: item.image, category: item.category,
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <Layout>
      <SEOHead title="My Wishlist" description="Your saved products" />

      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link><span>/</span>
            <Link to="/account" className="breadcrumb-link">My Account</Link><span>/</span>
            <span className="text-foreground">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">My Wishlist</h1>

          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (wishlistItems || []).length > 0 ? (
            <div className="space-y-4">
              {(wishlistItems || []).map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
                  <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" loading="lazy" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="font-medium hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                      {item.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {item.stockStatus === 'in-stock' && (
                        <Button size="sm" onClick={() => handleAddToCart(item)} className="gap-2">
                          <ShoppingCart className="h-4 w-4" />Add to Cart
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleRemove(item.id)} className="text-destructive hover:text-destructive gap-2">
                        <Trash2 className="h-4 w-4" />Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-lg font-medium mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Browse products and save your favorites!</p>
              <Link to="/shop"><Button>Browse Products</Button></Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
