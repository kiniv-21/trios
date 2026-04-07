BEGIN;

-- Ensure category column exists and is valid for all rows.
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category text;

UPDATE public.products
SET category = 'totes'
WHERE category IS NULL OR btrim(category) = '';

ALTER TABLE public.products
ALTER COLUMN category SET DEFAULT 'totes';

ALTER TABLE public.products
ALTER COLUMN category SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_products_category
ON public.products(category);

-- Ensure RLS is enabled.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Remove legacy permissive write policies so admin-only rules are effective.
DROP POLICY IF EXISTS "Products can be inserted" ON public.products;
DROP POLICY IF EXISTS "Products can be updated" ON public.products;
DROP POLICY IF EXISTS "Products can be deleted" ON public.products;

-- Admin-only insert policy.
DROP POLICY IF EXISTS "Admin can insert products" ON public.products;
CREATE POLICY "Admin can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_user());

-- Admin-only update policy (includes category updates).
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
CREATE POLICY "Admin can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Admin-only delete policy.
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;
CREATE POLICY "Admin can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.is_admin_user());

COMMIT;
