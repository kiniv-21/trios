BEGIN;

CREATE OR REPLACE FUNCTION public.delete_admin_product(product_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_user() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Only admins can delete products.';
  END IF;

  DELETE FROM public.products
  WHERE id = product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found.';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_admin_product(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_admin_product(uuid) TO authenticated;

COMMIT;
