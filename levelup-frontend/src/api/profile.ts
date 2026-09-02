import { apiGet } from './client'
import type { Profile } from '../types'

/** GET /api/profile — the signed-in user's profile. */
export function fetchProfile(signal?: AbortSignal): Promise<Profile> {
  return apiGet<Profile>('/api/profile', signal)
}
