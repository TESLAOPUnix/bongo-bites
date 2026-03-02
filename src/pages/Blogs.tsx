import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useBlogs } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';

export default function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const { data, isLoading, error } = useBlogs(page);

  const blogs = data?.data || [];
  const totalPages = data?.total_pages || 1;

  const setPage = (p: number) => {
    setSearchParams({ page: String(p) });
  };

  return (
    <Layout>
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <span className="text-foreground">Blogs</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Stories from Bengal</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore recipes, traditions, and the rich culinary heritage of Bengali cuisine
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive mb-4">Failed to load blogs.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {blogs.length > 0 && page === 1 && (
              <div className="mb-12">
                <Link to={`/blog/${blogs[0].slug}`} className="block group">
                  <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
                    {blogs[0].featured_image && (
                      <img src={blogs[0].featured_image} alt={blogs[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      {blogs[0].category && (
                        <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-3">{blogs[0].category}</span>
                      )}
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-3 max-w-2xl group-hover:text-primary transition-colors">{blogs[0].title}</h2>
                      {blogs[0].excerpt && <p className="text-background/80 mb-4 max-w-xl hidden md:block">{blogs[0].excerpt}</p>}
                      <div className="flex items-center gap-4 text-sm text-background/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(blogs[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        {blogs[0].read_time && (
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{blogs[0].read_time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 ? blogs.slice(1) : blogs).map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-medium"><Tag className="h-3 w-3" />{post.category}</span>
                      </div>
                    )}
                    <h3 className="font-display font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1">
                        {post.read_time || 'Read more'}
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
