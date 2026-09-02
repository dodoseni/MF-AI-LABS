// Mock data for LevelUp certifications.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`certifications`) and
// `levelup-frontend/src/types/index.ts` (`Certification`) so the API contract
// matches the current UI.
//
// As of MIKK-28 (merged into develop), `requiredFor` references the Level
// 1-4 roadmap (`'Level 1'` .. `'Level 3'`) instead of the old consulting
// titles; Level 4 is holistic and has no certification requirements (see
// `careerLevels.js`). `progress`/`earnedDate` are always present as explicit
// `null` (rather than omitted) so consumers can rely on the fields always
// being there — a deliberate backend convention carried over from MIKK-29.

const certifications = [
  // ---- Pre-Level 1 / historical certifications (not tied to a specific level) ----
  {
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-03-14',
    progress: null,
    requiredFor: [],
    description:
      'Foundational understanding of cloud services and how those services are provided with Azure.',
  },
  {
    id: 'az-204',
    name: 'Azure Developer Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Development',
    level: 'Associate',
    earnedDate: '2023-02-20',
    progress: null,
    requiredFor: [],
    description:
      'Designs, builds, tests and maintains cloud applications and services on Azure.',
  },

  // ---- Level 1 — hold all 4 mandatory certifications ----
  {
    id: 'az-104',
    name: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-09-02',
    progress: null,
    requiredFor: ['Level 1'],
    description:
      "Implements, manages and monitors an organization's Azure environment.",
  },
  {
    id: 'sc-300',
    name: 'Identity and Access Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Security',
    level: 'Associate',
    earnedDate: '2023-01-18',
    progress: null,
    requiredFor: ['Level 1'],
    description:
      "Designs, implements and operates an organization's identity and access management systems.",
  },
  {
    id: 'terraform-associate',
    name: 'Terraform Associate',
    issuer: 'HashiCorp',
    status: 'completed',
    category: 'Infrastructure',
    level: 'Associate',
    earnedDate: '2023-04-05',
    progress: null,
    requiredFor: ['Level 1'],
    description:
      'HashiCorp Certified: Terraform Associate — validates foundational Infrastructure as Code skills with Terraform.',
  },
  {
    id: 'navigator-foundation',
    name: 'Sopra Steria Navigator Foundation',
    issuer: 'Sopra Steria',
    status: 'completed',
    category: 'Internal',
    level: 'Associate',
    earnedDate: '2022-11-20',
    progress: null,
    requiredFor: ['Level 1'],
    description:
      'Sopra Steria Navigator Foundation (Technical, no bonus) — internal onboarding certification covering delivery method and technical standards.',
  },

  // ---- Level 2 — choose at least 2 of the following ----
  {
    id: 'ai-103',
    name: 'Azure AI App and Agent Developer Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Data & AI',
    level: 'Associate',
    earnedDate: '2025-05-12',
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Builds AI apps and agents using Azure AI Foundry and related Azure AI services.',
  },
  {
    id: 'az-800',
    name: 'Windows Server Hybrid Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2025-06-30',
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Manages core Windows Server workloads and services in on-premises, hybrid and cloud environments.',
  },
  {
    id: 'ai-200',
    name: 'Azure AI Cloud Developer Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Data & AI',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description: 'Designs and implements cloud-native AI solutions on Azure.',
  },
  {
    id: 'az-700',
    name: 'Azure Network Engineer Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description: 'Designs, implements and manages Azure networking solutions.',
  },
  {
    id: 'sc-401',
    name: 'Information Security Administrator Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Implements information security and compliance solutions across Microsoft 365 and Purview.',
  },
  {
    id: 'sc-200',
    name: 'Security Operations Analyst Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Investigates, responds to and hunts for threats using Microsoft Sentinel and Defender.',
  },
  {
    id: 'sc-500',
    name: 'Cloud and AI Security Engineer Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Secures cloud, hybrid and AI workloads across the Microsoft security stack.',
  },
  {
    id: 'cks',
    name: 'Certified Kubernetes Security Specialist',
    issuer: 'Cloud Native Computing Foundation',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Specialist',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Validates the ability to secure container-based applications and Kubernetes platforms.',
  },
  {
    id: 'cka',
    name: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Validates the skills, knowledge and competency to perform Kubernetes administration.',
  },
  {
    id: 'terraform-professional',
    name: 'Terraform Authoring and Operations Professional',
    issuer: 'HashiCorp',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'HashiCorp Certified: advanced Terraform authoring, module design and operational practices.',
  },
  {
    id: 'gh-500',
    name: 'GitHub Advanced Security',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Validates skills in securing code with GitHub Advanced Security (code scanning, secret scanning, dependency review).',
  },
  {
    id: 'gh-200',
    name: 'GitHub Actions',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Validates skills in automating workflows, builds and deployments with GitHub Actions.',
  },
  {
    id: 'gh-300',
    name: 'GitHub Copilot',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 2'],
    description:
      'Validates skills in using GitHub Copilot effectively across the software development lifecycle.',
  },

  // ---- Level 3 — choose at least 2 of the following ----
  {
    id: 'az-305',
    name: 'Azure Solutions Architect Expert',
    issuer: 'Microsoft',
    status: 'in-progress',
    category: 'Architecture',
    level: 'Expert',
    earnedDate: null,
    progress: 62,
    requiredFor: ['Level 3'],
    description:
      'Advanced subject matter expertise in designing cloud and hybrid solutions.',
  },
  {
    id: 'az-400',
    name: 'DevOps Engineer Expert',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'DevOps',
    level: 'Expert',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 3'],
    description:
      'Combines people, process and technology to continuously deliver valuable products and services.',
  },
  {
    id: 'sc-100',
    name: 'Cybersecurity Architect Expert',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Security',
    level: 'Expert',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 3'],
    description:
      'Translates security strategy and requirements into a security architecture.',
  },
  {
    id: 'ab-100',
    name: 'Agentic AI Business Solutions Architect',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Data & AI',
    level: 'Expert',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 3'],
    description:
      'Microsoft Certified: designs and leads agentic AI business solutions and adoption.',
  },
  {
    id: 'ms-102',
    name: 'Microsoft 365 Administrator Expert',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Cloud Platform',
    level: 'Expert',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 3'],
    description:
      'Plans, deploys, configures and manages Microsoft 365 services at an enterprise level.',
  },
  {
    id: 'sc-730',
    name: 'Cybersecurity Business Professional',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Professional',
    earnedDate: null,
    progress: null,
    requiredFor: ['Level 3'],
    description:
      'Cybersecurity Business Professional — bridges security strategy with business outcomes.',
  },

  // ---- Optional specialisations (not required for any specific level) ----
  {
    id: 'dp-203',
    name: 'Azure Data Engineer Associate',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Data & AI',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Specialisation: Data'],
    description:
      'Integrates, transforms and consolidates data from various structured and unstructured data systems.',
  },
  {
    id: 'ai-102',
    name: 'Azure AI Engineer Associate',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Data & AI',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Specialisation: AI'],
    description:
      'Builds, manages and deploys AI solutions that leverage Azure Cognitive Services and Azure Applied AI services.',
  },
  {
    id: 'az-500',
    name: 'Azure Security Engineer Associate',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Security',
    level: 'Associate',
    earnedDate: null,
    progress: null,
    requiredFor: ['Specialisation: Security'],
    description:
      'Implements, manages and monitors security for resources in Azure, multi-cloud and hybrid environments.',
  },
];

module.exports = { certifications };
