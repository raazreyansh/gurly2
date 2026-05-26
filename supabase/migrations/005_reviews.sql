-- ============================================================
-- GURLLY — Migration 005: Reviews
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_reviews_read ON reviews
  FOR SELECT USING (TRUE);

CREATE POLICY own_reviews_write ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
