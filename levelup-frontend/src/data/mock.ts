import type {
  CalendarEvent,
  CareerLevel,
  Certification,
  CompetencyEntry,
  DevelopmentGoal,
  RecommendedAction,
  WeeklyPlanDay,
} from '../types'

export const currentUser = {
  name: 'Amalie Berg',
  role: 'Cloud Solutions Consultant',
  level: 'Level 3',
  office: 'Oslo',
  memberSince: '2019',
  avatarInitials: 'AB',
  nextLevel: 'Level 4',
}

export const dashboardStats = [
  {
    icon: 'level',
    label: 'Current level',
    value: 'Level 3',
    detail: 'Next: Level 4',
    tone: 'brand',
  },
  {
    icon: 'cert',
    label: 'Level certifications',
    value: '6 / 8',
    detail: '2 more to reach Level 4',
    tone: 'success',
  },
  {
    icon: 'comp',
    label: 'Competencies',
    value: '3.6 / 5',
    detail: '2 areas to grow',
    tone: 'info',
  },
  {
    icon: 'goal',
    label: 'Active goals',
    value: '4',
    detail: '2 on track',
    tone: 'violet',
  },
] as const

export const certifications: Certification[] = [
  // ---- Pre-Level 1 / historical certifications (not tied to a specific level) ----
  {
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-03-14',
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
    requiredFor: ['Level 1'],
    description:
      'Implements, manages and monitors an organization’s Azure environment.',
  },
  {
    id: 'sc-300',
    name: 'Identity and Access Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Security',
    level: 'Associate',
    earnedDate: '2023-01-18',
    requiredFor: ['Level 1'],
    description:
      'Designs, implements and operates an organization’s identity and access management systems.',
  },
  {
    id: 'terraform-associate',
    name: 'Terraform Associate',
    issuer: 'HashiCorp',
    status: 'completed',
    category: 'Infrastructure',
    level: 'Associate',
    earnedDate: '2023-04-05',
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
    requiredFor: ['Level 2'],
    description: 'Builds AI apps and agents using Azure AI Foundry and related Azure AI services.',
  },
  {
    id: 'az-800',
    name: 'Windows Server Hybrid Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2025-06-30',
    requiredFor: ['Level 2'],
    description: 'Manages core Windows Server workloads and services in on-premises, hybrid and cloud environments.',
  },
  {
    id: 'ai-200',
    name: 'Azure AI Cloud Developer Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Data & AI',
    level: 'Associate',
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
    requiredFor: ['Level 2'],
    description: 'Implements information security and compliance solutions across Microsoft 365 and Purview.',
  },
  {
    id: 'sc-200',
    name: 'Security Operations Analyst Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    requiredFor: ['Level 2'],
    description: 'Investigates, responds to and hunts for threats using Microsoft Sentinel and Defender.',
  },
  {
    id: 'sc-500',
    name: 'Cloud and AI Security Engineer Associate',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    requiredFor: ['Level 2'],
    description: 'Secures cloud, hybrid and AI workloads across the Microsoft security stack.',
  },
  {
    id: 'cks',
    name: 'Certified Kubernetes Security Specialist',
    issuer: 'Cloud Native Computing Foundation',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Specialist',
    requiredFor: ['Level 2'],
    description: 'Validates the ability to secure container-based applications and Kubernetes platforms.',
  },
  {
    id: 'cka',
    name: 'Certified Kubernetes Administrator',
    issuer: 'Cloud Native Computing Foundation',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Professional',
    requiredFor: ['Level 2'],
    description: 'Validates the skills, knowledge and competency to perform Kubernetes administration.',
  },
  {
    id: 'terraform-professional',
    name: 'Terraform Authoring and Operations Professional',
    issuer: 'HashiCorp',
    status: 'missing',
    category: 'Infrastructure',
    level: 'Professional',
    requiredFor: ['Level 2'],
    description: 'HashiCorp Certified: advanced Terraform authoring, module design and operational practices.',
  },
  {
    id: 'gh-500',
    name: 'GitHub Advanced Security',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    requiredFor: ['Level 2'],
    description: 'Validates skills in securing code with GitHub Advanced Security (code scanning, secret scanning, dependency review).',
  },
  {
    id: 'gh-200',
    name: 'GitHub Actions',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    requiredFor: ['Level 2'],
    description: 'Validates skills in automating workflows, builds and deployments with GitHub Actions.',
  },
  {
    id: 'gh-300',
    name: 'GitHub Copilot',
    issuer: 'GitHub',
    status: 'missing',
    category: 'Collaboration',
    level: 'Professional',
    requiredFor: ['Level 2'],
    description: 'Validates skills in using GitHub Copilot effectively across the software development lifecycle.',
  },

  // ---- Level 3 — choose at least 2 of the following ----
  {
    id: 'az-305',
    name: 'Azure Solutions Architect Expert',
    issuer: 'Microsoft',
    status: 'in-progress',
    category: 'Architecture',
    level: 'Expert',
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
    requiredFor: ['Level 3'],
    description: 'Microsoft Certified: designs and leads agentic AI business solutions and adoption.',
  },
  {
    id: 'ms-102',
    name: 'Microsoft 365 Administrator Expert',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Cloud Platform',
    level: 'Expert',
    requiredFor: ['Level 3'],
    description: 'Plans, deploys, configures and manages Microsoft 365 services at an enterprise level.',
  },
  {
    id: 'sc-730',
    name: 'Cybersecurity Business Professional',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Professional',
    requiredFor: ['Level 3'],
    description: 'Cybersecurity Business Professional — bridges security strategy with business outcomes.',
  },

  // ---- Optional specialisations (not required for any specific level) ----
  {
    id: 'dp-203',
    name: 'Azure Data Engineer Associate',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Data & AI',
    level: 'Associate',
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
    requiredFor: ['Specialisation: Security'],
    description:
      'Implements, manages and monitors security for resources in Azure, multi-cloud and hybrid environments.',
  },
]

export const competencyAreas: CompetencyEntry[] = [
  {
    area: 'Sales',
    label: 'Sales',
    description:
      'Driving business development, identifying opportunities and winning work for Sopra Steria and clients.',
    current: 3,
    target: 4,
    previous: 2,
  },
  {
    area: 'Delivery',
    label: 'Delivery',
    description:
      'Delivering high-quality outcomes for clients with solid project and product execution.',
    current: 4,
    target: 4,
    previous: 4,
  },
  {
    area: 'Manage',
    label: 'Manage',
    description:
      'Leading teams, people development, stakeholder management and running project delivery.',
    current: 3,
    target: 4,
    previous: 3,
  },
  {
    area: 'Entrepreneurship',
    label: 'Entrepreneurship',
    description:
      'Innovating, building new offerings and taking ownership of commercial opportunities.',
    current: 3,
    target: 4,
    previous: 2,
  },
  {
    area: 'Develop',
    label: 'Develop',
    description:
      'Growing the competence, career and wellbeing of the people you work with.',
    current: 4,
    target: 4,
    previous: 3,
  },
]

export const careerPath: CareerLevel[] = [
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
]

export const developmentGoals: DevelopmentGoal[] = [
  {
    id: 'g1',
    title: 'Achieve Azure Solutions Architect Expert',
    category: 'Certification',
    status: 'in-progress',
    progress: 62,
    dueDate: '2026-11-30',
    milestones: [
      { id: 'm1', label: 'Complete AZ-305 study path (Design)', date: '2026-09-15', done: true },
      { id: 'm2', label: 'Take practice exams — Score 70%+', date: '2026-10-15', done: false },
      { id: 'm3', label: 'Book and pass AZ-305 exam', date: '2026-11-30', done: false },
    ],
  },
  {
    id: 'g2',
    title: 'Strengthen Sales competency to level 4',
    category: 'Competency',
    status: 'active',
    progress: 40,
    dueDate: '2026-12-15',
    milestones: [
      { id: 'm1', label: 'Complete sales training workshop', date: '2026-09-30', done: true },
      { id: 'm2', label: 'Co-lead one proposal submission', date: '2026-11-01', done: false },
      { id: 'm3', label: 'Present at internal sales forum', date: '2026-12-15', done: false },
    ],
  },
  {
    id: 'g3',
    title: 'Complete DevOps practices deep-dive',
    category: 'Learning',
    status: 'active',
    progress: 20,
    dueDate: '2026-12-01',
    milestones: [
      { id: 'm1', label: 'Finish Azure DevOps course', date: '2026-10-15', done: false },
      { id: 'm2', label: 'Implement CI/CD on a demo project', date: '2026-11-15', done: false },
    ],
  },
  {
    id: 'g4',
    title: 'Mentor two junior consultants',
    category: 'Develop',
    status: 'completed',
    progress: 100,
    dueDate: '2026-06-30',
    milestones: [
      { id: 'm1', label: 'Monthly 1:1 mentoring sessions', date: '2026-04-01', done: true },
      { id: 'm2', label: 'Review goals and career plan', date: '2026-06-30', done: true },
    ],
  },
]

export const studyPlan: {
  id: string
  title: string
  source: string
  duration: string
  completed: boolean
  type: 'course' | 'certification' | 'reading' | 'practice'
}[] = [
  {
    id: 's1',
    title: 'AZ-305: Design identity, governance and monitoring solutions',
    source: 'Microsoft Learn',
    duration: '4h 30m',
    completed: true,
    type: 'course',
  },
  {
    id: 's2',
    title: 'AZ-305: Design data storage solutions',
    source: 'Microsoft Learn',
    duration: '5h 15m',
    completed: true,
    type: 'course',
  },
  {
    id: 's3',
    title: 'AZ-305: Design business continuity solutions',
    source: 'Microsoft Learn',
    duration: '3h 45m',
    completed: false,
    type: 'course',
  },
  {
    id: 's4',
    title: 'Architecting Microsoft Azure Solutions exam guide',
    source: 'Microsoft Press (book)',
    duration: '12h',
    completed: false,
    type: 'reading',
  },
  {
    id: 's5',
    title: 'AZ-305 practice exam set',
    source: 'MeasureUp',
    duration: '2h',
    completed: false,
    type: 'practice',
  },
]

export const weeklyStudyPlan: WeeklyPlanDay[] = [
  { day: 'Monday', items: ['AZ-305: Design identity & governance — Module 1'] },
  { day: 'Wednesday', items: ['AZ-305: Design data storage — Module 2'] },
  { day: 'Friday', items: ['Hands-on practice lab (Azure sandbox)'] },
  { day: 'Sunday', items: ['Weekly quiz + recap'] },
]

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', date: '2026-09-07', title: 'AZ-305: Design identity & governance — Module 1', type: 'study' },
  { id: 'e2', date: '2026-09-09', title: 'AZ-305: Design data storage — Module 2', type: 'study' },
  { id: 'e3', date: '2026-09-11', title: 'Hands-on practice lab', type: 'study' },
  { id: 'e4', date: '2026-09-13', title: 'Weekly quiz + recap', type: 'study' },
  { id: 'e5', date: '2026-09-15', title: 'Complete AZ-305 Design module', type: 'milestone' },
  { id: 'e6', date: '2026-09-30', title: 'Sales training workshop', type: 'study' },
  { id: 'e7', date: '2026-10-15', title: 'AZ-305 practice exam — target 70%+', type: 'practice' },
  { id: 'e8', date: '2026-10-15', title: 'Finish Azure DevOps course', type: 'study' },
  { id: 'e9', date: '2026-11-01', title: 'Co-lead one proposal submission', type: 'milestone' },
  { id: 'e10', date: '2026-11-15', title: 'Implement CI/CD on a demo project', type: 'study' },
  { id: 'e11', date: '2026-11-30', title: 'AZ-305 certification exam', type: 'exam' },
  { id: 'e12', date: '2026-12-01', title: 'DevOps practices deep-dive due', type: 'milestone' },
  { id: 'e13', date: '2026-12-15', title: 'Present at internal sales forum', type: 'milestone' },
]

export const recommendedActions: RecommendedAction[] = [
  {
    id: 'r1',
    title: 'Continue AZ-305 study plan',
    description:
      'You are 62% through the Solutions Architect Expert path. 2 of 6 modules remain.',
    impact: 'high',
    category: 'Certification',
    href: '/learning',
    cta: 'Resume study',
  },
  {
    id: 'r2',
    title: 'Choose a second Level 3 certification',
    description:
      'AZ-400, SC-100, AB-100, MS-102 or SC-730 — you need 2 of 6 for Level 3. AZ-305 is already in progress.',
    impact: 'high',
    category: 'Certification',
    href: '/certifications',
    cta: 'View certifications',
  },
  {
    id: 'r3',
    title: 'Sales competency needs attention',
    description:
      'Competency self-assessment level 3 → 4 requires co-leading a proposal. Add a goal or activity.',
    impact: 'medium',
    category: 'Competency',
    href: '/competencies',
    cta: 'Open competencies',
  },
  {
    id: 'r4',
    title: 'Align with your manager',
    description:
      'Review your development plan with your People Manager this quarter.',
    impact: 'medium',
    category: 'Career',
    href: '/career',
    cta: 'View career path',
  },
]
