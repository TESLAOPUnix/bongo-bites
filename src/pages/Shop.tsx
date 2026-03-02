import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import SEOHead from '@/components/SEOHead';
import { useProducts, useCategories, UIProduct } from '@/hooks/useProducts';
import { products as staticProducts, categories as staticCategories, getProductsByCategory, getCategoryBySlug } from '@/data/products';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'bestseller';

export default function Shop() {
  const { categorySlug } = useParams();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categorySlug ? [categorySlug] : []
  );
  const [selectedStockStatus, setSelectedStockStatus] = useState<string[]>([]);

  const { data: supabaseProducts, isLoading: productsLoading } = useProducts({ categorySlug });
  const { data: supabaseCategories } = useCategories();

  // Use Supabase data if configured, else static
  const allProducts = isSupabaseConfigured
    ? (supabaseProducts || [])
    : staticProducts.map((p) => ({
        ...p,
        image: p.image,
        images: p.images || [p.image],
        stock: p.stockStatus === 'in-stock' ? 1 : 0,
        weight: p.weight ? String(p.weight) : undefined,
        isBestseller: p.isBestseller || false,
        isNew: p.isNew || false,
        isUpcoming: p.stockStatus === 'upcoming',
        isVisible: true,
        stockStatus: p.stockStatus as 'in-stock' | 'out-of-stock' | 'upcoming',
      } as UIProduct));

  const categories = isSupabaseConfigured
    ? (supabaseCategories || [])
    : staticCategories.map((c) => ({ ...c }));

  const category = categories.find((c) => c.slug === categorySlug);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (!categorySlug && selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedStockStatus.length > 0) {
      result = result.filter((p) => selectedStockStatus.includes(p.stockStatus));
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'bestseller': result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
    }
    return result;
  }, [allProducts, categorySlug, sortBy, priceRange, selectedCategories, selectedStockStatus]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleStockStatus = (status: string) => {
    setSelectedStockStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setSelectedStockStatus([]);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || selectedStockStatus.length > 0;

  const stockStatusLabels: Record<string, string> = {
    'in-stock': 'In Stock',
    'out-of-stock': 'Out of Stock',
    'upcoming': 'Upcoming',
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="filter-section">
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={50} className="mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {!categorySlug && (
        <div className="filter-section">
          <h4 className="font-semibold mb-4">Categories</h4>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox checked={selectedCategories.includes(cat.slug)} onCheckedChange={() => toggleCategory(cat.slug)} />
                <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="filter-section">
        <h4 className="font-semibold mb-4">Availability</h4>
        <div className="space-y-3">
          {(['in-stock', 'out-of-stock', 'upcoming'] as const).map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox checked={selectedStockStatus.includes(status)} onCheckedChange={() => toggleStockStatus(status)} />
              <span className="text-sm group-hover:text-primary transition-colors">{stockStatusLabels[status]}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All Filters</Button>
      )}
    </div>
  );

  return (
    <Layout>
      <SEOHead
        title={category ? category.name : 'Shop All Products'}
        description={category ? `Browse ${category.name} – authentic Bengali products` : 'Browse our collection of authentic Bengali products.'}
        canonical={`${window.location.origin}${categorySlug ? `/category/${categorySlug}` : '/shop'}`}
      />

      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            {category ? (
              <>
                <Link to="/shop" className="breadcrumb-link">Shop</Link>
                <span>/</span>
                <span className="text-foreground">{category.name}</span>
              </>
            ) : (
              <span className="text-foreground">Shop</span>
            )}
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="font-display text-lg font-semibold mb-6">Filters</h3>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {category ? category.name : 'All Products'}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Showing {filteredProducts.length} products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                    <div className="mt-6"><FilterContent /></div>
                  </SheetContent>
                </Sheet>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="bestseller">Bestseller</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((slug) => {
                  const cat = categories.find((c) => c.slug === slug);
                  return cat ? (
                    <button key={slug} onClick={() => toggleCategory(slug)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
                      {cat.name}<X className="h-3 w-3" />
                    </button>
                  ) : null;
                })}
              </div>
            )}

            {productsLoading && isSupabaseConfigured ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products found matching your filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
