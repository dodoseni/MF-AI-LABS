import type {
  CareerLevel,
  Certification,
  CompetencyEntry,
  DevelopmentGoal,
  RecommendedAction,
} from '../types'

export const currentUser = {
  name: 'Amalie Berg',
  role: 'Senior Consultant',
  level: 'Senior Consultant',
  office: 'Oslo',
  memberSince: '2019',
  avatarInitials: 'AB',
  nextLevel: 'Principal Consultant',
}

export const dashboardStats = [
  {
    icon: 'level',
    label: 'Current level',
    value: 'Senior',
    detail: 'Next: Principal',
    tone: 'brand',
  },
  {
    icon: 'cert',
    label: 'Certifications',
    value: '8 / 12',
    detail: '4 to go',
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
  {
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-03-14',
    requiredFor: ['Consultant'],
    description:
      'Foundational understanding of cloud services and how those services are provided with Azure.',
  },
  {
    id: 'az-104',
    name: 'Azure Administrator Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-09-02',
    requiredFor: ['Senior Consultant'],
    description:
      'Implements, manages and monitors an organization’s Azure environment.',
  },
  {
    id: 'az-204',
    name: 'Azure Developer Associate',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Development',
    level: 'Associate',
    earnedDate: '2023-02-20',
    requiredFor: ['Senior Consultant'],
    description:
      'Designs, builds, tests and maintains cloud applications and services on Azure.',
  },
  {
    id: 'az-305',
    name: 'Azure Solutions Architect Expert',
    issuer: 'Microsoft',
    status: 'in-progress',
    category: 'Architecture',
    level: 'Expert',
    progress: 62,
    requiredFor: ['Principal Consultant'],
    description:
      'Advanced subject matter expertise in designing cloud and hybrid solutions.',
  },
  {
    id: 'sc-300',
    name: 'Identity and Access Administrator',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    requiredFor: ['Principal Consultant'],
    description:
      'Designs, implements and operates an organization’s identity and access management systems.',
  },
  {
    id: 'az-400',
    name: 'DevOps Engineer Expert',
    issuer: 'Microsoft',
    status: 'missing',
    category: 'DevOps',
    level: 'Expert',
    requiredFor: ['Principal Consultant'],
    description:
      'Combines people, process and technology to continuously deliver valuable products and services.',
  },
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
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    requiredFor: ['Principal Consultant'],
    description:
      'Implements, manages and monitors security for resources in Azure, multi-cloud and hybrid environments.',
  },
  {
    id: 'sc-100',
    name: 'Cybersecurity Architect Expert',
    issuer: 'Microsoft',
    status: 'recommended',
    category: 'Security',
    level: 'Expert',
    requiredFor: ['Specialisation: Security'],
    description:
      'Translates security strategy and requirements into a security architecture.',
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
    title: 'Book SC-300 certification',
    description:
      'Security certification is a missing requirement for Principal Consultant.',
    impact: 'high',
    category: 'Certification',
    href: '/certifications',
    cta: 'View certifications',
  },
  {
    id: 'r3',
    title: 'Sales competency needs attention',
    description:
      'Level 3 → 4 requires co-leading a proposal. Add a goal or activity.',
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
