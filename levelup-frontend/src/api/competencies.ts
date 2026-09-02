import { apiGet } from './client'
import type { CompetencyEntry } from '../types'

/** GET /api/competencies — the 5 competency areas with self-assessment levels. */
export function fetchCompetencies(signal?: AbortSignal): Promise<CompetencyEntry[]> {
  return apiGet<CompetencyEntry[]>('/api/competencies', signal)
}
