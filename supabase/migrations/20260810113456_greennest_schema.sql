/*
# GreenNest Platform Schema

1. Overview
GreenNest is an online nursery & gardening services platform. Users browse and buy
plants/gardening products and book verified gardeners for home services.

2. New Tables
- `profiles` — extends auth.users with role (customer/vendor/admin), full_name, phone, city.
- `categories` — product categories (indoor plants, outdoor plants, seeds, pots, tools).
- `products` — nursery products with price, stock, care instructions, images, type.
- `nurseries` — nursery/vendor listings.
- `gardeners` — verified gardener profiles with specialties, rating, city.
- `services` — gardener service offerings (home gardening, lawn maintenance, pruning) with price.
- `orders` — customer product orders (status, total).
- `order_items` — line items per order.
- `bookings` — gardener service bookings (date, time, status).
- `reviews` — product & service reviews.

3. Security (RLS)
- profiles: owner-scoped (authenticated, auth.uid() = id).
- categories, products, nurseries, gardeners, services: public read (anon, authenticated);
  writes restricted to authenticated owners (vendor) — for demo, authenticated can insert.
- orders, order_items, bookings: owner-scoped to customer (auth.uid() = user_id).
- reviews: public read; authenticated insert with ownership check.

4. Notes
- user_id columns default to auth.uid() so client inserts omitting user_id succeed.
- All tables have RLS enabled.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  city text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','vendor','admin')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_categories" ON categories;
CREATE POLICY "insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

-- NURSERIES
CREATE TABLE IF NOT EXISTS nurseries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  description text DEFAULT '',
  verified boolean DEFAULT true,
  rating numeric(2,1) DEFAULT 4.5,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_nurseries" ON nurseries;
CREATE POLICY "read_nurseries" ON nurseries FOR SELECT
  TO anon, authenticated USING (true);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  nursery_id uuid REFERENCES nurseries(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  plant_type text DEFAULT '' CHECK (plant_type IN ('','indoor','outdoor','flowering')),
  image_url text DEFAULT '',
  care_instructions text DEFAULT '',
  description text DEFAULT '',
  featured boolean DEFAULT false,
  rating numeric(2,1) DEFAULT 4.5,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- GARDENERS
CREATE TABLE IF NOT EXISTS gardeners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  specialties text NOT NULL DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  rating numeric(2,1) DEFAULT 4.7,
  years_experience int DEFAULT 3,
  verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gardeners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_gardeners" ON gardeners;
CREATE POLICY "read_gardeners" ON gardeners FOR SELECT
  TO anon, authenticated USING (true);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gardener_id uuid REFERENCES gardeners(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  duration_mins int DEFAULT 60,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_services" ON services;
CREATE POLICY "read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','delivered','cancelled')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  shipping_address text DEFAULT '',
  city text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  quantity int NOT NULL DEFAULT 1,
  image_url text DEFAULT ''
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_order_items" ON order_items;
CREATE POLICY "insert_own_order_items" ON order_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  gardener_name text NOT NULL DEFAULT '',
  service_name text NOT NULL DEFAULT '',
  service_price numeric(10,2) NOT NULL DEFAULT 0,
  scheduled_date date NOT NULL,
  scheduled_time text NOT NULL,
  address text DEFAULT '',
  city text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  rating int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment text DEFAULT '',
  author_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_reviews" ON reviews;
CREATE POLICY "read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON reviews;
CREATE POLICY "insert_own_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_services_gardener ON services(gardener_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);