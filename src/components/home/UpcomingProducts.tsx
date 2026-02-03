import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { upcomingProducts } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

export default function UpcomingProducts() {
  if (upcomingProducts.length === 0) return null;

  return (
    <section className="section-padding bg-accent/5">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                Coming Soon
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">
              Upcoming Products
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Get notified when these exciting new products launch. Be the first to taste our latest Bengali delicacies!
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {upcomingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
