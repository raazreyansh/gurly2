-- ============================================================
-- GURLLY — Migration 002: Checkout Schema
-- ============================================================

-- Addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  line1 TEXT,
  line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE
);

-- Coupons
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  type TEXT CHECK (type IN ('flat', 'percent')),
  value NUMERIC(10, 2),
  min_order NUMERIC(10, 2),
  expires_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY own_addresses ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Order items (junction between orders and products)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  title TEXT,
  price NUMERIC(10, 2),
  quantity INT DEFAULT 1,
  image TEXT
);
