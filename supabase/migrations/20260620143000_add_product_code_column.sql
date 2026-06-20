/*
  # Add editable public product code for storefront/admin references
*/

ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_code text;

WITH ranked_products AS (
  SELECT
    id,
    upper(coalesce(nullif(substr(regexp_replace(category, '[^a-zA-Z]', '', 'g'), 1, 3), ''), 'PRD')) AS prefix,
    row_number() OVER (
      PARTITION BY category
      ORDER BY created_at, id
    ) AS sequence
  FROM products
  WHERE product_code IS NULL
)
UPDATE products p
SET product_code = rp.prefix || '-' || lpad(rp.sequence::text, 3, '0')
FROM ranked_products rp
WHERE p.id = rp.id
  AND p.product_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS products_product_code_unique_idx
ON products ((upper(product_code)))
WHERE product_code IS NOT NULL;
