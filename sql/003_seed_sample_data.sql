-- ============================================================
-- Seed Sample Data: Example Buyer, Address, Orders & Admin
-- Run this AFTER 001_create_schema.sql and 002_seed_categories.sql
-- ============================================================
-- IMPORTANT: You must first create these users in Supabase Auth
-- (Dashboard → Authentication → Users → Add User):
--
-- 1. Buyer:  buyer@example.com  / password: Test@1234
-- 2. Admin:  admin@bongohridoy.com / password: Admin@1234
--
-- After creating them, copy their UUIDs and replace below:
-- ============================================================

-- Replace these with actual UUIDs from Supabase Auth after creating the users
-- Example UUIDs shown below – update them before running!

DO $$
DECLARE
  buyer_id  UUID := '00000000-0000-0000-0000-000000000001'; -- replace with real buyer UUID
  admin_id  UUID := '00000000-0000-0000-0000-000000000002'; -- replace with real admin UUID
  addr1_id  UUID := gen_random_uuid();
  addr2_id  UUID := gen_random_uuid();
  order1_id UUID := gen_random_uuid();
  order2_id UUID := gen_random_uuid();
  cat_snacks UUID;
  cat_dal    UUID;
  cat_oil    UUID;
  prod1_id   UUID := gen_random_uuid();
  prod2_id   UUID := gen_random_uuid();
  prod3_id   UUID := gen_random_uuid();
BEGIN

  -- ===================== PROFILES =====================
  -- (profiles are auto-created by trigger, but we ensure they exist)

  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES
    (buyer_id, 'Rina Mukherjee', '+91-9876543210', 'buyer@example.com'),
    (admin_id, 'Admin BongoHridoy', '+91-9000000001', 'admin@bongohridoy.com')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;

  -- ===================== ADMIN ROLE =====================

  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- ===================== BUYER ADDRESSES =====================

  INSERT INTO public.addresses (id, user_id, name, phone, address_line1, address_line2, city, state, country, pincode, is_default)
  VALUES
    (addr1_id, buyer_id, 'Rina Mukherjee', '+91-9876543210',
     '42/B, Lake Gardens', 'Near Deshapriya Park', 'Kolkata', 'West Bengal', 'India', '700029', true),
    (addr2_id, buyer_id, 'Rina Mukherjee (Office)', '+91-9876543210',
     '15, Park Street', '3rd Floor, Suite 302', 'Kolkata', 'West Bengal', 'India', '700016', false);

  -- ===================== SAMPLE PRODUCTS =====================
  -- Fetch category IDs

  SELECT id INTO cat_snacks FROM public.categories WHERE slug = 'snacks-homemade-pickles' LIMIT 1;
  SELECT id INTO cat_dal    FROM public.categories WHERE slug = 'lentils-dal-rice' LIMIT 1;
  SELECT id INTO cat_oil    FROM public.categories WHERE slug = 'oil-ghee' LIMIT 1;

  INSERT INTO public.products (id, name, slug, description, category_id, price, sale_price, purchase_price, sku, stock, weight, keywords, is_visible, is_bestseller)
  VALUES
    (prod1_id, 'Dulal Chandra Bhar Palm Candy (Tal Michri) 1kg',
     'dulal-chandra-bhar-palm-candy-tal-michri-1kg',
     'Authentic Tal Michri (Palm Candy) from the renowned Dulal Chandra Bhar. Made from pure palm jaggery.',
     cat_snacks, 249.00, 206.00, 150.00, 'SNK-001', 100, '1kg',
     ARRAY['palm candy','tal michri','bengali sweet','dulal chandra bhar'],
     true, true),

    (prod2_id, 'Gobindobhog Rice 5kg',
     'gobindobhog-rice-5kg',
     'Premium Gobindobhog rice – aromatic short-grain rice used in Bengali pujas and special occasions.',
     cat_dal, 750.00, 649.00, 500.00, 'DAL-001', 50, '5kg',
     ARRAY['gobindobhog','rice','bengali rice','aromatic rice'],
     true, true),

    (prod3_id, 'Pure Cow Ghee 1 Litre',
     'pure-cow-ghee-1litre',
     'Pure desi cow ghee made using traditional Bilona method. Rich in flavor and aroma.',
     cat_oil, 999.00, 850.00, 600.00, 'OIL-001', 30, '1L',
     ARRAY['cow ghee','pure ghee','bilona ghee','desi ghee'],
     true, true);

  -- Product images (4 per product)
  INSERT INTO public.product_images (product_id, image_url, alt_text, sort_order)
  VALUES
    (prod1_id, 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop', 'Palm Candy front', 0),
    (prod1_id, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop', 'Palm Candy side', 1),
    (prod1_id, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop', 'Palm Candy pack', 2),
    (prod1_id, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop', 'Palm Candy close-up', 3),

    (prod2_id, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', 'Gobindobhog Rice bag', 0),
    (prod2_id, 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&h=600&fit=crop', 'Rice grains close-up', 1),
    (prod2_id, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', 'Rice cooked', 2),
    (prod2_id, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop', 'Rice packaging', 3),

    (prod3_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 'Cow Ghee jar', 0),
    (prod3_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 'Ghee texture', 1),
    (prod3_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 'Ghee label', 2),
    (prod3_id, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 'Ghee in spoon', 3);

  -- ===================== BUYER WISHLIST =====================

  INSERT INTO public.wishlists (user_id, product_id)
  VALUES
    (buyer_id, prod1_id),
    (buyer_id, prod3_id);

  -- ===================== ORDERS =====================

  -- Order 1: Delivered
  INSERT INTO public.orders (id, user_id, status, total_amount, payment_status, payment_method, address_id, notes)
  VALUES
    (order1_id, buyer_id, 'delivered', 855.00, 'paid', 'UPI',
     addr1_id, 'Please deliver before 5 PM');

  INSERT INTO public.order_items (order_id, product_id, quantity, price_snapshot, product_name_snapshot)
  VALUES
    (order1_id, prod1_id, 1, 206.00, 'Dulal Chandra Bhar Palm Candy (Tal Michri) 1kg'),
    (order1_id, prod2_id, 1, 649.00, 'Gobindobhog Rice 5kg');

  -- Order 2: Processing
  INSERT INTO public.orders (id, user_id, status, total_amount, payment_status, payment_method, address_id)
  VALUES
    (order2_id, buyer_id, 'processing', 850.00, 'paid', 'Card', addr2_id);

  INSERT INTO public.order_items (order_id, product_id, quantity, price_snapshot, product_name_snapshot)
  VALUES
    (order2_id, prod3_id, 1, 850.00, 'Pure Cow Ghee 1 Litre');

  RAISE NOTICE 'Seed data inserted successfully!';
END $$;
