-- ============================================================================
-- LevelUp: example views for MVP queries
-- ----------------------------------------------------------------------------
-- These are convenience views matching the frontend dashboard & career-path
-- reads (levelup-frontend). They are intentionally simple; the AI Engineer
-- can reuse the same relational joins for competency-gap analysis.
--
-- Idempotent: drops + recreates.
-- ============================================================================

-- Certification overview per user: join the mastered catalog with the user's
-- record to expose status, progress and which next level the cert unlocks.
IF OBJECT_ID(N'dbo.vw_user_certifications', N'V') IS NOT NULL
    DROP VIEW dbo.vw_user_certifications;
GO
CREATE VIEW dbo.vw_user_certifications AS
SELECT
    uc.user_id,
    uc.tenant_id,
    c.certification_id,
    c.name            AS certification_name,
    c.issuer,
    c.category,
    c.level           AS certification_level,
    uc.status,
    uc.earned_date,
    uc.progress_pct,
    cr.level_code     AS unlocks_level,
    cr.is_required
FROM dbo.user_certification uc
JOIN dbo.certification c
    ON c.certification_id = uc.certification_id
LEFT JOIN dbo.certification_requirement cr
    ON cr.certification_id = c.certification_id
    AND cr.family_code = (SELECT current_family FROM dbo.app_user u WHERE u.user_id = uc.user_id);
GO

-- Competency gap analysis per user: current vs required target for the user's
-- current level (and optionally next). Feeds the AI recommendations layer.
IF OBJECT_ID(N'dbo.vw_user_competency_gap', N'V') IS NOT NULL
    DROP VIEW dbo.vw_user_competency_gap;
GO
CREATE VIEW dbo.vw_user_competency_gap AS
SELECT
    u.user_id,
    u.tenant_id,
    ca.code   AS area_code,
    ca.label  AS area_label,
    uc.current_level,
    uc.target_level  AS agreed_target,
    ucr.target_level AS career_target,
    ucr.target_level - uc.current_level AS gap_to_career
FROM dbo.app_user u
JOIN dbo.competency_area ca
    ON 1 = 1
JOIN dbo.competency_requirement ucr
    ON ucr.family_code = u.current_family
    AND ucr.level_code = u.current_level
    AND ucr.area_code = ca.code
LEFT JOIN dbo.user_competency uc
    ON uc.user_id = u.user_id
    AND uc.area_code = ca.code
    AND uc.deleted_at IS NULL;
GO

-- Career-path progress per user: current level, next level, and overall %
-- toward the next level.
IF OBJECT_ID(N'dbo.vw_user_career_path', N'V') IS NOT NULL
    DROP VIEW dbo.vw_user_career_path;
GO
CREATE VIEW dbo.vw_user_career_path AS
SELECT
    u.user_id,
    u.tenant_id,
    u.display_name,
    cl.level_code,
    cl.display_name  AS level_name,
    cl.color_hex,
    ucr.progress_pct,
    ucr.[status]
FROM dbo.app_user u
JOIN dbo.user_career ucr ON ucr.user_id = u.user_id AND ucr.deleted_at IS NULL
JOIN dbo.career_level cl ON cl.level_code = ucr.level_code;
GO

PRINT 'LevelUp sample views created.';
GO
