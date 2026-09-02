-- LevelUp — Azure SQL smoke test: passwordless (Managed Identity) connectivity
-- Target: mikkelrev.database.windows.net / database "mikelrev"
-- Run as: an Azure AD administrator on the SQL Server (via Portal Query Editor
--         with AAD auth, SSMS, or Azure Data Studio — NOT the classic SQL admin
--         login; CREATE USER ... FROM EXTERNAL PROVIDER requires an AAD principal).
--
-- Purpose: prove the chain Multica Agent -> Backend API (levelup-api-dev) ->
-- Azure SQL, end-to-end, using the App Service's system-assigned Managed
-- Identity (no password / connection secret involved).
--
-- Scope: intentionally a throwaway smoke-test table, kept separate from the
-- real LevelUp data model (certifications/competencies/career levels), which
-- is a separate, not-yet-started effort. Drop this table once the connectivity
-- test is verified, or repurpose it if useful to keep around.

-- 1) Minimal test table
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Projects' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE dbo.Projects (
        Id        INT IDENTITY(1,1) PRIMARY KEY,
        Name      NVARCHAR(200) NOT NULL,
        CreatedAt DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 2) Create a database user for the App Service's Managed Identity.
--    Precondition: System-assigned identity must already be turned ON for the
--    "levelup-api-dev" App Service (Portal -> levelup-api-dev -> Identity).
--    The name below MUST exactly match the App Service resource name — that is
--    how Azure SQL resolves a system-assigned identity to a login.
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = 'levelup-api-dev')
BEGIN
    CREATE USER [levelup-api-dev] FROM EXTERNAL PROVIDER;
END
GO

-- 3) Least-privilege grants: only what the smoke-test endpoints need on this
--    one table. Deliberately NOT db_datareader/db_datawriter (too broad for a
--    single-table smoke test on a supervised/production-adjacent resource).
GRANT SELECT, INSERT ON dbo.Projects TO [levelup-api-dev];
GO

-- 4) Manual verification query (run this after the backend POSTs a row):
-- SELECT * FROM dbo.Projects ORDER BY CreatedAt DESC;
