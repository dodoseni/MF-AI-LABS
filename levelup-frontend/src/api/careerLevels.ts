import { apiGet } from './client'
import type { CareerLevel } from '../types'

/**
 * GET /api/career-levels — the Level 1-4 roadmap, already in
 * career-progression order (see `backend/src/data/careerLevels.js`).
 */
export function fetchCareerLevels(signal?: AbortSignal): Promise<CareerLevel[]> {
  return apiGet<CareerLevel[]>('/api/career-levels', signal)
}
