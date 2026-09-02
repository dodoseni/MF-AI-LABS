/**
 * Reference / catalog data (non-sensitive) for the LevelUp interim mock layer.
 *
 * Field names and natural keys are kept aligned with `levelup-db/schema.sql`
 * and `levelup-db/seed.sql` (same certification ids, competency area codes,
 * and job-family level codes) so this module can be swapped for real Azure
 * SQL queries later (MIKK-13) without changing route code — only
 * `data/repository.js` needs to change.
 */

// ---------------------------------------------------------------------------
// Job family levels (consultant track) — dbo.job_family_level
// ---------------------------------------------------------------------------
const jobFamilyLevels = [
  {
    familyCode: "consultant",
    levelCode: "consultant",
    displayName: "Consultant",
    sortOrder: 1,
    yearsExperience: "0–3 years",
    description:
      "Building a strong technical and consulting foundation while working in client delivery teams.",
  },
  {
    familyCode: "consultant",
    levelCode: "senior",
    displayName: "Senior Consultant",
    sortOrder: 2,
    yearsExperience: "3–7 years",
    description:
      "Taking more ownership of delivery and becoming a trusted advisor to clients.",
  },
  {
    familyCode: "consultant",
    levelCode: "principal",
    displayName: "Principal Consultant",
    sortOrder: 3,
    yearsExperience: "7+ years",
    description:
      "Leading major workstreams, shaping offerings and growing people around you.",
  },
  {
    familyCode: "consultant",
    levelCode: "architect",
    displayName: "Enterprise Architect",
    sortOrder: 4,
    yearsExperience: "10+ years",
    description:
      "Setting technical strategy and architecture direction across client organisations.",
  },
  {
    familyCode: "consultant",
    levelCode: "expert",
    displayName: "Expert",
    sortOrder: 5,
    yearsExperience: null,
    description: "Recognised authority in a specialist domain.",
  },
];

// Career level visualization overlay — dbo.career_level
const careerLevelVisuals = {
  consultant: { colorHex: "#2f6df0" },
  senior: { colorHex: "#2563eb" },
  principal: { colorHex: "#7c3aed" },
  architect: { colorHex: "#0d9488" },
  expert: { colorHex: "#0f766e" },
};

// ---------------------------------------------------------------------------
// Competency areas — dbo.competency_area
// ---------------------------------------------------------------------------
const competencyAreas = [
  {
    code: "Sales",
    label: "Sales",
    description:
      "Driving business development, identifying opportunities and winning work for Sopra Steria and clients.",
    sortOrder: 1,
  },
  {
    code: "Delivery",
    label: "Delivery",
    description:
      "Delivering high-quality outcomes for clients with solid project and product execution.",
    sortOrder: 2,
  },
  {
    code: "Manage",
    label: "Manage",
    description:
      "Leading teams, people development, stakeholder management and running project delivery.",
    sortOrder: 3,
  },
  {
    code: "Entrepreneurship",
    label: "Entrepreneurship",
    description:
      "Innovating, building new offerings and taking ownership of commercial opportunities.",
    sortOrder: 4,
  },
  {
    code: "Develop",
    label: "Develop",
    description:
      "Growing the competence, career and wellbeing of the people you work with.",
    sortOrder: 5,
  },
];

// ---------------------------------------------------------------------------
// Certification catalog — dbo.certification
// requiredFor: display labels of the level(s)/specialisation this cert
// unlocks (mirrors levelup-frontend/src/data/mock.ts).
// ---------------------------------------------------------------------------
const certifications = [
  {
    id: "az-900",
    name: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    category: "Cloud Platform",
    level: "Associate",
    requiredFor: ["Consultant"],
    description:
      "Foundational understanding of cloud services and how those services are provided with Azure.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },
  {
    id: "az-104",
    name: "Azure Administrator Associate",
    issuer: "Microsoft",
    category: "Cloud Platform",
    level: "Associate",
    requiredFor: ["Senior Consultant"],
    description:
      "Implements, manages and monitors an organization's Azure environment.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/",
  },
  {
    id: "az-204",
    name: "Azure Developer Associate",
    issuer: "Microsoft",
    category: "Development",
    level: "Associate",
    requiredFor: ["Senior Consultant"],
    description:
      "Designs, builds, tests and maintains cloud applications and services on Azure.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/",
  },
  {
    id: "az-305",
    name: "Azure Solutions Architect Expert",
    issuer: "Microsoft",
    category: "Architecture",
    level: "Expert",
    requiredFor: ["Principal Consultant"],
    description:
      "Advanced subject matter expertise in designing cloud and hybrid solutions.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-solutions-architect/",
  },
  {
    id: "sc-300",
    name: "Identity and Access Administrator Associate",
    issuer: "Microsoft",
    category: "Security",
    level: "Associate",
    requiredFor: ["Principal Consultant"],
    description:
      "Designs, implements and operates an organization's identity and access management systems.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/identity-access-administrator/",
  },
  {
    id: "az-400",
    name: "DevOps Engineer Expert",
    issuer: "Microsoft",
    category: "DevOps",
    level: "Expert",
    requiredFor: ["Specialisation: Architecture", "Enterprise Architect"],
    description:
      "Combines people, process and technology to continuously deliver valuable products and services.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/devops-engineer/",
  },
  {
    id: "dp-203",
    name: "Azure Data Engineer Associate",
    issuer: "Microsoft",
    category: "Data & AI",
    level: "Associate",
    requiredFor: ["Specialisation: Data"],
    description:
      "Integrates, transforms and consolidates data from various structured and unstructured data systems.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/",
  },
  {
    id: "ai-102",
    name: "Azure AI Engineer Associate",
    issuer: "Microsoft",
    category: "Data & AI",
    level: "Associate",
    requiredFor: ["Specialisation: AI"],
    description:
      "Builds, manages and deploys AI solutions that leverage Azure Cognitive Services and Azure Applied AI services.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
  },
  {
    id: "az-500",
    name: "Azure Security Engineer Associate",
    issuer: "Microsoft",
    category: "Security",
    level: "Associate",
    requiredFor: ["Principal Consultant"],
    description:
      "Implements, manages and monitors security for resources in Azure, multi-cloud and hybrid environments.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/",
  },
  {
    id: "sc-100",
    name: "Cybersecurity Architect Expert",
    issuer: "Microsoft",
    category: "Security",
    level: "Expert",
    requiredFor: ["Specialisation: Security", "Enterprise Architect"],
    description:
      "Translates security strategy and requirements into a security architecture.",
    sourceUrl:
      "https://learn.microsoft.com/en-us/credentials/certifications/cybersecurity-architect-expert/",
  },
];

// ---------------------------------------------------------------------------
// Career ladder requirement definitions.
// Each requirement is evaluated against a user's held certifications,
// competency self-assessments, and a small set of "manual" achievements
// (things not derivable from the other tables, e.g. "led a delivery
// stream") that live on the user record in data/users.js.
// ---------------------------------------------------------------------------
const careerLevelRequirements = {
  consultant: [
    {
      id: "az-900-cert",
      label: "Azure Fundamentals (AZ-900)",
      check: { type: "cert", certIds: ["az-900"] },
    },
    {
      id: "min-2-client-projects",
      label: "Minimum 2 client projects",
      check: { type: "manual", key: "min2ClientProjects" },
    },
    {
      id: "competency-2-all-areas",
      label: "Competency self-assessment (Score 2+) in all areas",
      check: { type: "competencyMinAll", min: 2 },
    },
  ],
  senior: [
    {
      id: "az-104-204-cert",
      label: "Azure Administrator (AZ-104) + Developer (AZ-204)",
      check: { type: "cert", certIds: ["az-104", "az-204"] },
    },
    {
      id: "competency-3-delivery",
      label: "Competency level 3 in Delivery",
      check: { type: "competencyAreaMin", area: "Delivery", min: 3 },
    },
    {
      id: "lead-delivery-stream",
      label: "Lead a delivery stream",
      check: { type: "manual", key: "ledDeliveryStream" },
    },
  ],
  principal: [
    {
      id: "az-305-cert",
      label: "Azure Solutions Architect Expert (AZ-305)",
      check: { type: "cert", certIds: ["az-305"] },
    },
    {
      id: "security-cert",
      label: "Security certification (SC-300 or AZ-500)",
      check: { type: "certAnyOf", certIds: ["sc-300", "az-500"] },
    },
    {
      id: "competency-4-sales-entrepreneurship",
      label: "Competency level 4 in Sales & Entrepreneurship",
      check: {
        type: "competencyAreasMin",
        areas: ["Sales", "Entrepreneurship"],
        min: 4,
      },
    },
  ],
  architect: [
    {
      id: "principal-2-years",
      label: "Principal Consultant for 2+ years",
      check: { type: "manual", key: "principalFor2Years" },
    },
    {
      id: "2-architecture-expert-certs",
      label: "2 architecture-track expert certifications",
      check: {
        type: "certCountMin",
        certPool: ["az-305", "sc-100", "az-400"],
        min: 2,
      },
    },
  ],
  expert: [
    {
      id: "recognised-specialist",
      label: "Recognised specialist track sign-off",
      check: { type: "manual", key: "recognisedSpecialist" },
    },
  ],
};

function getJobFamilyLevel(levelCode) {
  return jobFamilyLevels.find((l) => l.levelCode === levelCode) || null;
}

function getCertification(certId) {
  return certifications.find((c) => c.id === certId) || null;
}

function getCompetencyArea(code) {
  return competencyAreas.find((a) => a.code === code) || null;
}

module.exports = {
  jobFamilyLevels,
  careerLevelVisuals,
  competencyAreas,
  certifications,
  careerLevelRequirements,
  getJobFamilyLevel,
  getCertification,
  getCompetencyArea,
};
