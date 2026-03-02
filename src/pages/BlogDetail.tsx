import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useBlog } from '@/hooks/useBlogs';
import { Button } from '@/components/ui/button';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blog, isLoading, error } = useBlog(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container section-padding flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="section-container section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blogs"><Button>Back to Blogs</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <Link to="/blogs" className="breadcrumb-link">Blogs</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{blog.title}</span>
          </nav>
        </div>
      </div>

      <article className="section-container section-padding">
        <div className="max-w-3xl mx-auto">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>

          {blog.category && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">{blog.category}</span>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {blog.read_time && (
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{blog.read_time}</span>
            )}
          </div>

          {blog.featured_image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </article>
    </Layout>
  );
}
