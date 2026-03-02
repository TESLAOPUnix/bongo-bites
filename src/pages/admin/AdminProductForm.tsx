import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES } from '@/data/categories';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useAdmin';
import { useProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, GripVertical, Loader2 } from 'lucide-react';
import type { ProductImage, StockStatus } from '@/types';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: existingProduct } = useProduct(id || '');
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    category: existingProduct?.category_slug || '',
    price: existingProduct?.price?.toString() || '',
    sale_price: existingProduct?.sale_price?.toString() || '',
    purchase_price: existingProduct?.purchase_price?.toString() || '',
    sku: existingProduct?.sku || '',
    stock: existingProduct?.stock?.toString() || '0',
    weight: existingProduct?.weight || '',
    size_or_dimensions: existingProduct?.size_or_dimensions || '',
    stock_status: (existingProduct?.stock_status || 'in-stock') as StockStatus,
    is_visible: existingProduct?.is_visible ?? true,
    seo_title: existingProduct?.seo_title || '',
    meta_description: existingProduct?.meta_description || '',
    seo_keywords_input: existingProduct?.seo_keywords?.join(', ') || '',
  });

  const [images, setImages] = useState<ProductImage[]>(
    existingProduct?.images || [
      { url: '', alt_text: '', sort_order: 0 },
      { url: '', alt_text: '', sort_order: 1 },
      { url: '', alt_text: '', sort_order: 2 },
      { url: '', alt_text: '', sort_order: 3 },
    ]
  );

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, field: 'url' | 'alt_text', value: string) => {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const addImageSlot = () => {
    setImages((prev) => [...prev, { url: '', alt_text: '', sort_order: prev.length }]);
  };

  const removeImageSlot = (index: number) => {
    if (images.length <= 1) return;
    setImages((prev) => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, sort_order: i })));
  };

  const parseKeywords = (input: string): string[] => {
    return input
      .split(/\s+/)
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      toast({ title: 'Missing required fields', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    const validImages = images.filter(img => img.url.trim());

    const productData = {
      name: form.name,
      description: form.description,
      category_slug: form.category,
      category: CATEGORIES.find(c => c.slug === form.category)?.name || form.category,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : undefined,
      purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : undefined,
      sku: form.sku || undefined,
      stock: parseInt(form.stock) || 0,
      weight: form.weight || undefined,
      size_or_dimensions: form.size_or_dimensions || undefined,
      stock_status: form.stock_status,
      is_visible: form.is_visible,
      seo_title: form.seo_title || undefined,
      meta_description: form.meta_description || undefined,
      seo_keywords: form.seo_keywords_input ? parseKeywords(form.seo_keywords_input) : undefined,
      images: validImages,
    };

    if (isEditing && id) {
      updateProduct.mutate({ id, data: productData }, {
        onSuccess: () => { toast({ title: 'Product updated', description: form.name }); navigate('/admin/products'); },
        onError: () => toast({ title: 'Failed to update product', variant: 'destructive' }),
      });
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => { toast({ title: 'Product created', description: form.name }); navigate('/admin/products'); },
        onError: () => toast({ title: 'Failed to create product', variant: 'destructive' }),
      });
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Update product details' : 'Add a new product to your catalog'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Product Name *</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter product name" /></div>
              <div className="space-y-2"><Label>Description *</Label><Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Enter product description" rows={4} /></div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (<SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="e.g., BH-TURM-001" /></div>
                <div className="space-y-2"><Label>Stock Quantity</Label><Input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Weight</Label><Input value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} placeholder="e.g., 1.0 kg" /></div>
                <div className="space-y-2"><Label>Size / Dimensions</Label><Input value={form.size_or_dimensions} onChange={(e) => handleChange('size_or_dimensions', e.target.value)} placeholder="e.g., 10x15 cm" /></div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Images</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addImageSlot}><Plus className="h-4 w-4 mr-1" /> Add Image</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Paste image URLs. Minimum 4 images recommended.</p>
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-lg border border-border">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Input value={img.url} onChange={(e) => handleImageChange(idx, 'url', e.target.value)} placeholder={`Image URL ${idx + 1}`} />
                    <Input value={img.alt_text || ''} onChange={(e) => handleImageChange(idx, 'alt_text', e.target.value)} placeholder="Alt text (for SEO)" className="text-sm" />
                  </div>
                  {img.url && (
                    <img src={img.url} alt="" className="w-16 h-16 rounded object-cover flex-shrink-0" />
                  )}
                  <Button type="button" variant="ghost" size="icon" className="flex-shrink-0" onClick={() => removeImageSlot(idx)} disabled={images.length <= 1}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Display Price (₹) *</Label><Input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Selling price" /></div>
                <div className="space-y-2"><Label>Sale Price (₹)</Label><Input type="number" value={form.sale_price} onChange={(e) => handleChange('sale_price', e.target.value)} placeholder="Discounted price" /></div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" value={form.purchase_price} onChange={(e) => handleChange('purchase_price', e.target.value)} placeholder="Your cost" />
                  <p className="text-xs text-muted-foreground">Internal only - never shown to customers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between"><Label>SEO Title</Label><span className="text-xs text-muted-foreground">{form.seo_title.length}/60</span></div>
                <Input value={form.seo_title} onChange={(e) => handleChange('seo_title', e.target.value.slice(0, 60))} placeholder="Custom title for search engines" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><Label>Meta Description</Label><span className="text-xs text-muted-foreground">{form.meta_description.length}/160</span></div>
                <Textarea value={form.meta_description} onChange={(e) => handleChange('meta_description', e.target.value.slice(0, 160))} placeholder="Brief description for search results" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <Textarea
                  value={form.seo_keywords_input}
                  onChange={(e) => handleChange('seo_keywords_input', e.target.value)}
                  placeholder="Paste keywords like: organic turmeric powder kolkata pure spice"
                  rows={2}
                />
                {form.seo_keywords_input && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {parseKeywords(form.seo_keywords_input).map((keyword, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground">{keyword}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Paste space-separated keywords. They'll be automatically parsed and sent as an array.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Visible on site</Label>
                <Switch checked={form.is_visible} onCheckedChange={(v) => handleChange('is_visible', v)} />
              </div>
              <div className="space-y-2">
                <Label>Stock Status</Label>
                <Select value={form.stock_status} onValueChange={(v) => handleChange('stock_status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/admin/products')}>Cancel</Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
