import { createContext, useContext, type ReactNode } from 'react'
import { fetchProfile } from './profile'
import { useApiResource, type ApiResourceState } from './useApiResource'
import type { Profile } from '../types'

const ProfileContext = createContext<ApiResourceState<Profile> | null>(null)

/**
 * Fetches `GET /api/profile` once for the whole app and shares the result
 * via context. The profile is needed in several independent places at once
 * (the persistent `Sidebar`, the `Dashboard` greeting/stat cards, the
 * `Profile` page) — without this, each would run its own `useApiResource`
 * and fire a duplicate request on every page load.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const state = useApiResource(fetchProfile)
  return <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
}

export function useProfile(): ApiResourceState<Profile> {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return ctx
}
