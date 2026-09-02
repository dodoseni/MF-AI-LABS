// Mock data for the LevelUp career path.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`careerPath`) and
// `levelup-frontend/src/types/index.ts` (`CareerLevel` / `Requirement`) so the
// API contract matches the current Career Path UI.
//
// As of MIKK-28 (merged into develop), the career roadmap uses generic
// "Level 1" .. "Level 4" progression instead of consulting titles
// (Consultant / Senior Consultant / Principal Consultant / Enterprise
// Architect). `role`/`yearsExperience` were removed from the frontend model
// and are intentionally NOT part of this contract anymore.
//
// `requirementMode` describes how a level's certifications should be
// interpreted:
//   - 'all'      hold every certification listed in `requirements`
//   - 'choose'   hold at least `chooseAtLeast` of the listed certifications
//   - 'holistic' no fixed certification list — see `focusAreas` instead
//
// Order matters: the array is already in career-progression order
// (Level 1 -> Level 2 -> Level 3 -> Level 4) and must stay that way so the
// frontend can render the path without re-sorting.

const careerLevels = [
  {
    id: 'level-1',
    name: 'Level 1',
    tagline: 'Foundation',
    description:
      'Building a strong technical foundation in Microsoft Cloud, identity, infrastructure-as-code and Sopra Steria delivery practice.',
    color: '#2f6df0',
    progress: 100,
    status: 'completed',
    requirementMode: 'all',
    requirementNote: 'Hold all 4 mandatory certifications',
    requirements: [
      { label: 'AZ-104 — Azure Administrator Associate', detail: 'Completed', met: true },
      { label: 'SC-300 — Identity and Access Administrator Associate', detail: 'Completed', met: true },
      { label: 'Terraform Associate — HashiCorp Certified: Terraform Associate', detail: 'Completed', met: true },
      { label: 'Sopra Steria Navigator Foundation', detail: 'Completed', met: true },
    ],
  },
  {
    id: 'level-2',
    name: 'Level 2',
    tagline: 'Specialisation',
    description:
      'Going deeper into a Microsoft Cloud specialisation track — AI, security, core technology or DevOps — by choosing certifications that match your area of focus.',
    color: '#2563eb',
    progress: 100,
    status: 'completed',
    requirementMode: 'choose',
    chooseAtLeast: 2,
    requirementNote: 'Choose at least 2 of 13 certifications',
    requirements: [
      { label: 'AI-103 — Azure AI App and Agent Developer Associate', detail: 'Completed', met: true },
      { label: 'AZ-800 — Windows Server Hybrid Administrator Associate', detail: 'Completed', met: true },
      { label: 'AI-200 — Azure AI Cloud Developer Associate', detail: 'Not started', met: false },
      { label: 'AZ-700 — Azure Network Engineer Associate', detail: 'Not started', met: false },
      { label: 'SC-401 — Information Security Administrator Associate', detail: 'Not started', met: false },
      { label: 'SC-200 — Security Operations Analyst Associate', detail: 'Not started', met: false },
      { label: 'SC-500 — Cloud and AI Security Engineer Associate', detail: 'Not started', met: false },
      { label: 'CKS — Certified Kubernetes Security Specialist', detail: 'Not started', met: false },
      { label: 'CKA — Certified Kubernetes Administrator', detail: 'Not started', met: false },
      { label: 'Terraform Authoring and Operations Professional', detail: 'Not started', met: false },
      { label: 'GH-500 — GitHub Advanced Security', detail: 'Not started', met: false },
      { label: 'GH-200 — GitHub Actions', detail: 'Not started', met: false },
      { label: 'GH-300 — GitHub Copilot', detail: 'Not started', met: false },
    ],
  },
  {
    id: 'level-3',
    name: 'Level 3',
    tagline: 'Leadership track',
    description:
      'Leading architecture, delivery and security decisions at an expert level — the step towards senior technical and business leadership.',
    color: '#7c3aed',
    progress: 35,
    status: 'current',
    requirementMode: 'choose',
    chooseAtLeast: 2,
    requirementNote: 'Choose at least 2 of 6 certifications',
    requirements: [
      { label: 'AZ-305 — Azure Solutions Architect Expert', detail: 'In progress — 62%', met: false },
      { label: 'AZ-400 — DevOps Engineer Expert', detail: 'Not started', met: false },
      { label: 'SC-100 — Cybersecurity Architect Expert', detail: 'Not started', met: false },
      { label: 'AB-100 — Agentic AI Business Solutions Architect', detail: 'Not started', met: false },
      { label: 'MS-102 — Microsoft 365 Administrator Expert', detail: 'Not started', met: false },
      { label: 'SC-730 — Cybersecurity Business Professional', detail: 'Not started', met: false },
    ],
  },
  {
    id: 'level-4',
    name: 'Level 4',
    tagline: 'Strategic impact',
    description:
      'No fixed certification list — Level 4 is defined by demonstrated business impact, architecture leadership and innovation, verified against individual expectations agreed with your Business Owner.',
    color: '#0d9488',
    progress: 0,
    status: 'upcoming',
    requirementMode: 'holistic',
    requirementNote: 'Individual expectations — verified by your Business Owner',
    requirements: [],
    focusAreas: [
      'Business impact',
      'Architecture leadership',
      'Innovation',
      'Cloud Adoption Framework experience',
      'Business Owner approval',
    ],
  },
];

module.exports = { careerLevels };
