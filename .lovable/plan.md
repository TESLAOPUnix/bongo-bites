

## Plan: Header Updates, Category Card Animations, Footer Enhancements, and Contact Page Improvements

### Overview
This plan implements multiple UI/UX improvements across the header, homepage, footer, and contact page based on your requirements.

---

### 1. Header Top Bar Restructure

**Current state**: Social icons on left, phone number, WhatsApp CTA button on right side of main header

**Changes**:

| Position | Current | New |
|----------|---------|-----|
| Extreme Left | Facebook, Instagram, Twitter, Threads | YouTube, Facebook, Instagram, X (new icon), Threads |
| Center-Left | Phone number | Phone number + WhatsApp icon with separate number |
| Right | "Order via WhatsApp" button | Remove this button |

**Icon Updates**:
- Add YouTube icon (from Lucide) at the extreme left
- Replace Twitter bird icon with X logo (custom SVG)
- Add WhatsApp icon next to a separate WhatsApp number

**Search Bar**:
- Increase width from `max-w-md` to `max-w-xl` (wider)
- Increase input padding for better visibility

---

### 2. Logo Image + Favicon

**Changes**:
- Copy the uploaded logo image to project assets
- Replace text "Bongo Hridoy" with the logo image in header
- Update mobile menu to use the logo image
- Update footer brand section to use the logo image
- Set the logo as the favicon in `index.html`

**Implementation**:
- Copy `user-uploads://bongo_logo.jpeg` to `public/logo.png` (for favicon) and `src/assets/logo.png` (for React import)
- Add `<link rel="icon" href="/logo.png" type="image/png">` to index.html
- Import logo in Header and Footer components

---

### 3. Category Card Hover Animations

**Current state**: Basic shadow change on hover

**New animations**:
- Image zoom effect (scale 1.05 on hover)
- Gradient overlay becomes slightly more prominent
- Card lifts up slightly (translateY)
- Arrow icon slides in from right
- Smooth transitions (300-500ms)

**CSS updates** to `.category-card`:
- Add `group` class to the Link component
- Add `hover:-translate-y-2` for lift effect
- Image: `group-hover:scale-110` for zoom
- Gradient: slight opacity increase on hover
- Arrow: slide in animation on hover

---

### 4. Bestseller Products Section - Show 12 Products

**Current**: Shows 8 products (`bestsellers.slice(0, 8)`)

**Change**: Update to show 12 products (`bestsellers.slice(0, 12)`)

**Note**: Current data has only 7 bestseller products. To show 12, we'll need to either:
- Mark more existing products as bestsellers, OR
- Display all bestsellers available (up to 12 if they exist)

---

### 5. Footer Enhancements

**Add new column: "Track Your Order"**
- Add a new column in the footer grid
- Include a clickable "Track Order" link
- Style consistently with other footer links

**Add new policy: "Return & Refund Policy"**
- Add to the bottom policy links section
- Link to `/returns` route (or anchor)

**Updated footer structure** (5 columns on desktop):
1. Brand & Social
2. Quick Links  
3. Categories
4. Track Your Order (NEW)
5. Contact Us

---

### 6. Contact Page Form Improvements

**Add Phone Field**:
- Add a phone input field to the contact form
- Place it in the same row as email (3-column grid on larger screens)

**Size Alignment**:
- Make the form card equal in visual weight to the contact info sidebar
- Currently: form is `md:col-span-2`, sidebar is `md:col-span-1` (2:1 ratio)
- Change to equal columns or adjust the layout so both sections are balanced
- Increase the message textarea rows for a taller form

**Layout options**:
- Change grid to 2 equal columns (`md:col-span-1` each)
- Increase form padding and input sizes

---

### Technical Details

#### Files to Modify

**1. `index.html`**
- Add favicon link: `<link rel="icon" href="/logo.png" type="image/png">`

**2. `src/components/layout/Header.tsx`**
- Replace Twitter icon with custom X icon SVG
- Add YouTube icon at extreme left
- Restructure top bar: YouTube | Facebook | Instagram | X | Threads | separator | Phone | WhatsApp icon + number
- Remove "Order via WhatsApp" button from right actions
- Replace text logo with image logo (import from assets)
- Increase search bar: `max-w-xl` and larger padding

**3. `src/components/layout/Footer.tsx`**
- Add new "Track Your Order" column
- Add "Return & Refund Policy" to bottom links
- Replace text logo with image logo

**4. `src/components/products/CategoryCard.tsx`**
- Add `group` class to the Link element
- Enhance hover animations on image
- Add smooth transform transitions

**5. `src/index.css`**
- Update `.category-card` class with enhanced hover effects

**6. `src/components/home/BestsellerProducts.tsx`**
- Change `bestsellers.slice(0, 8)` to `bestsellers.slice(0, 12)`

**7. `src/pages/Contact.tsx`**
- Add `phone` field to form state
- Add phone input in the form grid
- Adjust grid layout for equal column widths
- Increase textarea rows

**8. Copy logo file**
- Copy `user-uploads://bongo_logo.jpeg` to `public/logo.png`
- Copy `user-uploads://bongo_logo.jpeg` to `src/assets/logo.png`

---

### Visual Specifications

**X (Twitter) Icon SVG**:
```svg
<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
```

**YouTube Icon**: Use Lucide's `Youtube` component

**Logo dimensions**: 
- Header: Height 40-48px on desktop, 32-36px on mobile
- Maintain aspect ratio

**Category Card Hover**:
- Transform: translateY(-8px)
- Image scale: 1.1
- Transition: 300ms ease-out
- Shadow: shadow-card-hover

