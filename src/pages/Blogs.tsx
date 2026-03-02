import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/SEOHead';
import { useBlogs } from '@/hooks/useBlogs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Blogs() {
  const { data: blogs, isLoading } = useBlogs();

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Layout>
      <SEOHead title="Blog – Stories from Bengal" description="Explore recipes, traditions, and the rich culinary heritage of Bengali cuisine" canonical={`${window.location.origin}/blogs`} />

      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link><span>/</span>
            <span className="text-foreground">Blogs</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Stories from Bengal</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore recipes, traditions, and the rich culinary heritage of Bengali cuisine</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (blogs || []).length > 0 ? (
          <>
            {/* Featured Post */}
            <div className="mb-12">
              <Link to={`/blog/${blogs![0].slug}`} className="block group">
                <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
                  <img src={blogs![0].featured_image || 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=400&fit=crop'} alt={blogs![0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-3 max-w-2xl group-hover:text-primary transition-colors">{blogs![0].title}</h2>
                    <p className="text-background/80 mb-4 max-w-xl hidden md:block line-clamp-2">{blogs![0].meta_description || blogs![0].content?.slice(0, 150)}</p>
                    <span className="flex items-center gap-1 text-sm text-background/70"><Calendar className="h-4 w-4" />{formatDate(blogs![0].created_at)}</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs!.slice(1).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.featured_image || 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=400&fit=crop'} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.meta_description || post.content?.slice(0, 100)}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{shortDate(post.created_at)}</span>
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
