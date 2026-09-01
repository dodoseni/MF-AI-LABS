-- ============================================================================
-- LevelUp: seed data for reference/catalog tables
-- ----------------------------------------------------------------------------
-- Aligns with the MVP frontend mock data (levelup-frontend/src/data/mock.ts)
-- and the Job Family framework (consultant track).
--
-- Idempotent: only inserts if the target table is empty, safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------
-- Job family levels (consultant track)
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.job_family_level)
BEGIN
    INSERT INTO dbo.job_family_level
        (family_code, level_code, display_name, sort_order, min_years_experience, description)
    VALUES
        ('consultant', 'consultant', 'Consultant',        1, '0–3 years', 'Building a strong technical and consulting foundation while working in client delivery teams.'),
        ('consultant', 'senior',     'Senior Consultant', 2, '3–7 years', 'Taking more ownership of delivery and becoming a trusted advisor to clients.'),
        ('consultant', 'principal',  'Principal Consultant', 3, '7+ years', 'Leading major workstreams, shaping offerings and growing people around you.'),
        ('consultant', 'architect',  'Enterprise Architect', 4, '10+ years', 'Setting technical strategy and architecture direction across client organisations.'),
        ('consultant', 'expert',     'Expert',            5, NULL,       'Recognised authority in a specialist domain.');
END
GO

-- ---------------------------------------------------------------
-- Career level visualization overlay (drives career-path UI)
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.career_level)
BEGIN
    INSERT INTO dbo.career_level
        (level_code, display_name, [role], years_experience, color_hex, sort_order)
    VALUES
        ('consultant', 'Consultant',         'Consultant',         '0–3 years', '#2f6df0', 1),
        ('senior',     'Senior Consultant',  'Senior Consultant',  '3–7 years', '#2563eb', 2),
        ('principal',  'Principal Consultant','Principal Consultant','7+ years', '#7c3aed', 3),
        ('architect',  'Enterprise Architect','Enterprise Architect','10+ years','#0d9488', 4),
        ('expert',     'Expert',             'Expert',             NULL,        '#0f766e', 5);
END
GO

-- ---------------------------------------------------------------
-- The five competency areas
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.competency_area)
BEGIN
    INSERT INTO dbo.competency_area (code, label, [description], sort_order)
    VALUES
        ('Sales',            'Sales',            'Driving business development, identifying opportunities and winning work for Sopra Steria and clients.', 1),
        ('Delivery',         'Delivery',         'Delivering high-quality outcomes for clients with solid project and product execution.', 2),
        ('Manage',           'Manage',           'Leading teams, people development, stakeholder management and running project delivery.', 3),
        ('Entrepreneurship', 'Entrepreneurship', 'Innovating, building new offerings and taking ownership of commercial opportunities.', 4),
        ('Develop',          'Develop',          'Growing the competence, career and wellbeing of the people you work with.', 5);
END
GO

-- ---------------------------------------------------------------
-- Certification catalog (covers the MVP / mock set)
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.certification)
BEGIN
    INSERT INTO dbo.certification
        (certification_id, [name], issuer, category, [level], [description], source_url)
    VALUES
        ('az-900', 'Microsoft Azure Fundamentals',              'Microsoft', 'Cloud Platform', 'Associate',   'Foundational understanding of cloud services.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/'),
        ('az-104', 'Azure Administrator Associate',             'Microsoft', 'Cloud Platform', 'Associate',   'Implements, manages and monitors an organization''s Azure environment.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/'),
        ('az-204', 'Azure Developer Associate',                 'Microsoft', 'Development',   'Associate',   'Designs, builds, tests and maintains cloud applications and services on Azure.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/'),
        ('az-305', 'Azure Solutions Architect Expert',          'Microsoft', 'Architecture',  'Expert',      'Advanced subject matter expertise in designing cloud and hybrid solutions.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/'),
        ('sc-300', 'Identity and Access Administrator Associate','Microsoft','Security',       'Associate',   'Designs, implements and operates an organization''s identity and access management systems.', 'https://learn.microsoft.com/en-us/credentials/certifications/identity-access-administrator/'),
        ('az-400', 'DevOps Engineer Expert',                    'Microsoft', 'DevOps',         'Expert',      'Combines people, process and technology to continuously deliver valuable products and services.', 'https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/'),
        ('dp-203', 'Azure Data Engineer Associate',             'Microsoft', 'Data & AI',      'Associate',   'Integrates, transforms and consolidates data from various structured and unstructured data systems.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/'),
        ('ai-102', 'Azure AI Engineer Associate',               'Microsoft', 'Data & AI',      'Associate',   'Builds, manages and deploys AI solutions using Azure Cognitive Services.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/'),
        ('az-500', 'Azure Security Engineer Associate',         'Microsoft', 'Security',       'Associate',   'Implements, manages and monitors security for resources in Azure, multi-cloud and hybrid environments.', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/'),
        ('sc-100', 'Cybersecurity Architect Expert',            'Microsoft', 'Security',       'Expert',      'Translates security strategy and requirements into a security architecture.', 'https://learn.microsoft.com/en-us/credentials/certifications/cybersecurity-architect-expert/');
END
GO

-- ---------------------------------------------------------------
-- Certification matrix: which certs are required per level
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.certification_requirement)
BEGIN
    -- Consultant
    INSERT INTO dbo.certification_requirement (certification_id, family_code, level_code, is_required)
    VALUES ('az-900', 'consultant', 'consultant', 1);

    -- Senior Consultant
    INSERT INTO dbo.certification_requirement (certification_id, family_code, level_code, is_required)
    VALUES ('az-104', 'consultant', 'senior', 1),
           ('az-204', 'consultant', 'senior', 1);

    -- Principal Consultant
    INSERT INTO dbo.certification_requirement (certification_id, family_code, level_code, is_required)
    VALUES ('az-305', 'consultant', 'principal', 1),
           ('sc-300', 'consultant', 'principal', 1),
           ('az-500', 'consultant', 'principal', 1);

    -- Specialist overlays: recommended certifications are optional (is_required = 0)
    INSERT INTO dbo.certification_requirement (certification_id, family_code, level_code, is_required)
    VALUES ('dp-203', 'consultant', 'senior', 0),
           ('ai-102', 'consultant', 'senior', 0),
           ('sc-100', 'consultant', 'principal', 0),
           ('az-400', 'consultant', 'principal', 0);
END
GO

-- ---------------------------------------------------------------
-- Competency requirements per level (target self-assessment 1..5)
-- ---------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM dbo.competency_requirement)
BEGIN
    -- Consultant: baseline 2 across all areas
    INSERT INTO dbo.competency_requirement (family_code, level_code, area_code, target_level)
    SELECT 'consultant', 'consultant', code, 2 FROM dbo.competency_area;

    -- Senior Consultant: level 3
    INSERT INTO dbo.competency_requirement (family_code, level_code, area_code, target_level)
    SELECT 'consultant', 'senior', code, 3 FROM dbo.competency_area;

    -- Principal Consultant: Delivery/Develop 4, Sales/Manage/Entrepreneurship 4
    INSERT INTO dbo.competency_requirement (family_code, level_code, area_code, target_level)
    VALUES ('consultant', 'principal', 'Sales', 4),
           ('consultant', 'principal', 'Delivery', 4),
           ('consultant', 'principal', 'Manage', 4),
           ('consultant', 'principal', 'Entrepreneurship', 4),
           ('consultant', 'principal', 'Develop', 4);

    -- Enterprise Architect: 4 across areas, 5 in Develop
    INSERT INTO dbo.competency_requirement (family_code, level_code, area_code, target_level)
    VALUES ('consultant', 'architect', 'Sales', 4),
           ('consultant', 'architect', 'Delivery', 4),
           ('consultant', 'architect', 'Manage', 4),
           ('consultant', 'architect', 'Entrepreneurship', 4),
           ('consultant', 'architect', 'Develop', 5);
END
GO

PRINT 'LevelUp reference data seeded.';
GO
