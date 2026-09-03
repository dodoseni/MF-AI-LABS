import { apiGet } from './client'
import type { Profile } from '../types'

/** GET /api/profile */
export function getProfile(signal?: AbortSignal): Promise<Profile> {
  return apiGet<Profile>('/api/profile', signal)
}
