import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminBlogs, useDeleteBlog, useUpdateBlog } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import type { Blog } from '@/types';

export default function AdminBlogs() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminBlogs(page);
  const deleteBlog = useDeleteBlog();
  const updateBlog = useUpdateBlog();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; blog: Blog | null }>({ open: false, blog: null });
  const { toast } = useToast();

  const blogs = data?.data || [];
  const totalPages = data?.total_pages || 1;

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'live' && blog.is_published) ||
      (statusFilter === 'draft' && !blog.is_published);
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (deleteModal.blog) {
      deleteBlog.mutate(deleteModal.blog.id, {
        onSuccess: () => {
          toast({ title: 'Blog deleted', description: deleteModal.blog?.title });
          setDeleteModal({ open: false, blog: null });
        },
      });
    }
  };

  const handleTogglePublish = (blog: Blog) => {
    updateBlog.mutate(
      { id: blog.id, data: { is_published: !blog.is_published } },
      {
        onSuccess: () => {
          toast({
            title: blog.is_published ? 'Blog unpublished' : 'Blog published',
            description: blog.title,
          });
        },
      }
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Button asChild>
          <Link to="/admin/blogs/new">
            <Plus className="h-4 w-4 mr-2" /> New Blog Post
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-background rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Live</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {blog.featured_image && (
                          <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <span className="font-medium line-clamp-1">{blog.title}</span>
                          {blog.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{blog.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={blog.is_published ? 'default' : 'secondary'}>
                        {blog.is_published ? 'Live' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-sm">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <Switch
                        checked={blog.is_published}
                        onCheckedChange={() => handleTogglePublish(blog)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/blog/${blog.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/blogs/${blog.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteModal({ open: true, blog })}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBlogs.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No blog posts found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, blog: null })}
        productName={deleteModal.blog?.title || ''}
        onConfirm={handleDelete}
      />
    </div>
  );
}
