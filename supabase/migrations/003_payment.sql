-- ============================================================
-- GURLLY — Migration 003: Payments + Inventory
-- ============================================================

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  provider TEXT,
  provider_order_id TEXT,
  provider_payment_id TEXT,
  amount NUMERIC(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_order ON payments(order_id);

-- Inventory
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  available INT DEFAULT 0,
  reserved INT DEFAULT 0
);

-- Reserve stock function
CREATE OR REPLACE FUNCTION reserve_stock(product UUID, qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET reserved = reserved + qty,
      available = available - qty
  WHERE product_id = product AND available >= qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', product;
  END IF;
END;
$$ LANGUAGE plpgsql;
