/**
 * Mock data repository — the seam between route handlers and the underlying
 * data source.
 *
 * Every route in `backend/src/routes/` calls into this module only, never
 * into `catalog.js` / `users.js` directly. When MIKK-13 (real Azure SQL)
 * lands, this file is the only thing that needs to change: swap the
 * function bodies below for `mssql` queries against the views in
 * `levelup-db/views.sql` (`vw_user_certifications`, `vw_user_competency_gap`,
 * `vw_user_career_path`) and equivalents, keeping the same return shapes so
 * routes and the frontend contract do not change.
 */

const catalog = require("./catalog");
const { users, getUser, DEFAULT_USER_ID } = require("./users");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.name = "NotFoundError";
  }
}

function resolveUser(userId) {
  const id = userId || DEFAULT_USER_ID;
  const user = getUser(id);
  if (!user) {
    throw new NotFoundError(`Unknown userId '${id}'`);
  }
  return user;
}

function listUsers() {
  return users.map((u) => ({
    userId: u.userId,
    name: u.displayName,
    role: u.role,
    office: u.office,
    currentLevel: u.currentLevel,
  }));
}

// ---------------------------------------------------------------------------
// Certifications
// ---------------------------------------------------------------------------

/**
 * Combine the certification catalog with a user's held/tracked records.
 * Mirrors the shape of `levelup-frontend/src/data/mock.ts` certifications
 * plus the natural key ids from `levelup-db/seed.sql`.
 */
function getCertificationsForUser(userId) {
  const user = resolveUser(userId);
  const byId = new Map(user.certifications.map((c) => [c.certificationId, c]));

  const items = catalog.certifications.map((cert) => {
    const record = byId.get(cert.id) || { status: "missing" };
    return {
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      category: cert.category,
      level: cert.level,
      status: record.status,
      earnedDate: record.earnedDate || null,
      progress:
        record.status === "in-progress" ? record.progressPct ?? 0 : undefined,
      requiredFor: cert.requiredFor,
      description: cert.description,
      sourceUrl: cert.sourceUrl,
    };
  });

  const requiredCatalog = catalog.certifications.filter((cert) =>
    cert.requiredFor.some((label) => !label.startsWith("Specialisation:"))
  );
  const heldRequired = requiredCatalog.filter((cert) => {
    const record = byId.get(cert.id);
    return record && record.status === "completed";
  });

  return {
    userId: user.userId,
    userName: user.displayName,
    currentLevel: user.currentLevel,
    summary: {
      held: items.filter((i) => i.status === "completed").length,
      total: items.length,
      requiredHeld: heldRequired.length,
      requiredTotal: requiredCatalog.length,
      percent: Math.round(
        (items.filter((i) => i.status === "completed").length / items.length) * 100
      ),
    },
    certifications: items,
  };
}

function getCertificationForUser(userId, certificationId) {
  const data = getCertificationsForUser(userId);
  const cert = data.certifications.find((c) => c.id === certificationId);
  if (!cert) {
    throw new NotFoundError(`Unknown certification '${certificationId}'`);
  }
  return { user: data, certification: cert };
}

// ---------------------------------------------------------------------------
// Competencies
// ---------------------------------------------------------------------------

function getCompetenciesForUser(userId) {
  const user = resolveUser(userId);
  const byCode = new Map(user.competencies.map((c) => [c.areaCode, c]));

  const areas = catalog.competencyAreas.map((area) => {
    const record = byCode.get(area.code) || { current: 0, target: 0, previous: 0 };
    return {
      area: area.code,
      label: area.label,
      description: area.description,
      current: record.current,
      target: record.target,
      previous: record.previous,
      gap: record.target - record.current,
    };
  });

  const avg = (key) =>
    Math.round(
      (areas.reduce((sum, a) => sum + a[key], 0) / areas.length) * 10
    ) / 10;

  return {
    userId: user.userId,
    userName: user.displayName,
    currentLevel: user.currentLevel,
    averageCurrent: avg("current"),
    averageTarget: avg("target"),
    areas,
  };
}

// ---------------------------------------------------------------------------
// Career levels
// ---------------------------------------------------------------------------

function evaluateRequirement(check, user, competencyMap) {
  switch (check.type) {
    case "cert":
      return check.certIds.every((id) => {
        const rec = user.certifications.find((c) => c.certificationId === id);
        return rec && rec.status === "completed";
      });
    case "certAnyOf":
      return check.certIds.some((id) => {
        const rec = user.certifications.find((c) => c.certificationId === id);
        return rec && rec.status === "completed";
      });
    case "certCountMin": {
      const count = check.certPool.filter((id) => {
        const rec = user.certifications.find((c) => c.certificationId === id);
        return rec && rec.status === "completed";
      }).length;
      return count >= check.min;
    }
    case "competencyMinAll":
      return catalog.competencyAreas.every(
        (area) => (competencyMap.get(area.code) || 0) >= check.min
      );
    case "competencyAreaMin":
      return (competencyMap.get(check.area) || 0) >= check.min;
    case "competencyAreasMin":
      return check.areas.every(
        (area) => (competencyMap.get(area) || 0) >= check.min
      );
    case "manual":
      return Boolean(user.career.manualAchievements[check.key]);
    default:
      return false;
  }
}

/**
 * Full career ladder for a user: levels already achieved are 'completed'
 * (100%), the very next level is 'current' (progress toward it, requirement
 * status computed from real data), and levels beyond that are 'upcoming'
 * (locked, 0%). Mirrors levelup-frontend/src/data/mock.ts `careerPath`.
 */
function getCareerLevelsForUser(userId) {
  const user = resolveUser(userId);
  const competencyMap = new Map(
    user.competencies.map((c) => [c.areaCode, c.current])
  );

  const orderedLevels = [...catalog.jobFamilyLevels].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const currentIdx = orderedLevels.findIndex(
    (l) => l.levelCode === user.currentLevel
  );

  const levels = orderedLevels.map((level, idx) => {
    let status;
    let progress;
    if (idx <= currentIdx) {
      status = "completed";
      progress = 100;
    } else if (idx === currentIdx + 1) {
      status = "current";
      progress = user.career.progressToNextLevel;
    } else {
      status = "upcoming";
      progress = 0;
    }

    const requirementDefs = catalog.careerLevelRequirements[level.levelCode] || [];
    const requirements = requirementDefs.map((req) => {
      const met =
        status === "completed"
          ? true
          : status === "upcoming"
            ? false
            : evaluateRequirement(req.check, user, competencyMap);
      return {
        label: req.label,
        met,
        detail: met ? "Completed" : status === "upcoming" ? "Locked" : "In progress",
      };
    });

    return {
      id: level.levelCode,
      name: level.displayName,
      role: level.displayName,
      description: level.description,
      yearsExperience: level.yearsExperience,
      color: catalog.careerLevelVisuals[level.levelCode]?.colorHex || "#64748b",
      progress,
      status,
      requirements,
    };
  });

  return {
    userId: user.userId,
    userName: user.displayName,
    currentLevel: user.currentLevel,
    nextLevel: orderedLevels[currentIdx + 1]?.displayName || null,
    levels,
  };
}

// ---------------------------------------------------------------------------
// Learning plans
// ---------------------------------------------------------------------------

function getLearningPlanForUser(userId) {
  const user = resolveUser(userId);
  return {
    userId: user.userId,
    userName: user.displayName,
    goals: user.goals.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      status: g.status,
      progress: g.progressPct,
      dueDate: g.dueDate,
      milestones: g.milestones,
    })),
    studyPlan: user.studyPlan,
  };
}

// ---------------------------------------------------------------------------
// Manager overview
// ---------------------------------------------------------------------------

function getManagerOverview() {
  const consultants = users.map((user) => {
    const certData = getCertificationsForUser(user.userId);
    const compData = getCompetenciesForUser(user.userId);
    const activeGoals = user.goals.filter((g) => g.status !== "completed");
    const gapAreas = compData.areas
      .filter((a) => a.gap > 0)
      .map((a) => a.label);

    return {
      userId: user.userId,
      name: user.displayName,
      role: user.role,
      office: user.office,
      currentLevel: user.currentLevel,
      certifications: {
        held: certData.summary.held,
        total: certData.summary.total,
        percent: certData.summary.percent,
      },
      competencies: {
        averageCurrent: compData.averageCurrent,
        averageTarget: compData.averageTarget,
        gapAreas,
      },
      activeGoals: activeGoals.length,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    teamSize: consultants.length,
    consultants,
  };
}

module.exports = {
  NotFoundError,
  listUsers,
  getCertificationsForUser,
  getCertificationForUser,
  getCompetenciesForUser,
  getCareerLevelsForUser,
  getLearningPlanForUser,
  getManagerOverview,
};
