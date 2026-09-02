import { apiGet } from './client'
import type { LearningPlanData } from '../types'

/**
 * GET /api/learning-plan — development goals, the study-task list, the
 * weekly cadence and calendar events, combined into a single resource by
 * the backend (see `backend/src/services/learningPlanService.js`).
 */
export function fetchLearningPlan(signal?: AbortSignal): Promise<LearningPlanData> {
  return apiGet<LearningPlanData>('/api/learning-plan', signal)
}
