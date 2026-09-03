import { apiGet } from './client'
import type { CareerLevel } from '../types'

/**
 * GET /api/career-levels
 *
 * Note: unlike the frontend's own `data/mock.ts` template, the backend's `requirements[]`
 * do not include a `certId` field linking a requirement to a `Certification.id`. See the
 * `REQUIREMENT_CERT_LINKS` map in `context/CertificationsContext.tsx` for how that gap is
 * bridged on the frontend so live certification progress can still be derived.
 */
export function getCareerLevels(signal?: AbortSignal): Promise<CareerLevel[]> {
  return apiGet<CareerLevel[]>('/api/career-levels', signal)
}
