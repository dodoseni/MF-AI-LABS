-- ============================================================================
-- LevelUp: Azure SQL data model
-- ----------------------------------------------------------------------------
-- Scope (MVP): users, certifications (with the certification matrix), the
-- five competency areas (Sales, Delivery, Manage, Entrepreneurship, Develop),
-- competency requirements, the Job Family framework, career levels, and user
-- progression records.
--
-- Design principles ("bare minimum architecture", clean + extensible):
--   * Reference/catalog tables (certifications, career levels, requirements,
--     job families, competency areas) hold non-sensitive platform data and
--     carry no tenant attributive data beyond a name/order.
--   * User-owned tables (certifications earned, competency self-assessments,
--     career position, development goals) hold sensitive employee data. They
--     all carry owner_id + tenant_id so access control (row-level) and privacy
--     can be enforced consistently.
--   * Soft delete via deleted_at on user tables; hard catalog rows are
--     versioned by updated_at only.
--   * SQL Server / Azure SQL Database T-SQL. Idempotent-friendly: uses
--     DROP ... IF EXISTS guards suitable for a setup script.
--
-- Convention: NCHAR(36) = text GUID from the application; BIGINT IDENTITY is
-- used only where the app has no natural key. Auditing columns (created_by /
-- updated_by) reference the app principal id (AAD/service), not a DB user.
-- ============================================================================

PRINT 'Creating LevelUp schema...';
GO

-- ---------------------------------------------------------------------------
-- 1. Reference / catalog tables (non-sensitive)
-- ---------------------------------------------------------------------------

-- The fixed Job Family framework levels (consultant track). Extensible: the
-- same table can host other job families via the "family_code" column.
IF OBJECT_ID(N'dbo.job_family_level', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.job_family_level (
        -- family_code groups levels into a family track (e.g. 'consultant',
        -- 'management'). Defaults to 'consultant' for the MVP.
        family_code         NVARCHAR(50)  NOT NULL,
        level_code          NVARCHAR(50)  NOT NULL,   -- e.g. 'consultant'
        display_name        NVARCHAR(100) NOT NULL,   -- e.g. 'Consultant'
        sort_order          INT           NOT NULL DEFAULT 0,
        min_years_experience NVARCHAR(20) NULL,
        description         NVARCHAR(500) NULL,
        is_active           BIT           NOT NULL DEFAULT 1,
        CONSTRAINT PK_job_family_level PRIMARY KEY (family_code, level_code),
        CONSTRAINT UQ_job_family_level_display UNIQUE (display_name)
    );
END
GO

-- The five competency areas defined by the Job Family framework.
IF OBJECT_ID(N'dbo.competency_area', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.competency_area (
        code        NVARCHAR(30)  NOT NULL,           -- 'Sales','Delivery','Manage','Entrepreneurship','Develop'
        label       NVARCHAR(50)  NOT NULL,
        [description] NVARCHAR(500) NULL,
        sort_order  INT           NOT NULL DEFAULT 0,
        is_active   BIT           NOT NULL DEFAULT 1,
        CONSTRAINT PK_competency_area PRIMARY KEY (code)
    );
END
GO

-- Master catalog of certifications relevant to a job family level.
IF OBJECT_ID(N'dbo.certification', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.certification (
        certification_id NVARCHAR(40)  NOT NULL,       -- e.g. 'az-305'
        [name]           NVARCHAR(200) NOT NULL,       -- e.g. 'Azure Solutions Architect Expert'
        issuer           NVARCHAR(100) NOT NULL,       -- e.g. 'Microsoft'
        category         NVARCHAR(60)  NULL,           -- 'Cloud', 'Security', ...
        [level]          NVARCHAR(30)  NULL,           -- 'Associate'|'Professional'|'Specialist'|'Expert'
        [description]    NVARCHAR(1000) NULL,
        source_url       NVARCHAR(500) NULL,           -- Microsoft Learn / vendor page
        is_active        BIT           NOT NULL DEFAULT 1,
        created_at       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_certification PRIMARY KEY (certification_id)
    );
END
GO

-- The certification matrix: which certifications are required for which
-- job-family level (each certification can be required for many levels).
IF OBJECT_ID(N'dbo.certification_requirement', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.certification_requirement (
        certification_id NVARCHAR(40) NOT NULL,
        family_code      NVARCHAR(50) NOT NULL,
        level_code       NVARCHAR(50) NOT NULL,
        is_required      BIT          NOT NULL DEFAULT 1,
        CONSTRAINT PK_certification_requirement
            PRIMARY KEY (certification_id, family_code, level_code),
        CONSTRAINT FK_certreq_cert
            FOREIGN KEY (certification_id) REFERENCES dbo.certification (certification_id),
        CONSTRAINT FK_certreq_level
            FOREIGN KEY (family_code, level_code)
            REFERENCES dbo.job_family_level (family_code, level_code)
    );
END
GO

-- Competency requirements per job-family level (target level per area).
IF OBJECT_ID(N'dbo.competency_requirement', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.competency_requirement (
        family_code NVARCHAR(50) NOT NULL,
        level_code  NVARCHAR(50) NOT NULL,
        area_code   NVARCHAR(30) NOT NULL,
        target_level INT         NOT NULL,             -- required self-assessment (1..5)
        CONSTRAINT PK_competency_requirement
            PRIMARY KEY (family_code, level_code, area_code),
        CONSTRAINT FK_compreq_level
            FOREIGN KEY (family_code, level_code)
            REFERENCES dbo.job_family_level (family_code, level_code),
        CONSTRAINT FK_compreq_area
            FOREIGN KEY (area_code) REFERENCES dbo.competency_area (code),
        CONSTRAINT CK_compreq_target CHECK (target_level BETWEEN 1 AND 5)
    );
END
GO

-- Career level visualization is driven by these levels; names may differ from
-- the strict job-family codes, so we keep a thin view/overlay table that the
-- UI and gap analysis can query directly.
IF OBJECT_ID(N'dbo.career_level', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.career_level (
        level_code        NVARCHAR(50) NOT NULL,       -- matches job_family_level.level_code
        display_name      NVARCHAR(100) NOT NULL,
        [role]            NVARCHAR(100) NULL,
        years_experience  NVARCHAR(20) NULL,
        color_hex         CHAR(7)       NULL,          -- UI accent colour, e.g. '#2563eb'
        sort_order        INT           NOT NULL DEFAULT 0,
        is_active         BIT           NOT NULL DEFAULT 1,
        CONSTRAINT PK_career_level PRIMARY KEY (level_code)
    );
END
GO

-- ---------------------------------------------------------------------------
-- 2. User / progression tables (sensitive employee data)
-- ---------------------------------------------------------------------------

-- A platform user (consultant). owner_id + tenant_id enable row-level access
-- control. MVP uses a single tenant; columns are modelled now to avoid a
-- painful migration later.
IF OBJECT_ID(N'dbo.app_user', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.app_user (
        user_id        NCHAR(36)     NOT NULL,         -- app/GUID identifier
        tenant_id      NCHAR(36)     NOT NULL,         -- row-level isolation scope
        display_name   NVARCHAR(200) NOT NULL,
        [role]         NVARCHAR(100) NULL,             -- e.g. 'Senior Consultant'
        office         NVARCHAR(100) NULL,
        member_since   INT           NULL,             -- year, e.g. 2019
        hire_date      DATE          NULL,
        current_family NVARCHAR(50)  NOT NULL DEFAULT 'consultant',
        current_level  NVARCHAR(50)  NOT NULL,         -- job_family_level.level_code
        is_active      BIT           NOT NULL DEFAULT 1,
        deleted_at     DATETIME2     NULL,             -- soft delete
        created_at     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_app_user PRIMARY KEY (user_id),
        -- speed up tenant-scoped reads
        CONSTRAINT UQ_app_user UNIQUE (tenant_id, user_id)
    );
END
GO

-- A user's certification record (earned / in-progress / tracked).
IF OBJECT_ID(N'dbo.user_certification', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_certification (
        id              BIGINT IDENTITY(1,1) NOT NULL,
        tenant_id       NCHAR(36)  NOT NULL,
        user_id         NCHAR(36)  NOT NULL,
        certification_id NVARCHAR(40) NOT NULL,
        [status]        NVARCHAR(20) NOT NULL,         -- 'completed'|'in-progress'|'missing'|'recommended'
        earned_date     DATE       NULL,
        progress_pct    INT        NOT NULL DEFAULT 0, -- 0..100 for in-progress
        source_document NVARCHAR(500) NULL,            -- PDF/SharePoint/Learn ref, MVP raw text
        verified_by     NVARCHAR(100) NULL,            -- AAD id of verifier
        verified_at     DATETIME2  NULL,
        created_at      DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at      DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at      DATETIME2  NULL,
        CONSTRAINT PK_user_certification PRIMARY KEY (id),
        CONSTRAINT UQ_user_cert UNIQUE (user_id, certification_id),
        CONSTRAINT FK_usercert_user
            FOREIGN KEY (user_id) REFERENCES dbo.app_user (user_id),
        CONSTRAINT FK_usercert_cert
            FOREIGN KEY (certification_id) REFERENCES dbo.certification (certification_id),
        CONSTRAINT CK_usercert_status
            CHECK ([status] IN ('completed','in-progress','missing','recommended')),
        CONSTRAINT CK_usercert_progress CHECK (progress_pct BETWEEN 0 AND 100)
    );
END
GO

-- A user's competency self-assessment per area. current/target/previous allow
-- the dashboard trend ("previous -> current") and gap analysis
-- (target - current). A review_period_key lets us keep history across
-- assessment cycles.
IF OBJECT_ID(N'dbo.user_competency', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_competency (
        id          BIGINT IDENTITY(1,1) NOT NULL,
        tenant_id   NCHAR(36)  NOT NULL,
        user_id     NCHAR(36)  NOT NULL,
        area_code   NVARCHAR(30) NOT NULL,
        current_level INT NOT NULL DEFAULT 0,          -- self-assessment 1..5
        target_level INT NOT NULL DEFAULT 0,           -- agreed target 1..5
        previous_level INT NOT NULL DEFAULT 0,         -- last cycle value
        review_period_key NVARCHAR(20) NULL,           -- e.g. '2026-H2'
        created_at  DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at  DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at  DATETIME2  NULL,
        CONSTRAINT PK_user_competency PRIMARY KEY (id),
        CONSTRAINT UQ_user_competency UNIQUE (user_id, area_code, review_period_key),
        CONSTRAINT FK_usercomp_user
            FOREIGN KEY (user_id) REFERENCES dbo.app_user (user_id),
        CONSTRAINT FK_usercomp_area
            FOREIGN KEY (area_code) REFERENCES dbo.competency_area (code),
        CONSTRAINT CK_usercomp_current CHECK (current_level BETWEEN 0 AND 5),
        CONSTRAINT CK_usercomp_target  CHECK (target_level  BETWEEN 0 AND 5),
        CONSTRAINT CK_usercomp_prev    CHECK (previous_level BETWEEN 0 AND 5)
    );
END
GO

-- A user's place on the career path (which level, how far toward next).
IF OBJECT_ID(N'dbo.user_career', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.user_career (
        id            BIGINT IDENTITY(1,1) NOT NULL,
        tenant_id     NCHAR(36) NOT NULL,
        user_id       NCHAR(36) NOT NULL,
        level_code    NVARCHAR(50) NOT NULL,           -- current career_level
        next_level    NVARCHAR(50) NULL,               -- career_level targeted next
        progress_pct  INT NOT NULL DEFAULT 0,          -- 0..100 toward next level
        [status]      NVARCHAR(20) NOT NULL DEFAULT 'current', -- 'completed'|'current'|'upcoming'
        started_at    DATETIME2 NULL,
        achieved_at   DATETIME2 NULL,
        created_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at    DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at    DATETIME2 NULL,
        CONSTRAINT PK_user_career PRIMARY KEY (id),
        CONSTRAINT UQ_user_career UNIQUE (user_id, level_code),
        CONSTRAINT FK_usercareer_user
            FOREIGN KEY (user_id) REFERENCES dbo.app_user (user_id),
        CONSTRAINT FK_usercareer_level
            FOREIGN KEY (level_code) REFERENCES dbo.career_level (level_code),
        CONSTRAINT CK_usercareer_progress CHECK (progress_pct BETWEEN 0 AND 100)
    );
END
GO

-- Development goals (with milestones) power progress tracking and the learning
-- plan / AI recommendations.
IF OBJECT_ID(N'dbo.development_goal', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.development_goal (
        id          BIGINT IDENTITY(1,1) NOT NULL,
        tenant_id   NCHAR(36) NOT NULL,
        user_id     NCHAR(36) NOT NULL,
        title       NVARCHAR(300) NOT NULL,
        category    NVARCHAR(60) NOT NULL,             -- 'Certification'|'Competency'|'Learning'|'Develop'|...
        [status]    NVARCHAR(20) NOT NULL DEFAULT 'active', -- 'active'|'in-progress'|'completed'
        progress_pct INT NOT NULL DEFAULT 0,
        due_date    DATE NULL,
        created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at  DATETIME2 NULL,
        CONSTRAINT PK_development_goal PRIMARY KEY (id),
        CONSTRAINT FK_goal_user FOREIGN KEY (user_id) REFERENCES dbo.app_user (user_id),
        CONSTRAINT CK_goal_status CHECK ([status] IN ('active','in-progress','completed')),
        CONSTRAINT CK_goal_progress CHECK (progress_pct BETWEEN 0 AND 100)
    );
END
GO

IF OBJECT_ID(N'dbo.goal_milestone', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.goal_milestone (
        id           BIGINT IDENTITY(1,1) NOT NULL,
        goal_id      BIGINT NOT NULL,
        label        NVARCHAR(300) NOT NULL,
        due_date     DATE NULL,
        is_done      BIT NOT NULL DEFAULT 0,
        created_at   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at   DATETIME2 NULL,
        CONSTRAINT PK_goal_milestone PRIMARY KEY (id),
        CONSTRAINT FK_milestone_goal
            FOREIGN KEY (goal_id) REFERENCES dbo.development_goal (id)
    );
END
GO

-- Study-plan / learning items referenced from recommendations and the learning
-- plan page. Kept minimal for the MVP.
IF OBJECT_ID(N'dbo.study_plan_item', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.study_plan_item (
        id          BIGINT IDENTITY(1,1) NOT NULL,
        tenant_id   NCHAR(36) NOT NULL,
        user_id     NCHAR(36) NOT NULL,
        title       NVARCHAR(300) NOT NULL,
        [source]    NVARCHAR(200) NULL,                -- 'Microsoft Learn', book, vendor
        duration    NVARCHAR(30) NULL,                 -- raw, e.g. '4h 30m'
        is_completed BIT NOT NULL DEFAULT 0,
        item_type   NVARCHAR(30) NOT NULL,             -- 'course'|'certification'|'reading'|'practice'
        created_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at  DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        deleted_at  DATETIME2 NULL,
        CONSTRAINT PK_study_plan_item PRIMARY KEY (id),
        CONSTRAINT FK_study_user FOREIGN KEY (user_id) REFERENCES dbo.app_user (user_id)
    );
END
GO

PRINT 'LevelUp schema created.';
GO
