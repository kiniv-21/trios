/*
  # Add site content/settings table for admin-editable UI content
  Tables:
    - `site_content` - Store hero, about, contact, footer text and other UI content
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  section text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Site content is publicly readable" ON site_content;
DROP POLICY IF EXISTS "Admin can manage site content" ON site_content;
DROP POLICY IF EXISTS "Admin can update site content" ON site_content;
DROP POLICY IF EXISTS "Admin can delete site content" ON site_content;

-- Public read access for all content
CREATE POLICY "Site content is publicly readable"
  ON site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-only insert/update/delete
CREATE POLICY "Admin can manage site content"
  ON site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin can update site content"
  ON site_content
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin can delete site content"
  ON site_content
  FOR DELETE
  TO authenticated
  USING (public.is_admin_user());

-- Insert default site content
INSERT INTO site_content (key, value, section)
VALUES
  ('hero_title', 'Artistry Meets Sustainable Fashion', 'hero'),
  ('hero_description', 'Each Trios Art bag is a unique canvas showcasing handcrafted artistry on eco-friendly materials. Discover our collection of sustainable fashion statements.', 'hero'),
  ('collection_title', 'Our Collection', 'collection'),
  ('collection_description', 'Explore our unique hand-painted products, each piece crafted with care and artistic vision.', 'collection'),
  ('about_title', 'Sustainability at Our Core', 'about'),
  ('about_description', 'At Trios Art, sustainability isn''t just a buzzword—it''s our foundation. We believe that fashion and environmental responsibility can coexist beautifully.', 'about'),
  ('about_bullet_1_title', 'Eco-Friendly Materials', 'about_bullets'),
  ('about_bullet_1_desc', 'Most of our products are made of 100% natural materials', 'about_bullets'),
  ('about_bullet_2_title', 'Wash-Proof Paints', 'about_bullets'),
  ('about_bullet_2_desc', 'The paint we use is wash proof; jute materials should only be air-dried', 'about_bullets'),
  ('contact_title', 'Get in Touch', 'contact'),
  ('contact_description', 'Interested in our products? Contact us for custom orders or inquiries.', 'contact'),
  ('contact_email', 'info@triosart.com', 'contact'),
  ('contact_phone', '+91 98454 98171', 'contact'),
  ('contact_location', 'Bengaluru, Karnataka, India', 'contact'),
  ('footer_copyright', '© {} Trios Art. All rights reserved.', 'footer'),
  ('footer_description', 'Handcrafted with sustainable materials and ethical practices.', 'footer'),
  ('social_facebook', '#', 'social'),
  ('social_instagram', '#', 'social'),
  ('social_twitter', '#', 'social')
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
