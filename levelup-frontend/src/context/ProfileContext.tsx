import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { currentUser as fallbackProfile } from '../data/mock'
import { getProfile } from '../api/profile'
import type { Profile } from '../types'

export type ResourceStatus = 'loading' | 'success' | 'error'

interface ProfileContextValue {
  /** GET /api/profile result. Starts as the local mock fallback so the UI never renders
   *  blank while loading or if the backend is unreachable. */
  profile: Profile
  status: ResourceStatus
  /** Re-run the GET /api/profile request (e.g. from a "Retry" button after an error). */
  refetch: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(fallbackProfile)
  const [status, setStatus] = useState<ResourceStatus>('loading')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getProfile(controller.signal)
      .then((data) => {
        setProfile(data)
        setStatus('success')
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        // Keep showing the last known/fallback profile — never blank the page on a failed fetch.
        console.error('Failed to load profile from the API; showing fallback data.', err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [reloadKey])

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, status, refetch: () => setReloadKey((k) => k + 1) }),
    [profile, status],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return ctx
}
