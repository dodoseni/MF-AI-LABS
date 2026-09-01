export type CertificationStatus =
  | 'completed'
  | 'in-progress'
  | 'missing'
  | 'recommended'

export interface Certification {
  id: string
  name: string
  issuer: string
  status: CertificationStatus
  category: string
  level: 'Associate' | 'Professional' | 'Specialist' | 'Expert'
  earnedDate?: string
  progress?: number
  requiredFor: string[]
  description: string
  documents?: string[]
}

export type CompetencyArea =
  | 'Sales'
  | 'Delivery'
  | 'Manage'
  | 'Entrepreneurship'
  | 'Develop'

export type SelfAssessmentLevel = 1 | 2 | 3 | 4 | 5

export interface CompetencyEntry {
  area: CompetencyArea
  label: string
  description: string
  current: SelfAssessmentLevel
  target: SelfAssessmentLevel
  previous: SelfAssessmentLevel
}

export interface CareerLevel {
  id: string
  name: string
  role: string
  description: string
  yearsExperience: string
  color: string
  progress: number
  status: 'current' | 'completed' | 'upcoming'
  requirements: Requirement[]
}

export interface Requirement {
  label: string
  detail: string
  met: boolean
}

export interface Milestone {
  id: string
  label: string
  date: string
  done: boolean
}

export interface DevelopmentGoal {
  id: string
  title: string
  category: string
  status: 'active' | 'in-progress' | 'completed'
  progress: number
  milestones: Milestone[]
  dueDate: string
}

export interface StudyPlanItem {
  id: string
  title: string
  source: string
  duration: string
  completed: boolean
  type: 'course' | 'certification' | 'reading' | 'practice'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface DashboardCardStat {
  icon: string
  label: string
  value: string
  detail: string
  tone: 'brand' | 'success' | 'warning' | 'info' | 'violet'
}

export interface RecommendedAction {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: string
  href: string
  cta: string
}
