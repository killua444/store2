-- Shadow Wear Store Database Setup
-- Copy and paste this entire script into your Supabase SQL Editor
-- Project: https://fmmjhmzmjbyeksrabbnu.supabase.co

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  image TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  colors TEXT[],
  sizes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  store_name TEXT DEFAULT 'Shadow Wear',
  owner_phone_e164 TEXT DEFAULT '212696952145',
  shipping_flat_mad DECIMAL(10,2) DEFAULT 30,
  free_shipping_threshold_mad DECIMAL(10,2) DEFAULT 500,
  promo_codes JSONB DEFAULT '[{"code": "WELCOME10", "type": "percent", "value": 10}]',
  theme_preset TEXT DEFAULT 'mint',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default settings
INSERT INTO settings (id, store_name, owner_phone_e164, shipping_flat_mad, free_shipping_threshold_mad, promo_codes, theme_preset)
VALUES (1, 'Shadow Wear', '212696952145', 30, 500, '[{"code": "WELCOME10", "type": "percent", "value": 10}]', 'mint')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert sample products
INSERT INTO products (id, title, brand, category, price, currency, image, rating, reviews, colors, sizes) VALUES
('shadow-hoodie', 'Shadow Essentials Hoodie', 'Shadow Wear', 'Hoodie', 299, 'MAD', 'https://shadowwear.netlify.app/images/shadow-hoodie.jpg', 4.8, 120, ARRAY['Emerald', 'Black', 'Ash'], ARRAY['S','M','L','XL']),
('shadow-tshirt', 'Shadow Classic T-Shirt', 'Shadow Wear', 'T-Shirt', 149, 'MAD', 'https://shadowwear.netlify.app/images/shadow-tshirt.jpg', 4.5, 85, ARRAY['White', 'Black', 'Gray'], ARRAY['S','M','L','XL']),
('shadow-pants', 'Shadow Jogger Pants', 'Shadow Wear', 'Pants', 199, 'MAD', 'https://shadowwear.netlify.app/images/shadow-pants.jpg', 4.7, 95, ARRAY['Black', 'Gray', 'Navy'], ARRAY['S','M','L','XL'])
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public read access
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on settings" ON settings;
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on orders" ON orders;
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);

-- 8. Create policies for admin write access
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on settings" ON settings;
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Add triggers for updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
