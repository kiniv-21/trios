ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS show_materials boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS materials_text text NOT NULL DEFAULT 'Natural jute base, hand-mixed fabric paints, artisan-finished trims.',
ADD COLUMN IF NOT EXISTS show_dimensions boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS dimensions_text text NOT NULL DEFAULT 'Available on request with piece-specific dimensions.',
ADD COLUMN IF NOT EXISTS show_customization boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS customization_text text NOT NULL DEFAULT 'Color palette, motif style, and naming personalization available.';

UPDATE public.products
SET
  show_materials = COALESCE(show_materials, true),
  materials_text = COALESCE(NULLIF(TRIM(materials_text), ''), 'Natural jute base, hand-mixed fabric paints, artisan-finished trims.'),
  show_dimensions = COALESCE(show_dimensions, true),
  dimensions_text = COALESCE(NULLIF(TRIM(dimensions_text), ''), 'Available on request with piece-specific dimensions.'),
  show_customization = COALESCE(show_customization, true),
  customization_text = COALESCE(NULLIF(TRIM(customization_text), ''), 'Color palette, motif style, and naming personalization available.');
