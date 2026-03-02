import { Link } from 'react-router-dom';
import { useProducts, useCategories, useDeleteProduct, useToggleProductVisibility } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts({ visible: false }); // show all including hidden
  const { data: categories } = useCategories();
  const deleteProduct = useDeleteProduct();
  const toggleVisibility = useToggleProductVisibility();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: any | null }>({ open: false, product: null });
  const { toast } = useToast();

  const filtered = (products || []).filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categorySlug === categoryFilter;
    const matchesStock = stockFilter === 'all' || p.stockStatus === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = async () => {
    if (deleteModal.product) {
      try {
        await deleteProduct.mutateAsync(deleteModal.product.id);
        toast({ title: 'Product deleted', description: deleteModal.product.name });
      } catch {
        toast({ title: 'Failed to delete', variant: 'destructive' });
      }
      setDeleteModal({ open: false, product: null });
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    try {
      await toggleVisibility.mutateAsync({ id, isVisible: !current });
      toast({ title: 'Visibility updated' });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  const getStockBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; label: string }> = {
      'in-stock': { variant: 'default', label: 'In Stock' },
      'out-of-stock': { variant: 'destructive', label: 'Out of Stock' },
      upcoming: { variant: 'secondary', label: 'Upcoming' },
    };
    const c = config[status] || config['in-stock'];
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog ({(products || []).length} total)</p>
        </div>
        <Button asChild><Link to="/admin/products/new"><Plus className="h-4 w-4 mr-2" />Add Product</Link></Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories || []).map((cat) => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-background rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Visible</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-3 px-4">₹{product.price}</td>
                    <td className="py-3 px-4">{getStockBadge(product.stockStatus)}</td>
                    <td className="py-3 px-4">
                      <Switch checked={product.isVisible} onCheckedChange={() => handleToggleVisibility(product.id, product.isVisible)} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild><Link to={`/product/${product.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="icon" asChild><Link to={`/admin/products/${product.id}`}><Pencil className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteModal({ open: true, product })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No products found matching your criteria</div>
        )}
      </div>

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, product: null })}
        productName={deleteModal.product?.name || ''}
        onConfirm={handleDelete}
      />
    </div>
  );
}
