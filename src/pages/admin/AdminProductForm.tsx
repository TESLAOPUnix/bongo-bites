import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, GripVertical } from 'lucide-react';

interface ImageEntry {
  url: string;
  alt: string;
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // If editing, we need to fetch product by ID. We'll use a direct query.
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', categoryId: '', price: '', salePrice: '',
    purchasePrice: '', sku: '', stock: '0', weight: '', sizeOrDimensions: '',
    isVisible: true, isBestseller: false, isNew: false, isUpcoming: false,
    keywordsInput: '', metaTitle: '', metaDescription: '',
  });
  const [images, setImages] = useState<ImageEntry[]>([{ url: '', alt: '' }]);

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      supabase
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              name: data.name,
              description: data.description || '',
              categoryId: data.category_id || '',
              price: String(data.price),
              salePrice: data.sale_price ? String(data.sale_price) : '',
              purchasePrice: data.purchase_price ? String(data.purchase_price) : '',
              sku: data.sku || '',
              stock: String(data.stock),
              weight: data.weight || '',
              sizeOrDimensions: data.size_or_dimensions || '',
              isVisible: data.is_visible,
              isBestseller: data.is_bestseller,
              isNew: data.is_new,
              isUpcoming: data.is_upcoming,
              keywordsInput: (data.keywords || []).join(', '),
              metaTitle: '',
              metaDescription: '',
            });
            const imgs = (data.images || [])
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((img: any) => ({ url: img.image_url, alt: img.alt_text || '' }));
            setImages(imgs.length > 0 ? imgs : [{ url: '', alt: '' }]);
          }
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addImageSlot = () => setImages([...images, { url: '', alt: '' }]);

  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Convert keyword string to array
  const parseKeywords = (input: string): string[] => {
    return input.split(/[\s,]+/).filter(Boolean).map((k) => k.trim().toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast({ title: 'Missing required fields', variant: 'destructive' });
      return;
    }

    const validImages = images.filter((img) => img.url.trim());
    const keywords = parseKeywords(form.keywordsInput);

    const productData = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: form.description || null,
      category_id: form.categoryId,
      price: parseFloat(form.price),
      sale_price: form.salePrice ? parseFloat(form.salePrice) : null,
      purchase_price: form.purchasePrice ? parseFloat(form.purchasePrice) : null,
      sku: form.sku || null,
      stock: parseInt(form.stock) || 0,
      weight: form.weight || null,
      size_or_dimensions: form.sizeOrDimensions || null,
      keywords: keywords.length > 0 ? keywords : null,
      is_visible: form.isVisible,
      is_bestseller: form.isBestseller,
      is_new: form.isNew,
      is_upcoming: form.isUpcoming,
    };

    try {
      if (isEditing && id) {
        await updateProduct.mutateAsync({
          id,
          product: productData,
          imageUrls: validImages,
        });
        toast({ title: 'Product updated', description: form.name });
      } else {
        await createProduct.mutateAsync({
          product: productData,
          imageUrls: validImages,
        });
        toast({ title: 'Product created', description: form.name });
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading product...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-muted-foreground">{isEditing ? 'Update product details' : 'Add a new product'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Product Name *</Label><Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Enter product name" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} /></div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.categoryId} onValueChange={(v) => handleChange('categoryId', v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {(categories || []).map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="e.g., BH-001" /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Weight</Label><Input value={form.weight} onChange={(e) => handleChange('weight', e.target.value)} placeholder="e.g., 500g" /></div>
                <div className="space-y-2"><Label>Size / Dimensions</Label><Input value={form.sizeOrDimensions} onChange={(e) => handleChange('sizeOrDimensions', e.target.value)} placeholder="e.g., 10x5cm" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Product Images (paste URLs)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Input value={img.url} onChange={(e) => updateImage(i, 'url', e.target.value)} placeholder="Image URL" />
                    <Input value={img.alt} onChange={(e) => updateImage(i, 'alt', e.target.value)} placeholder="Alt text" className="text-xs" />
                  </div>
                  {img.url && (
                    <img src={img.url} alt={img.alt} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                  )}
                  {images.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(i)} className="flex-shrink-0"><X className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageSlot} className="gap-2"><Plus className="h-4 w-4" />Add Image</Button>
              <p className="text-xs text-muted-foreground">Support 4+ images. Drag to reorder.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Display Price (₹) *</Label><Input type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} /></div>
                <div className="space-y-2"><Label>Sale Price (₹)</Label><Input type="number" value={form.salePrice} onChange={(e) => handleChange('salePrice', e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" value={form.purchasePrice} onChange={(e) => handleChange('purchasePrice', e.target.value)} />
                  <p className="text-xs text-muted-foreground">Internal only</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO Keywords</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Keywords (paste space or comma separated)</Label>
                <Textarea value={form.keywordsInput} onChange={(e) => handleChange('keywordsInput', e.target.value)} placeholder="organic turmeric powder kolkata pure turmeric spice" rows={3} />
                <p className="text-xs text-muted-foreground">
                  Auto-converted to: {parseKeywords(form.keywordsInput).join(', ') || '(none)'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Visible on site</Label><Switch checked={form.isVisible} onCheckedChange={(v) => handleChange('isVisible', v)} /></div>
              <div className="flex items-center justify-between"><Label>Bestseller</Label><Switch checked={form.isBestseller} onCheckedChange={(v) => handleChange('isBestseller', v)} /></div>
              <div className="flex items-center justify-between"><Label>New Product</Label><Switch checked={form.isNew} onCheckedChange={(v) => handleChange('isNew', v)} /></div>
              <div className="flex items-center justify-between"><Label>Upcoming</Label><Switch checked={form.isUpcoming} onCheckedChange={(v) => handleChange('isUpcoming', v)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>
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
