

## Admin Blog Management System

### What to build

A full blog management section in the admin panel with list, create, edit, delete, and publish/unpublish functionality — mirroring the existing product management pattern.

### Changes

**1. Update types (`src/types/index.ts`)**
- Add `is_published` boolean field to the `Blog` interface
- Add `updated_at` optional field

**2. Add blog endpoints to admin service (`src/services/adminService.ts`)**
- `getBlogs(page)` → `GET /api/admin/blogs`
- `createBlog(data)` → `POST /api/admin/blogs`
- `updateBlog(id, data)` → `PUT /api/admin/blogs/{id}`
- `deleteBlog(id)` → `DELETE /api/admin/blogs/{id}`

**3. Add admin blog hooks (`src/hooks/useAdmin.ts`)**
- `useAdminBlogs(page)` — paginated blog list
- `useCreateBlog()` — mutation
- `useUpdateBlog()` — mutation
- `useDeleteBlog()` — mutation

**4. Create `src/pages/admin/AdminBlogs.tsx`**
- Blog list table with columns: title, status (live/draft badge), date, actions
- Search filter by title
- Status filter (all / live / draft)
- Toggle publish status inline (switch component)
- Edit and delete buttons per row
- "New Blog" button linking to `/admin/blogs/new`
- Pagination controls
- Delete confirmation modal (reuse `DeleteConfirmModal`)

**5. Create `src/pages/admin/AdminBlogForm.tsx`**
- Form fields: title, slug (auto-generated from title), content (textarea), excerpt, featured image URL, category, SEO title, meta description
- `is_published` toggle switch
- Create / Update mode based on route param `:id`
- Pattern follows `AdminProductForm.tsx`

**6. Update admin sidebar (`src/components/admin/AdminLayout.tsx`)**
- Add "Blogs" nav item with `FileText` icon pointing to `/admin/blogs`

**7. Add routes (`src/App.tsx`)**
- `<Route path="blogs" element={<AdminBlogs />} />`
- `<Route path="blogs/new" element={<AdminBlogForm />} />`
- `<Route path="blogs/:id" element={<AdminBlogForm />} />`

