import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useCategories } from '@/hooks/useProducts';
import { CATEGORIES } from '@/data/categories';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';

export default function FeaturedCategories() {
  const { data: apiCategories, isLoading } = useCategories();

  // Use API data if available, otherwise fall back to static list
  const categories = apiCategories || CATEGORIES.map((c, i) => ({
    id: String(i + 1),
    name: c.name,
    slug: c.slug,
    image: '',
    description: '',
    product_count: 0,
  }));

  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Explore Categories</h2>
            <p className="text-muted-foreground">Discover our range of authentic Bengali products</p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex">
            <Button variant="ghost" className="gap-2">View All<ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop"><Button variant="outline" className="gap-2">View All Categories<ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
