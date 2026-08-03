-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  location text,
  text text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read active testimonials on the storefront
CREATE POLICY "Public read active testimonials"
  ON testimonials FOR SELECT
  USING (active = true);

-- Admins can do everything
CREATE POLICY "Admin full access to testimonials"
  ON testimonials FOR ALL
  USING (is_admin_user())
  WITH CHECK (is_admin_user());
