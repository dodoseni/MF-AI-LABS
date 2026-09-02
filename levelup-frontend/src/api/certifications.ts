import { apiGet } from './client'
import type { Certification } from '../types'

// The backend always sends `earnedDate`/`progress` as explicit `null` when
// absent (a deliberate backend convention, see `backend/src/data/certifications.js`)
// rather than omitting the field. The frontend `Certification` type predates
// the API and models both as optional (`?: string` / `?: number`), so we
// normalise `null -> undefined` here rather than widening that type (or the
// many `c.earnedDate && ...` / `c.progress ?? 0` checks across the app) to
// also accept `null`.
type ApiCertification = Omit<Certification, 'earnedDate' | 'progress'> & {
  earnedDate: string | null
  progress: number | null
}

function normalize(cert: ApiCertification): Certification {
  return {
    ...cert,
    earnedDate: cert.earnedDate ?? undefined,
    progress: cert.progress ?? undefined,
  }
}

/** GET /api/certifications — the full certification catalog. */
export async function fetchCertifications(signal?: AbortSignal): Promise<Certification[]> {
  const certifications = await apiGet<ApiCertification[]>('/api/certifications', signal)
  return certifications.map(normalize)
}
