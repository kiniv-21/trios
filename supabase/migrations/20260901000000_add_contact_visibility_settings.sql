/* Store visibility preferences for public contact options. */

INSERT INTO site_content (key, value, section)
VALUES
  ('show_whatsapp', 'true', 'contact'),
  ('show_contact_email', 'false', 'contact'),
  ('show_contact_phone', 'true', 'contact'),
  ('show_contact_location', 'true', 'contact')
ON CONFLICT (key) DO NOTHING;