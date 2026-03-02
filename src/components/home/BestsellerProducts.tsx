import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBestsellers } from '@/hooks/useProducts';
import { bestsellers as staticBestsellers } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

export default function BestsellerProducts() {
  const { data: products, isLoading } = useBestsellers();

  // Fallback to static data if Supabase not configured
  const displayProducts = isSupabaseConfigured
    ? (products || [])
    : staticBestsellers.slice(0, 12).map((p) => ({
        ...p,
        image: p.image,
        images: p.images || [p.image],
        stock: p.stockStatus === 'in-stock' ? 1 : 0,
        isBestseller: p.isBestseller || false,
        isNew: p.isNew || false,
        isUpcoming: p.stockStatus === 'upcoming',
        isVisible: true,
        category: p.category,
        categorySlug: p.categorySlug,
        stockStatus: p.stockStatus as 'in-stock' | 'out-of-stock' | 'upcoming',
      }));

  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Bestselling Products
            </h2>
            <p className="text-muted-foreground">
              Our customers' favorite Bengali delicacies
            </p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex">
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading && isSupabaseConfigured ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop">
            <Button variant="outline" className="gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
