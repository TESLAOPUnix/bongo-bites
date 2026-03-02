import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { products as allProducts, categories, StockStatus } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const existingProduct = isEditing ? allProducts.find((p) => p.id === id) : null;

  const [form, setForm] = useState({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    category: existingProduct?.categorySlug || '',
    price: existingProduct?.price?.toString() || '',
    originalPrice: existingProduct?.originalPrice?.toString() || '',
    purchasePrice: '',
    weight: '',
    stockStatus: existingProduct?.stockStatus || 'in-stock' as StockStatus,
    isVisible: true,
    seoTitle: '',
    metaDescription: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(existingProduct?.image || '');

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload an image file', variant: 'destructive' });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Please upload an image under 5MB', variant: 'destructive' });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !imagePreview) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would save to a backend
    toast({
      title: isEditing ? 'Product updated' : 'Product created',
      description: form.name,
    });
    navigate('/admin/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'New Product'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update product details' : 'Add a new product to your catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={form.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product Image *</Label>
                {imagePreview ? (
                  <div className="relative w-full max-w-xs">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={form.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  placeholder="e.g., 0.5"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Display Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="Selling price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => handleChange('originalPrice', e.target.value)}
                    placeholder="For discounts"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (₹) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={form.purchasePrice}
                    onChange={(e) => handleChange('purchasePrice', e.target.value)}
                    placeholder="Your cost"
                  />
                  <p className="text-xs text-muted-foreground">Internal only - never shown to customers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <span className="text-xs text-muted-foreground">{form.seoTitle.length}/60</span>
                </div>
                <Input
                  id="seoTitle"
                  value={form.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value.slice(0, 60))}
                  placeholder="Custom title for search engines"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <span className="text-xs text-muted-foreground">{form.metaDescription.length}/160</span>
                </div>
                <Textarea
                  id="metaDescription"
                  value={form.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value.slice(0, 160))}
                  placeholder="Brief description for search results"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isVisible">Visible on site</Label>
                <Switch
                  id="isVisible"
                  checked={form.isVisible}
                  onCheckedChange={(v) => handleChange('isVisible', v)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Status</Label>
                <Select
                  value={form.stockStatus}
                  onValueChange={(v) => handleChange('stockStatus', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
              <Button type="submit" className="w-full">
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
