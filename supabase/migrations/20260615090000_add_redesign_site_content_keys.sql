/*
  # Add additional site_content keys for redesigned storefront + admin editor
*/

INSERT INTO site_content (key, value, section)
VALUES
  ('brand_name', 'Trios Art', 'brand'),
  ('site_tab_title', 'Trios Art | Hand-Painted Jute Bags', 'seo'),
  ('site_meta_description', 'Trios Art offers unique hand-painted jute bags that combine artistic expression with sustainable fashion. Shop our collection of eco-friendly, stylish bags.', 'seo'),
  ('whatsapp_number', '+91 98454 98171', 'contact'),
  ('process_title', 'From Idea to Hand-Finished Piece', 'process'),
  ('process_description', '', 'process'),
  ('process_step_1', 'Concept', 'process'),
  ('process_step_2', 'Design', 'process'),
  ('process_step_3', 'Craft', 'process'),
  ('process_step_4', 'Finish', 'process'),
  ('process_step_5', 'Deliver', 'process')
ON CONFLICT (key) DO NOTHING;
