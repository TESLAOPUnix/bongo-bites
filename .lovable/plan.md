

## Plan: Social Media Icons, Upcoming Products Section, and Product Stock Status System

### Overview
This plan implements four connected features:
1. Social media icons in the header
2. "Upcoming Products" section on the homepage
3. Enhanced product stock status system (In Stock, Out of Stock, Upcoming)
4. Updated shop page filters for all three statuses

---

### 1. Add Social Media Icons to Header

**Location**: Top bar of the header (alongside phone number and WhatsApp link)

**Icons to add**:
- Facebook
- Instagram
- Twitter (X)
- Threads

**Implementation approach**:
- Add icons to the left side of the top bar next to the phone number
- Use Lucide icons for Facebook, Instagram, and Twitter
- Create a simple SVG for Threads (Lucide doesn't have it)
- Icons will link to social media pages (placeholder URLs for now)
- Style: Small icons with hover effects

---

### 2. Add "Upcoming Products" Section to Homepage

**Position**: After Bestseller Products section, before Testimonials

**Design**:
- Section title: "Coming Soon" with descriptive subtitle
- Display upcoming products in a grid (similar to bestseller section)
- Each product card shows "Upcoming" badge and "Notify Me" button instead of Add to Cart
- Visual distinction with a different background color or accent

---

### 3. Update Product Data Structure and Status System

**Changes to Product interface**:
- Replace `inStock: boolean` with `stockStatus: 'in-stock' | 'out-of-stock' | 'upcoming'`
- Add sample upcoming products to the product data

**ProductCard updates**:
- Show appropriate badge based on stock status
- "In Stock": Show "Add to Cart" button (current behavior)
- "Out of Stock": Show overlay with "Notify Me" button
- "Upcoming": Show "Coming Soon" badge with "Notify Me" button

**Notify Me button behavior**:
- For now, show a toast notification confirming the user will be notified
- Can be extended later to collect email/phone for actual notifications

---

### 4. Update Shop Page Filters

**Changes to Availability filter**:
- Replace single "In Stock Only" checkbox with three options:
  - In Stock
  - Out of Stock  
  - Upcoming

**Filter logic**:
- When no filters selected: show all products
- When filters selected: show products matching ANY selected status

---

### Technical Details

#### File Changes Required

**1. `src/data/products.ts`**
- Update `Product` interface: change `inStock: boolean` to `stockStatus: 'in-stock' | 'out-of-stock' | 'upcoming'`
- Update existing products to use new `stockStatus` field
- Add 2-3 new upcoming products
- Add helper function `getUpcomingProducts()`

**2. `src/components/layout/Header.tsx`**
- Import additional icons from Lucide (Facebook, Instagram, Twitter)
- Add Threads SVG icon component
- Add social media links to the top bar section

**3. `src/components/products/ProductCard.tsx`**
- Update to check `stockStatus` instead of `inStock`
- Add "Upcoming" badge styling
- Add "Notify Me" button component
- Add toast notification for Notify Me action

**4. `src/components/home/UpcomingProducts.tsx`** (new file)
- Create new section component for upcoming products
- Filter and display products with `stockStatus: 'upcoming'`
- Similar structure to BestsellerProducts

**5. `src/pages/Index.tsx`**
- Import and add UpcomingProducts section

**6. `src/pages/Shop.tsx`**
- Update filter state from `showInStockOnly` to `selectedStockStatus: string[]`
- Add three checkbox options for stock status
- Update filtering logic to handle multiple stock statuses

**7. `src/contexts/CartContext.tsx`**
- Update `addToCart` to check product stock status before adding

**8. `src/pages/ProductDetail.tsx`**
- Update to use new `stockStatus` field
- Show "Notify Me" for out-of-stock and upcoming products

---

### Visual Design Specifications

**Social Media Icons**:
- Size: 16x16px in top bar
- Color: Inherit from tertiary-foreground, primary on hover
- Spacing: 8px gap between icons

**Upcoming Products Badge**:
- Background: Accent color (amber/gold)
- Text: "Coming Soon"
- Position: Top left of product image (same as other badges)

**Notify Me Button**:
- Style: Outline variant with bell icon
- Text: "Notify Me"
- Full width on product cards
- Shows toast: "We'll notify you when this product is available!"

**Stock Status Indicators on Cards**:

| Status | Badge | Overlay | Button |
|--------|-------|---------|--------|
| In Stock | None (unless bestseller/new) | None | Add to Cart |
| Out of Stock | "Out of Stock" (muted) | Semi-transparent | Notify Me |
| Upcoming | "Coming Soon" (accent) | None | Notify Me |

---

### Sample Upcoming Products to Add

1. **Nolen Gur Ice Cream (500ml)**
   - Category: Sweets & Mishti
   - Description: Creamy ice cream made with authentic Nolen Gur
   - Price: TBD

2. **Bengali Fish Pickle (250g)**
   - Category: Snacks & Homemade Pickles
   - Description: Traditional pickled fish preparation

3. **Durga Puja Special Gift Box**
   - Category: Seasonal Specials
   - Description: Curated box of Bengali festive treats

