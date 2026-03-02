import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';
import { categories as staticCategories } from '@/data/products';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useCategories();

  const displayCategories = isSupabaseConfigured
    ? (categories || [])
    : staticCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image,
        description: c.description,
        productCount: c.productCount,
      }));

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Explore Categories
            </h2>
            <p className="text-muted-foreground">
              Discover our range of authentic Bengali products
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayCategories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop">
            <Button variant="outline" className="gap-2">
              View All Categories
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
