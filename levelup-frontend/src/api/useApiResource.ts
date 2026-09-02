import { useCallback, useEffect, useState } from 'react'

export interface ApiResourceState<T> {
  /** The last successfully loaded value, or `null` before the first success. */
  data: T | null
  /** True while a request is in flight (initial load or retry). */
  loading: boolean
  /** User-presentable error message, or `null` when the last request succeeded. */
  error: string | null
  /** Re-run the fetcher (e.g. from an error banner's "Retry" button). */
  retry: () => void
}

/**
 * Generic async-resource hook used by every page that consumes the LevelUp
 * API. Wraps a `fetcher(signal) => Promise<T>` — pass one of the stable
 * `fetch*` function exports in `src/api/*.ts` (not an inline arrow, since
 * its identity is a `useEffect` dependency below) — with loading / data /
 * error state and abort-on-unmount / abort-on-retry semantics.
 *
 * Kept dependency-free (no react-query / swr) to match the rest of this
 * codebase, which favours small hand-rolled hooks (see `useLanguage`).
 */
export function useApiResource<T>(fetcher: (signal: AbortSignal) => Promise<T>): ApiResourceState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetcher(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setLoading(false)
      })

    return () => controller.abort()
    // `attempt` is the only intentional re-fetch trigger, bumped by `retry()`.
  }, [attempt, fetcher])

  // `loading`/`error` start correctly-initialised (`true`/`null`) for the
  // first mount via `useState` above; `retry()` is the event that resets
  // them for a re-fetch, rather than doing it synchronously inside the
  // effect that performs the fetch.
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setAttempt((a) => a + 1)
  }, [])

  return { data, loading, error, retry }
}
