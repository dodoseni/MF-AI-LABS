// Mock data for LevelUp certifications.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`certifications`) and
// `levelup-frontend/src/types/index.ts` (`Certification`) so the API contract
// matches the existing UI.

const certifications = [
  {
    id: 'az-900',
    name: 'Microsoft Azure Fundamentals',
    issuer: 'Microsoft',
    status: 'completed',
    category: 'Cloud Platform',
    level: 'Associate',
    earnedDate: '2022-03-14',
    progress: null,
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
    progress: null,
    requiredFor: ['Senior Consultant'],
    description:
      "Implements, manages and monitors an organization's Azure environment.",
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
    earnedDate: null,
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
    earnedDate: null,
    progress: null,
    requiredFor: ['Principal Consultant'],
    description:
      "Designs, implements and operates an organization's identity and access management systems.",
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
    status: 'missing',
    category: 'Security',
    level: 'Associate',
    earnedDate: null,
    progress: null,
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
    earnedDate: null,
    progress: null,
    requiredFor: ['Specialisation: Security'],
    description:
      'Translates security strategy and requirements into a security architecture.',
  },
];

module.exports = { certifications };
