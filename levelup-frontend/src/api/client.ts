// Thin fetch wrapper for the LevelUp backend API (MIKK-52).
//
// Every read endpoint currently implemented by the backend (`/api/profile`,
// `/api/certifications`, `/api/career-levels`, `/api/learning-plan`) wraps its payload as
// `{ "data": T }`. `/api/health` is the one exception and is not consumed by the frontend today.
//
// The base URL comes from `VITE_API_BASE_URL` (see `.env.example`) so no Azure hostname is
// hardcoded in application code.

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

/** Thrown for any failed API call — network failure, non-2xx response, or bad payload shape. */
export class ApiError extends Error {
  /** HTTP status code, when the request reached the server. */
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface Envelope<T> {
  data: T
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}

/**
 * Generic GET helper for endpoints that follow the backend's `{ data: T }` envelope.
 * Rejects with `ApiError` on network failure or a non-2xx response; rethrows `AbortError`
 * as-is so callers using `AbortController` (e.g. to cancel a request on unmount) can
 * distinguish an intentional cancellation from a real failure.
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      'VITE_API_BASE_URL is not configured — see levelup-frontend/.env.example.',
    )
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (err) {
    if (isAbortError(err)) throw err
    throw new ApiError(`Could not reach the LevelUp API at ${path}.`)
  }

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}.`, response.status)
  }

  let body: Envelope<T>
  try {
    body = (await response.json()) as Envelope<T>
  } catch {
    throw new ApiError(`Received an invalid JSON response from ${path}.`, response.status)
  }

  return body.data
}
