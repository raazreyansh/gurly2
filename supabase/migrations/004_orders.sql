-- ============================================================
-- GURLLY — Migration 004: Orders, Shipments, Returns, Notifications
-- ============================================================

-- Shipments
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  tracking_number TEXT,
  carrier TEXT,
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'packed', 'shipped', 'out_for_delivery', 'delivered')),
  estimated_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Returns
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  reason TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY own_notifications ON notifications
  FOR ALL USING (auth.uid() = user_id);
