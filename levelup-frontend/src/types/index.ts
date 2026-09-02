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

/** How a level's certification requirements should be interpreted. */
export type LevelRequirementMode =
  | 'all' // hold every certification listed
  | 'choose' // hold at least `chooseAtLeast` of the listed certifications
  | 'holistic' // no fixed certification list — qualitative expectations (see focusAreas)

export interface CareerLevel {
  id: string
  /** Display name, e.g. "Level 1" */
  name: string
  /** Short one-line descriptor shown under the name, e.g. "Foundation" */
  tagline: string
  description: string
  color: string
  progress: number
  status: 'current' | 'completed' | 'upcoming'
  requirementMode: LevelRequirementMode
  /** Human-readable summary of the requirement rule, e.g. "Choose at least 2 of 13 certifications" */
  requirementNote: string
  /** Minimum number of certifications required when requirementMode === 'choose' */
  chooseAtLeast?: number
  /** Certification checklist for this level (empty for 'holistic' levels) */
  requirements: Requirement[]
  /** Qualitative expectations for 'holistic' levels (e.g. Level 4) */
  focusAreas?: string[]
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

export type CalendarEventType = 'study' | 'exam' | 'practice' | 'milestone'

export interface CalendarEvent {
  id: string
  date: string
  title: string
  type: CalendarEventType
}

export interface WeeklyPlanDay {
  day: string
  items: string[]
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

/** The signed-in user's profile, as returned by `GET /api/profile`. */
export interface Profile {
  id: string
  name: string
  email: string
  role: string
  level: string
  nextLevel: string
  office: string
  memberSince: string
  avatarInitials: string
}

/**
 * Combined learning-plan resource returned by `GET /api/learning-plan`
 * (development goals, the flat study-task list, the weekly cadence and
 * calendar events all live under this single endpoint on the backend).
 */
export interface LearningPlanData {
  goals: DevelopmentGoal[]
  tasks: StudyPlanItem[]
  weeklyPlan: WeeklyPlanDay[]
  calendar: CalendarEvent[]
}
