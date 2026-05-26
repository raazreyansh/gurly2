-- ============================================================
-- GURLLY — Seed Data
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Earrings', 'earrings', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400'),
  ('Necklaces', 'necklaces', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'),
  ('Rings', 'rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'),
  ('Bracelets', 'bracelets', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'),
  ('Accessories', 'accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400');

-- Sample Products
INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Gold Hoop Earrings',
  'gold-hoop-earrings',
  'Elegant 18k gold plated hoops that go with everything. Perfect for day to night wear.',
  1499.00,
  1999.00,
  50,
  '["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600","https://images.unsplash.com/photo-1608042314453-ae338d5dc9b1?w=600"]'::jsonb,
  TRUE,
  id
FROM categories WHERE slug = 'earrings'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Crystal Drop Earrings',
  'crystal-drop-earrings',
  'Delicate crystal drops that catch the light beautifully. A must-have for special occasions.',
  899.00,
  1299.00,
  35,
  '["https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600"]'::jsonb,
  TRUE,
  id
FROM categories WHERE slug = 'earrings'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Pearl Pendant Necklace',
  'pearl-pendant-necklace',
  'Timeless freshwater pearl pendant on a delicate gold chain. The epitome of soft luxury.',
  2299.00,
  2999.00,
  20,
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"]'::jsonb,
  TRUE,
  id
FROM categories WHERE slug = 'necklaces'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Rose Gold Stacking Ring',
  'rose-gold-stacking-ring',
  'Dainty rose gold ring, perfect for stacking. Minimalist yet stunning.',
  699.00,
  999.00,
  80,
  '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600"]'::jsonb,
  FALSE,
  id
FROM categories WHERE slug = 'rings'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Butterfly Charm Bracelet',
  'butterfly-charm-bracelet',
  'Whimsical butterfly charms on a delicate chain. A symbol of transformation and beauty.',
  1299.00,
  1799.00,
  45,
  '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"]'::jsonb,
  TRUE,
  id
FROM categories WHERE slug = 'bracelets'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Silver Thread Earrings',
  'silver-thread-earrings',
  'Ultra-thin silver threads that move gracefully. Modern and sophisticated.',
  749.00,
  1099.00,
  60,
  '["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"]'::jsonb,
  FALSE,
  id
FROM categories WHERE slug = 'earrings'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Layered Chain Necklace',
  'layered-chain-necklace',
  'Pre-layered multi-chain necklace for effortless styling. Gold finish.',
  1899.00,
  2499.00,
  30,
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600"]'::jsonb,
  FALSE,
  id
FROM categories WHERE slug = 'necklaces'
LIMIT 1;

INSERT INTO products (title, slug, description, price, compare_at_price, stock, images, featured, category_id)
SELECT
  'Silk Hair Scrunchie Set',
  'silk-hair-scrunchie-set',
  'Set of 3 luxurious silk scrunchies in pastel shades. Gentle on hair, gorgeous on wrist.',
  499.00,
  699.00,
  100,
  '["https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600"]'::jsonb,
  FALSE,
  id
FROM categories WHERE slug = 'accessories'
LIMIT 1;

-- Seed coupons
INSERT INTO coupons (code, type, value, min_order) VALUES
  ('WELCOME10', 'percent', 10, 500),
  ('FLAT200', 'flat', 200, 1000),
  ('GURLLY15', 'percent', 15, 1500);
