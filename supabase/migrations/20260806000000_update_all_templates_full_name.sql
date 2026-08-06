-- Update all templates (user-owned and sample) to use full_name_with_titles
-- Safe: full_name_with_titles falls back to the same value as full_name for people without titles
UPDATE templates
SET config = replace(config::text, '"boundField": "full_name"', '"boundField": "full_name_with_titles"')::jsonb
WHERE config::text LIKE '%"boundField": "full_name"%';
