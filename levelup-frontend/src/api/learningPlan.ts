import { apiGet } from './client'
import type { StudyChecklist } from '../types'

/**
 * GET /api/learning-plan
 *
 * Returns `StudyChecklist[]` (redesigned in MIKK-46 to match the frontend's post-MIKK-37
 * study-checklist model). There are no backend write endpoints yet — this is only used to
 * seed the initial checklists in `pages/LearningPlan.tsx`; toggle/add/delete item and
 * create/delete plan stay frontend-local.
 */
export function getLearningPlan(signal?: AbortSignal): Promise<StudyChecklist[]> {
  return apiGet<StudyChecklist[]>('/api/learning-plan', signal)
}
