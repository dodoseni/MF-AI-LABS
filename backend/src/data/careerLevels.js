// Mock data for the LevelUp career path.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`careerPath`) and
// `levelup-frontend/src/types/index.ts` (`CareerLevel` / `Requirement`) so the
// API contract matches the existing Career Path UI.
//
// Order matters: the array is already in career-progression order
// (Consultant -> Senior Consultant -> Principal Consultant -> Enterprise
// Architect) and must stay that way so the frontend can render the path
// without re-sorting.

const careerLevels = [
  {
    id: 'consultant',
    name: 'Consultant',
    role: 'Consultant',
    description:
      'Building a strong technical and consulting foundation while working in client delivery teams.',
    yearsExperience: '0–3 years',
    color: '#2f6df0',
    progress: 100,
    status: 'completed',
    requirements: [
      { label: 'Azure Fundamentals (AZ-900)', detail: 'Completed', met: true },
      { label: 'Minimum 2 client projects', detail: 'Completed', met: true },
      {
        label: 'Competency self-assessment (Score 2+) in all areas',
        detail: 'Completed',
        met: true,
      },
    ],
  },
  {
    id: 'senior',
    name: 'Senior Consultant',
    role: 'Senior Consultant',
    description:
      'Taking more ownership of delivery and becoming a trusted advisor to clients.',
    yearsExperience: '3–7 years',
    color: '#2563eb',
    progress: 100,
    status: 'completed',
    requirements: [
      {
        label: 'Azure Administrator (AZ-104) + Developer (AZ-204)',
        detail: 'Completed',
        met: true,
      },
      {
        label: 'Competency level 3 in Delivery',
        detail: 'Completed',
        met: true,
      },
      { label: 'Lead a delivery stream', detail: 'Completed', met: true },
    ],
  },
  {
    id: 'principal',
    name: 'Principal Consultant',
    role: 'Principal Consultant',
    description:
      'Leading major workstreams, shaping offerings and growing people around you.',
    yearsExperience: '7+ years',
    color: '#7c3aed',
    progress: 58,
    status: 'current',
    requirements: [
      {
        label: 'Azure Solutions Architect Expert (AZ-305)',
        detail: 'In progress — 62%',
        met: false,
      },
      {
        label: 'Security certification (SC-300 or AZ-500)',
        detail: 'Not started',
        met: false,
      },
      {
        label: 'Competency level 4 in Sales & Entrepreneurship',
        detail: '2 of 2 — 2 remaining',
        met: false,
      },
    ],
  },
  {
    id: 'architect',
    name: 'Enterprise Architect',
    role: 'Enterprise Architect',
    description:
      'Setting technical strategy and architecture direction across client organisations.',
    yearsExperience: '10+ years',
    color: '#0d9488',
    progress: 0,
    status: 'upcoming',
    requirements: [
      {
        label: 'Principal Consultant for 2+ years',
        detail: 'Locked',
        met: false,
      },
      {
        label: '2 architecture expert certifications',
        detail: 'Locked',
        met: false,
      },
    ],
  },
];

module.exports = { careerLevels };
