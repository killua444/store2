-- Shadow Wear Store Database Setup
-- Run these commands in your Supabase SQL Editor

-- 1. Products Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  image TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  colors TEXT[], -- Array of color strings
  sizes TEXT[], -- Array of size strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Settings Table (single row configuration)
CREATE TABLE settings (
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
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL, -- Array of cart items
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default settings
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 5. Insert sample products (optional - you can add these through the admin panel)
INSERT INTO products (id, title, brand, category, price, currency, image, rating, reviews, colors, sizes) VALUES
('shadow-hoodie', 'Shadow Essentials Hoodie', 'Shadow Wear', 'Hoodie', 299, 'MAD', 'https://shadowwear.netlify.app/images/shadow-hoodie.jpg', 4.8, 120, ARRAY['Emerald', 'Black', 'Ash'], ARRAY['S','M','L','XL']),
('shadow-tshirt', 'Shadow Classic T-Shirt', 'Shadow Wear', 'T-Shirt', 149, 'MAD', 'https://shadowwear.netlify.app/images/shadow-tshirt.jpg', 4.5, 85, ARRAY['White', 'Black', 'Gray'], ARRAY['S','M','L','XL']),
('shadow-pants', 'Shadow Jogger Pants', 'Shadow Wear', 'Pants', 199, 'MAD', 'https://shadowwear.netlify.app/images/shadow-pants.jpg', 4.7, 95, ARRAY['Black', 'Gray', 'Navy'], ARRAY['S','M','L','XL']);

-- 6. Enable Row Level Security (RLS) for security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public read access
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);

-- 8. Create policies for admin write access (you'll need to set up authentication)
-- For now, allow all operations (secure this in production)
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);
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
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
