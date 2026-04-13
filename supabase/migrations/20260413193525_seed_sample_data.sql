-- Create public bucket for sample assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('sample-assets', 'sample-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read from sample-assets bucket
CREATE POLICY "Anyone can view sample assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'sample-assets');

-- Allow service role to upload sample assets
CREATE POLICY "Service role can upload sample assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sample-assets');

-- Make user_id nullable for sample data
ALTER TABLE companies ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE templates ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample templates
INSERT INTO templates (id, user_id, name, config, is_sample) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Gradient Wave',
    '{"width":450,"height":260,"backgroundColor":"#0f172a","elements":[{"id":"s1","type":"shape","x":0,"y":0,"width":450,"height":100,"zIndex":1,"gradient":"linear-gradient(135deg, #667eea, #764ba2)"},{"id":"s2","type":"shape","x":-20,"y":70,"width":490,"height":60,"zIndex":2,"backgroundColor":"#0f172a","shapeRadius":999},{"id":"i1","type":"image","x":24,"y":18,"width":60,"height":36,"zIndex":3,"imageSource":"logo","objectFit":"contain"},{"id":"p1","type":"image","x":340,"y":30,"width":84,"height":84,"zIndex":4,"imageSource":"photo","objectFit":"cover","borderRadius":999,"boxShadow":"0 4px 20px rgba(0,0,0,0.4)"},{"id":"t1","type":"text","x":24,"y":105,"width":300,"height":30,"zIndex":3,"boundField":"full_name","fontSize":22,"fontWeight":"bold","color":"#ffffff","textShadow":"0 1px 2px rgba(0,0,0,0.2)"},{"id":"t2","type":"text","x":24,"y":135,"width":300,"height":22,"zIndex":3,"boundField":"title","fontSize":13,"color":"#94a3b8"},{"id":"t3","type":"text","x":24,"y":157,"width":300,"height":22,"zIndex":3,"boundField":"company","fontSize":13,"fontWeight":"500","color":"#a78bfa"},{"id":"s3","type":"shape","x":24,"y":188,"width":50,"height":2,"zIndex":3,"gradient":"linear-gradient(90deg, #667eea, #764ba2)","shapeRadius":2},{"id":"t4","type":"text","x":24,"y":200,"width":200,"height":18,"zIndex":3,"boundField":"email","fontSize":11,"color":"#64748b"},{"id":"t5","type":"text","x":24,"y":218,"width":200,"height":18,"zIndex":3,"boundField":"phone","fontSize":11,"color":"#64748b"},{"id":"t6","type":"text","x":24,"y":236,"width":200,"height":18,"zIndex":3,"boundField":"website","fontSize":11,"color":"#64748b"},{"id":"sc","type":"save-contact","x":330,"y":236,"width":110,"height":20,"zIndex":3,"fontSize":10,"color":"#a78bfa","fontWeight":"500","customText":"Save Contact"}]}'::jsonb,
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Photo Splash',
    '{"width":450,"height":260,"backgroundColor":"#ffffff","elements":[{"id":"p1","type":"image","x":0,"y":0,"width":180,"height":260,"zIndex":1,"imageSource":"photo","objectFit":"cover"},{"id":"s1","type":"shape","x":140,"y":0,"width":80,"height":260,"zIndex":2,"gradient":"linear-gradient(90deg, transparent, #ffffff)"},{"id":"i1","type":"image","x":340,"y":20,"width":90,"height":36,"zIndex":3,"imageSource":"logo","objectFit":"contain"},{"id":"t1","type":"text","x":200,"y":70,"width":230,"height":30,"zIndex":3,"boundField":"full_name","fontSize":20,"fontWeight":"bold","color":"#0f172a"},{"id":"t2","type":"text","x":200,"y":100,"width":230,"height":22,"zIndex":3,"boundField":"title","fontSize":12,"color":"#64748b"},{"id":"t3","type":"text","x":200,"y":122,"width":230,"height":22,"zIndex":3,"boundField":"company","fontSize":12,"fontWeight":"600","color":"#3b82f6"},{"id":"s2","type":"shape","x":200,"y":152,"width":40,"height":3,"zIndex":3,"backgroundColor":"#3b82f6","shapeRadius":2},{"id":"t4","type":"text","x":200,"y":168,"width":200,"height":16,"zIndex":3,"boundField":"email","fontSize":11,"color":"#94a3b8"},{"id":"t5","type":"text","x":200,"y":186,"width":200,"height":16,"zIndex":3,"boundField":"phone","fontSize":11,"color":"#94a3b8"},{"id":"t6","type":"text","x":200,"y":204,"width":200,"height":16,"zIndex":3,"boundField":"website","fontSize":11,"color":"#94a3b8"},{"id":"sc","type":"save-contact","x":200,"y":234,"width":110,"height":20,"zIndex":3,"fontSize":10,"color":"#3b82f6","fontWeight":"500","customText":"Save Contact"}]}'::jsonb,
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Neon Dark',
    '{"width":450,"height":260,"backgroundColor":"#0a0a0a","elements":[{"id":"s1","type":"shape","x":0,"y":0,"width":450,"height":4,"zIndex":1,"gradient":"linear-gradient(90deg, #f093fb, #f5576c, #ffd200)"},{"id":"i2","type":"image","x":260,"y":40,"width":180,"height":180,"zIndex":1,"imageSource":"logo","objectFit":"contain","imageOpacity":0.06},{"id":"p1","type":"image","x":24,"y":30,"width":70,"height":70,"zIndex":3,"imageSource":"photo","objectFit":"cover","borderRadius":12,"boxShadow":"0 0 20px rgba(240,147,251,0.3)"},{"id":"t1","type":"text","x":110,"y":30,"width":280,"height":30,"zIndex":3,"boundField":"full_name","fontSize":22,"fontWeight":"bold","color":"#ffffff"},{"id":"t2","type":"text","x":110,"y":60,"width":280,"height":22,"zIndex":3,"boundField":"title","fontSize":12,"color":"#a1a1aa"},{"id":"t3","type":"text","x":110,"y":80,"width":280,"height":22,"zIndex":3,"boundField":"company","fontSize":12,"fontWeight":"600","color":"#f093fb"},{"id":"s2","type":"shape","x":24,"y":120,"width":400,"height":1,"zIndex":2,"gradient":"linear-gradient(90deg, #f093fb 0%, #f5576c 50%, transparent 100%)"},{"id":"t4","type":"text","x":24,"y":138,"width":180,"height":18,"zIndex":3,"boundField":"email","fontSize":11,"color":"#71717a"},{"id":"t5","type":"text","x":24,"y":158,"width":180,"height":18,"zIndex":3,"boundField":"phone","fontSize":11,"color":"#71717a"},{"id":"t6","type":"text","x":24,"y":178,"width":180,"height":18,"zIndex":3,"boundField":"website","fontSize":11,"color":"#71717a"},{"id":"sc","type":"save-contact","x":24,"y":230,"width":110,"height":20,"zIndex":3,"fontSize":10,"color":"#f093fb","fontWeight":"500","customText":"Save Contact"},{"id":"s3","type":"shape","x":0,"y":256,"width":450,"height":4,"zIndex":1,"gradient":"linear-gradient(90deg, #f093fb, #f5576c, #ffd200)"}]}'::jsonb,
    true
),
(
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Bold Split',
    '{"width":450,"height":260,"backgroundColor":"#ffffff","elements":[{"id":"s1","type":"shape","x":0,"y":0,"width":160,"height":260,"zIndex":1,"gradient":"linear-gradient(180deg, #4facfe, #00f2fe)"},{"id":"p1","type":"image","x":30,"y":40,"width":100,"height":100,"zIndex":3,"imageSource":"photo","objectFit":"cover","borderRadius":999,"boxShadow":"0 8px 30px rgba(0,0,0,0.2)"},{"id":"i2","type":"image","x":30,"y":165,"width":100,"height":40,"zIndex":2,"imageSource":"logo","objectFit":"contain","imageOpacity":0.3},{"id":"t1","type":"text","x":185,"y":28,"width":245,"height":32,"zIndex":3,"boundField":"full_name","fontSize":24,"fontWeight":"bold","color":"#0f172a"},{"id":"t2","type":"text","x":185,"y":62,"width":245,"height":22,"zIndex":3,"boundField":"title","fontSize":13,"color":"#64748b"},{"id":"t3","type":"text","x":185,"y":84,"width":245,"height":22,"zIndex":3,"boundField":"company","fontSize":13,"fontWeight":"600","color":"#4facfe"},{"id":"s2","type":"shape","x":185,"y":116,"width":245,"height":1,"zIndex":2,"backgroundColor":"#e5e7eb"},{"id":"t4","type":"text","x":185,"y":130,"width":245,"height":18,"zIndex":3,"boundField":"email","fontSize":11,"color":"#6b7280"},{"id":"t5","type":"text","x":185,"y":150,"width":245,"height":18,"zIndex":3,"boundField":"phone","fontSize":11,"color":"#6b7280"},{"id":"t6","type":"text","x":185,"y":170,"width":245,"height":18,"zIndex":3,"boundField":"website","fontSize":11,"color":"#6b7280"},{"id":"sc","type":"save-contact","x":185,"y":232,"width":110,"height":20,"zIndex":3,"fontSize":10,"color":"#4facfe","fontWeight":"500","customText":"Save Contact"}]}'::jsonb,
    true
),
(
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Logo Background',
    '{"width":450,"height":260,"backgroundColor":"#111827","elements":[{"id":"i1","type":"image","x":0,"y":0,"width":450,"height":260,"zIndex":1,"imageSource":"logo","objectFit":"cover","imageOpacity":0.08},{"id":"s1","type":"shape","x":0,"y":0,"width":450,"height":260,"zIndex":2,"gradient":"linear-gradient(135deg, rgba(17,24,39,0.95), rgba(17,24,39,0.7))"},{"id":"i2","type":"image","x":24,"y":20,"width":80,"height":36,"zIndex":4,"imageSource":"logo","objectFit":"contain"},{"id":"p1","type":"image","x":340,"y":20,"width":90,"height":90,"zIndex":4,"imageSource":"photo","objectFit":"cover","borderRadius":16,"boxShadow":"0 8px 30px rgba(0,0,0,0.5)"},{"id":"t1","type":"text","x":24,"y":80,"width":300,"height":34,"zIndex":4,"boundField":"full_name","fontSize":26,"fontWeight":"bold","color":"#ffffff","textShadow":"0 2px 4px rgba(0,0,0,0.3)"},{"id":"t2","type":"text","x":24,"y":114,"width":300,"height":22,"zIndex":4,"boundField":"title","fontSize":13,"color":"#9ca3af"},{"id":"t3","type":"text","x":24,"y":136,"width":300,"height":22,"zIndex":4,"boundField":"company","fontSize":13,"fontWeight":"600","color":"#60a5fa"},{"id":"s2","type":"shape","x":24,"y":170,"width":400,"height":1,"zIndex":3,"backgroundColor":"#374151"},{"id":"t4","type":"text","x":24,"y":185,"width":180,"height":18,"zIndex":4,"boundField":"email","fontSize":11,"color":"#6b7280"},{"id":"t5","type":"text","x":24,"y":205,"width":180,"height":18,"zIndex":4,"boundField":"phone","fontSize":11,"color":"#6b7280"},{"id":"t6","type":"text","x":24,"y":225,"width":180,"height":18,"zIndex":4,"boundField":"website","fontSize":11,"color":"#6b7280"},{"id":"sc","type":"save-contact","x":330,"y":235,"width":110,"height":20,"zIndex":4,"fontSize":10,"color":"#60a5fa","fontWeight":"500","customText":"Save Contact"}]}'::jsonb,
    true
);

-- Insert sample companies
INSERT INTO companies (id, user_id, name, domain, website, logo_url, is_sample) VALUES
('00000000-0000-0000-0001-000000000001', NULL, 'Acme Corp', 'acme.com', 'https://acme.com', 'acme-logo.png', true),
('00000000-0000-0000-0001-000000000002', NULL, 'Nova Digital', 'novadigital.io', 'https://novadigital.io', 'nova-logo.png', true),
('00000000-0000-0000-0001-000000000003', NULL, 'Greenleaf Studios', 'greenleaf.studio', 'https://greenleaf.studio', 'greenleaf-logo.png', true);

-- Insert sample people
INSERT INTO people (id, company_id, template_id, first_name, last_name, title, email, phone, photo_url, is_sample) VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Sarah', 'Chen', 'CEO', 'sarah@acme.com', '+1 555 100 2000', 'sarah-chen.jpg', true),
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Marcus', 'Rivera', 'CTO', 'marcus@acme.com', '+1 555 100 2001', 'marcus-rivera.jpg', true),
('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Emily', 'Watson', 'Head of Design', 'emily@acme.com', '+1 555 100 2002', 'emily-watson.jpg', true),
('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Lisa', 'Andersen', 'Managing Director', 'lisa@novadigital.io', '+49 170 123 4567', 'lisa-andersen.jpg', true),
('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Tom', 'Bauer', 'Creative Director', 'tom@novadigital.io', '+49 170 123 4568', 'tom-bauer.jpg', true),
('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Alex', 'Morgan', 'Founder', 'alex@greenleaf.studio', '+44 7700 900100', 'alex-morgan.jpg', true),
('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Priya', 'Sharma', 'Senior Developer', 'priya@greenleaf.studio', '+44 7700 900101', 'priya-sharma.jpg', true);
