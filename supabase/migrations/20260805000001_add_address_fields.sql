-- Add address to companies (office/default address for all people)
ALTER TABLE companies ADD COLUMN address text NOT NULL DEFAULT '';

-- Add address to people (overrides company address when set)
ALTER TABLE people ADD COLUMN address text NOT NULL DEFAULT '';
