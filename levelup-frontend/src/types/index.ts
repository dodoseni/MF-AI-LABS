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
}

/** A simple, per-certification study checklist — the entire Learning Plan data model. */
export interface StudyChecklist {
  id: string
  certificationId: string
  certificationName: string
  items: StudyChecklistItem[]
}
