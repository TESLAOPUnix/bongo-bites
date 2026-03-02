import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

export default function BestsellerProducts() {
  const { data, isLoading } = useProducts({ sort: 'bestseller', per_page: 12 });
  const products = data?.data || [];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Bestselling Products</h2>
            <p className="text-muted-foreground">Our customers' favorite Bengali delicacies</p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex">
            <Button variant="ghost" className="gap-2">View All<ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop"><Button variant="outline" className="gap-2">View All Products<ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
