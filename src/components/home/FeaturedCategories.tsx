import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';
import CategoryCard from '@/components/products/CategoryCard';
import { Button } from '@/components/ui/button';

export default function FeaturedCategories() {
  return (
    <section className="section-padding">
      <div className="section-container">
        {/* Header */}
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

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Mobile View All */}
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
