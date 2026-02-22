/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `price` (decimal, product price)
      - `description` (text, product description)
      - `images` (json array, array of image URLs stored in Supabase Storage)
      - `category` (text, product category)
      - `featured` (boolean, whether product is featured)
      - `in_stock` (boolean, stock status)
      - `rating` (decimal, product rating)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on products table
    - Add policy for public SELECT access (product catalog is public)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10, 2) NOT NULL,
  description text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  category text NOT NULL,
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  rating decimal(3, 1) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);
