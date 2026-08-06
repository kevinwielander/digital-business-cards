-- Add academic title fields to people
ALTER TABLE people ADD COLUMN academic_prefix text NOT NULL DEFAULT '';
ALTER TABLE people ADD COLUMN academic_suffix text NOT NULL DEFAULT '';

-- Give sample people Austrian academic title examples
UPDATE people SET academic_prefix = 'Dr.'
WHERE id = '00000000-0000-0000-0002-000000000001';

UPDATE people SET academic_suffix = 'MSc.'
WHERE id = '00000000-0000-0000-0002-000000000005';

-- Update sample templates: swap full_name → full_name_with_titles
-- Note: Postgres formats JSONB with a space after the colon when cast to text
UPDATE templates
SET config = replace(config::text, '"boundField": "full_name"', '"boundField": "full_name_with_titles"')::jsonb
WHERE is_sample = true;
