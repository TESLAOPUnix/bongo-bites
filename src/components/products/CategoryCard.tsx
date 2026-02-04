import { Link } from 'react-router-dom';
import { Category } from '@/data/products';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      to={`/category/${category.slug}`} 
      className="category-card group block hover:-translate-y-2 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent group-hover:from-foreground/90 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <h3 className="font-display font-semibold text-background text-sm md:text-base mb-1 group-hover:text-primary transition-colors duration-300">
          {category.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-background/70">{category.productCount} products</p>
          <ArrowRight className="h-4 w-4 text-background opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
}
