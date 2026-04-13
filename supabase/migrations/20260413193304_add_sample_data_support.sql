-- Add is_sample flag to all content tables
  ALTER TABLE companies ADD COLUMN is_sample boolean DEFAULT false;
  ALTER TABLE people ADD COLUMN is_sample boolean DEFAULT false;
  ALTER TABLE templates ADD COLUMN is_sample boolean DEFAULT false;

  -- Allow anyone (including unauthenticated) to read sample data
  CREATE POLICY "Anyone can view sample companies"
  ON companies FOR SELECT
  USING (is_sample = true);

  CREATE POLICY "Anyone can view sample people"
  ON people FOR SELECT
  USING (is_sample = true);

  CREATE POLICY "Anyone can view sample templates"
  ON templates FOR SELECT
  USING (is_sample = true);