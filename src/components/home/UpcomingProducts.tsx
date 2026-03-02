import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Clock } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';

export default function UpcomingProducts() {
  const { data, isLoading } = useProducts({ sort: 'newest', per_page: 6 });
  // Filter for upcoming products client-side (ideally backend would support this filter)
  const products = (data?.data || []).filter(p => p.stock_status === 'upcoming');

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="section-padding bg-accent/5">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">Coming Soon</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Upcoming Products</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Get notified when these exciting new products launch. Be the first to taste our latest Bengali delicacies!
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
