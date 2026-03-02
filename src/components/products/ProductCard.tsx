import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Bell } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockStatus !== 'in-stock') return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "You'll be notified!",
      description: `We'll let you know when "${product.name}" becomes available.`,
    });
  };

  const isAvailable = product.stockStatus === 'in-stock';
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const isUpcoming = product.stockStatus === 'upcoming';

  return (
    <Link to={`/product/${product.slug}`} className="product-card group block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'opacity-75' : ''
          }`}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isUpcoming && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
              Coming Soon
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
              Out of Stock
            </span>
          )}
          {product.isBestseller && isAvailable && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              Bestseller
            </span>
          )}
          {product.isNew && isAvailable && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-accent text-accent-foreground">
              New
            </span>
          )}
          {discountPercentage > 0 && isAvailable && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-destructive text-destructive-foreground">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">Out of Stock</span>
          </div>
        )}

        {/* Quick Add / Notify Button */}
        {isAvailable ? (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full touch-target shadow-lg"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <Button
              onClick={handleNotifyMe}
              variant="outline"
              className="w-full touch-target shadow-lg bg-background"
              size="sm"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notify Me
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
        
        {/* Title */}
        <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating - Only show if reviews exist */}
        {product.rating && product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          {isUpcoming ? (
            <span className="text-sm text-muted-foreground">Price TBD</span>
          ) : (
            <>
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
