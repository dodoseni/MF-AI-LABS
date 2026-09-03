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
  /** The backend always sends this field, using `null` instead of omitting it when unearned. */
  earnedDate?: string | null
  /** The backend always sends this field, using `null` instead of omitting it when not tracked. */
  progress?: number | null
  requiredFor: string[]
  description: string
  documents?: string[]
}

/** The current user's profile — matches the `GET /api/profile` response shape. */
export interface Profile {
  id: string
  name: string
  email: string
  role: string
  /** Display name of the user's current career level, e.g. "Level 3". */
  level: string
  /** Display name of the next career level, e.g. "Level 4". */
  nextLevel: string
  office: string
  memberSince: string
  avatarInitials: string
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
  /** Id of the certification this requirement tracks (matches `Certification.id`). Used to
   *  recompute `met`/`detail` live from the certifications list instead of a static flag. */
  certId?: string
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

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

/** A single todo-list item inside a certification study checklist. */
export interface StudyChecklistItem {
  id: string
  label: string
  done: boolean
  /** Optional planned/target date (ISO `yyyy-mm-dd`). When set, the item is surfaced on the
   *  Learning Plan calendar (see `CalendarEvent`) — undated items (e.g. user-added todos) are
   *  checklist-only and don't appear on the calendar. */
  date?: string
  /** Calendar visual-indicator type for this item; defaults to `'study'` when a date is set but
   *  no explicit type is given. */
  type?: CalendarEventType
}

/** A simple, per-certification study checklist — the entire Learning Plan data model. */
export interface StudyChecklist {
  id: string
  certificationId: string
  certificationName: string
  items: StudyChecklistItem[]
}

/** Visual-indicator categories shown on the Learning Plan calendar. */
export type CalendarEventType = 'module' | 'study' | 'practice' | 'exam' | 'milestone'

/** A single dated entry on the Learning Plan calendar — a study session, module, practice
 *  exam, certification exam or milestone/deadline. */
export interface CalendarEvent {
  id: string
  /** ISO date (`yyyy-mm-dd`), local time — matches the day it should render under. */
  date: string
  title: string
  type: CalendarEventType
  /** Id of the related certification (matches `Certification.id`), when applicable. */
  certificationId?: string
}

/** One day of the user's recurring weekly study cadence (e.g. "Monday" → study items). */
export interface WeeklyPlanDay {
  day: string
  items: string[]
}
