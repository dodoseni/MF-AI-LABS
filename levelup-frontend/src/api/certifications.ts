import { apiGet } from './client'
import type { Certification } from '../types'

/**
 * GET /api/certifications
 *
 * There are no backend write endpoints yet — this is only ever used to seed the initial
 * value of `CertificationsContext`. Adds/deletes/status changes made in the UI stay
 * frontend-local (see `context/CertificationsContext.tsx`).
 */
export function getCertifications(signal?: AbortSignal): Promise<Certification[]> {
  return apiGet<Certification[]>('/api/certifications', signal)
}
