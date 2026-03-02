# API Route Definitions

## Stack
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Auth:** JWT (jsonwebtoken)
- **Password:** bcryptjs

---

## Middleware

### `authMiddleware`
Verifies `Authorization: Bearer <token>` header. Attaches `req.user = { id, role }`.

### `adminMiddleware`
Extends `authMiddleware`. Rejects if `req.user.role !== 'admin'`.

---

## Error Response Format (all endpoints)

```json
{
  "error": true,
  "message": "Description of error",
  "code": "ERROR_CODE"
}
```

Common codes: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `CONFLICT`, `INTERNAL_ERROR`

---

## Pagination Format (all list endpoints)

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 247,
    "pages": 13
  }
}
```

---

## Routes

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register user. Body: `{ full_name, email, password, phone? }`. Returns `{ token, user }`. |
| POST | `/api/auth/login` | No | Login. Body: `{ email, password }`. Returns `{ token, user }`. |
| GET | `/api/auth/me` | Yes | Get current user profile. |
| PUT | `/api/auth/profile` | Yes | Update profile. Body: `{ full_name?, phone? }`. |
| PUT | `/api/auth/password` | Yes | Change password. Body: `{ current_password, new_password }`. |

### Products (Public)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | No | List products. Query: `category, min_price, max_price, in_stock, sort, q, page, per_page`. |
| GET | `/api/products/:slug` | No | Get single product with images, category. |
| GET | `/api/products/category/:slug` | No | Products by category. Query: `page, per_page`. |

**Sort values:** `price_asc`, `price_desc`, `newest`, `most_wishlisted`

### Categories (Public)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/categories` | No | All categories with product counts. |

### Search (Public)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/search` | No | Search. Query: `q`. Returns `{ products, categories, blogs }`. |

### Delivery (Public)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/delivery/check` | No | Query: `pincode`. Returns `{ delivery_available, delivery_time_days }`. |

### Wishlist (Authenticated)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/wishlist` | Yes | Get user's wishlist with product details. |
| POST | `/api/wishlist/add` | Yes | Body: `{ product_id }`. |
| DELETE | `/api/wishlist/remove` | Yes | Body: `{ product_id }`. |

### Orders (Authenticated)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/orders` | Yes | Create order. Body: `{ items: [{ product_id, quantity }], address_id, payment_method? }`. |
| GET | `/api/orders` | Yes | User's orders. |
| GET | `/api/orders/:id` | Yes | Order detail (own orders only). |

### Addresses (Authenticated)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/account/addresses` | Yes | User's addresses. |
| POST | `/api/account/addresses` | Yes | Create address. |
| PUT | `/api/account/addresses/:id` | Yes | Update address (own only). |
| DELETE | `/api/account/addresses/:id` | Yes | Delete address (own only). |

### Blogs (Public + Admin)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/blogs` | No | List blogs. Query: `page, per_page`. |
| GET | `/api/blogs/:slug` | No | Blog detail. |
| POST | `/api/admin/blogs` | Admin | Create blog. |
| PUT | `/api/admin/blogs/:id` | Admin | Update blog. |
| DELETE | `/api/admin/blogs/:id` | Admin | Delete blog. |

### Admin — Dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/dashboard` | Admin | Returns stats: `total_orders, orders_today, orders_this_month, fulfilled_orders, pending_orders, in_delivery, total_revenue, revenue_this_month, total_products, out_of_stock, total_users, most_wishlisted, recent_orders`. |

### Admin — Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/products` | Admin | List products. Query: `page`. Returns `{ data, total }`. |
| POST | `/api/admin/products` | Admin | Create product with images. |
| PUT | `/api/admin/products/:id` | Admin | Update product. |
| DELETE | `/api/admin/products/:id` | Admin | Delete product and images. |

### Admin — Orders

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/orders` | Admin | All orders paginated. |
| GET | `/api/admin/orders/:id` | Admin | Order detail. |
| PUT | `/api/admin/orders/:id` | Admin | Update status. Body: `{ status }`. |
| POST | `/api/admin/orders/manual` | Admin | Manual order. Body: `{ customer_name, customer_email, items }`. |

### Admin — Wishlist Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/admin/wishlist/stats` | Admin | Returns `[{ product_id, product_name, wishlist_count }]` sorted by count desc. |

---

## Request/Response Examples

### POST /api/auth/register
```json
// Request
{ "full_name": "Rahim Das", "email": "rahim@example.com", "password": "securepass123" }

// Response 201
{ "token": "eyJhbGciOiJIUzI1NiIs...", "user": { "id": "uuid", "full_name": "Rahim Das", "email": "rahim@example.com", "role": "user" } }
```

### GET /api/products?category=herbs-spices&min_price=100&max_price=500&page=1&per_page=20
```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "name": "Organic Turmeric Powder",
      "slug": "organic-turmeric-powder-200g",
      "price": 149.00,
      "sale_price": 129.00,
      "stock": 45,
      "category_name": "Herbs & Spices",
      "category_slug": "herbs-spices",
      "images": [
        { "id": "uuid", "image_url": "https://...", "alt_text": "Turmeric", "sort_order": 0 }
      ]
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 18, "pages": 1 }
}
```

### POST /api/orders
```json
// Request
{
  "address_id": "uuid",
  "payment_method": "cod",
  "items": [
    { "product_id": "uuid", "quantity": 2 },
    { "product_id": "uuid", "quantity": 1 }
  ]
}

// Response 201
{
  "id": "uuid",
  "status": "pending",
  "total_amount": 498.00,
  "payment_status": "pending",
  "items": [
    { "product_id": "uuid", "product_name_snapshot": "Organic Turmeric", "quantity": 2, "price_snapshot": 129.00 }
  ]
}
```

### GET /api/admin/dashboard
```json
{
  "total_orders": 1243,
  "orders_today": 12,
  "orders_this_month": 189,
  "fulfilled_orders": 1100,
  "pending_orders": 43,
  "in_delivery": 67,
  "total_revenue": 2456789.50,
  "revenue_this_month": 189430.00,
  "total_products": 247,
  "out_of_stock": 8,
  "total_users": 3456,
  "most_wishlisted": [
    { "product_id": "uuid", "product_name": "Nolen Gur Sandesh", "wishlist_count": 234 }
  ],
  "recent_orders": []
}
```
