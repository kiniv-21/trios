CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_auth_settings (
  id integer PRIMARY KEY CHECK (id = 1),
  passcode_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Default placeholder passcode hash. Change this immediately in SQL editor.
INSERT INTO admin_auth_settings (id, passcode_hash)
VALUES (1, crypt('change-me-strong-passcode', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;

ALTER TABLE admin_auth_settings ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE admin_auth_settings FROM PUBLIC;
REVOKE ALL ON TABLE admin_auth_settings FROM anon;
REVOKE ALL ON TABLE admin_auth_settings FROM authenticated;

CREATE OR REPLACE FUNCTION verify_admin_passcode(input_passcode text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT passcode_hash INTO stored_hash
  FROM admin_auth_settings
  WHERE id = 1;

  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;

  RETURN crypt(input_passcode, stored_hash) = stored_hash;
END;
$$;

REVOKE ALL ON FUNCTION verify_admin_passcode(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION verify_admin_passcode(text) TO anon;
GRANT EXECUTE ON FUNCTION verify_admin_passcode(text) TO authenticated;
