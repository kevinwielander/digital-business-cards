-- Custom fields stored as JSONB on people: {"department": "Engineering", "linkedin": "..."}
ALTER TABLE people ADD COLUMN custom_fields jsonb DEFAULT '{}'::jsonb;

-- Custom field definitions on companies: [{"key": "department", "label": "Department"}, ...]
-- This defines which custom fields are available for people in this company
ALTER TABLE companies ADD COLUMN custom_field_definitions jsonb DEFAULT '[]'::jsonb;
