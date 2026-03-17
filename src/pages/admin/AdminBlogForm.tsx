import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateBlog, useUpdateBlog } from '@/hooks/useAdmin';
import { blogService } from '@/services/blogService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { Blog } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function AdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    seo_title: '',
    meta_description: '',
    is_published: false,
  });

  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      blogService
        .getBySlug(id)
        .then((blog: Blog) => {
          setForm({
            title: blog.title || '',
            slug: blog.slug || '',
            content: blog.content || '',
            excerpt: blog.excerpt || '',
            featured_image: blog.featured_image || '',
            category: blog.category || '',
            seo_title: blog.seo_title || '',
            meta_description: blog.meta_description || '',
            is_published: blog.is_published ?? false,
          });
        })
        .catch(() => {
          toast({ title: 'Failed to load blog', variant: 'destructive' });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !isEditing) {
        updated.slug = slugify(value as string);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast({
        title: 'Missing required fields',
        description: 'Title and content are required',
        variant: 'destructive',
      });
      return;
    }

    const blogData: Partial<Blog> = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      content: form.content,
      excerpt: form.excerpt || undefined,
      featured_image: form.featured_image || undefined,
      category: form.category || undefined,
      seo_title: form.seo_title || undefined,
      meta_description: form.meta_description || undefined,
      is_published: form.is_published,
    };

    if (isEditing && id) {
      updateBlog.mutate(
        { id, data: blogData },
        {
          onSuccess: () => {
            toast({ title: 'Blog updated', description: form.title });
            navigate('/admin/blogs');
          },
          onError: () =>
            toast({ title: 'Failed to update blog', variant: 'destructive' }),
        }
      );
    } else {
      createBlog.mutate(blogData, {
        onSuccess: () => {
          toast({ title: 'Blog created', description: form.title });
          navigate('/admin/blogs');
        },
        onError: () =>
          toast({ title: 'Failed to create blog', variant: 'destructive' }),
      });
    }
  };

  const isSaving = createBlog.isPending || updateBlog.isPending;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blogs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? 'Edit Blog Post' : 'New Blog Post'}</h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update your blog post' : 'Write a new blog post'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter blog title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="auto-generated-from-title"
                  className="text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from title. Edit manually if needed.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                  value={form.excerpt}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="Brief summary of the post"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your blog post content..."
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>SEO Title</Label>
                  <span className="text-xs text-muted-foreground">{form.seo_title.length}/60</span>
                </div>
                <Input
                  value={form.seo_title}
                  onChange={(e) => handleChange('seo_title', e.target.value.slice(0, 60))}
                  placeholder="Custom title for search engines"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Meta Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {form.meta_description.length}/160
                  </span>
                </div>
                <Textarea
                  value={form.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value.slice(0, 160))}
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
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Make Live</Label>
                <Switch
                  checked={form.is_published}
                  onCheckedChange={(v) => handleChange('is_published', v)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {form.is_published
                  ? 'This post will be visible on the blog page.'
                  : "This post is saved as a draft and won't be visible."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={form.featured_image}
                onChange={(e) => handleChange('featured_image', e.target.value)}
                placeholder="Paste image URL"
              />
              {form.featured_image && (
                <img
                  src={form.featured_image}
                  alt="Featured"
                  className="w-full h-40 rounded-lg object-cover border"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Recipes, Culture, Tips"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditing ? 'Update Post' : 'Create Post'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin/blogs')}
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
