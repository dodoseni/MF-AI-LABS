// Thin fetch-based HTTP client for the LevelUp backend API.
//
// The backend (see `backend/src`) is a plain Express API that wraps every
// successful response in a `{ data: T }` envelope (see `ApiEnvelope<T>`
// below) and returns `{ error: string }` on failure. This module is the
// only place that knows about that wire format — every `src/api/*.ts`
// module built on top of it works with plain, already-unwrapped domain
// types (`Certification[]`, `CareerLevel[]`, etc.) from `src/types`.
//
// Base URL comes from the Vite env var `VITE_API_BASE_URL` (see
// `.env.example`) so the deployed Static Web App can point at the deployed
// Azure App Service without any code change. Falls back to the local
// backend dev server (`backend/`, `npm run dev`, default port 4000) when
// the variable isn't set — e.g. for local development without a `.env`.
const DEFAULT_DEV_BASE_URL = 'http://localhost:4000'

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL
  const trimmed = configured?.trim().replace(/\/+$/, '')
  return trimmed || DEFAULT_DEV_BASE_URL
}

export const API_BASE_URL = resolveBaseUrl()

/** Standard success envelope every LevelUp API GET endpoint returns. */
export interface ApiEnvelope<T> {
  data: T
}

/** Standard error envelope the LevelUp API returns on failure. */
export interface ApiErrorEnvelope {
  error: string
}

const DEFAULT_TIMEOUT_MS = 10_000

/**
 * Error thrown by `apiGet` for any failure — network failure, timeout,
 * non-2xx response, or an unexpected response shape. Callers (typically the
 * `useApiResource` hook) only ever need `.message`, which is already a
 * user-presentable string.
 */
export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function combineSignals(
  external: AbortSignal | undefined,
  timeoutMs: number,
): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  return external ? AbortSignal.any([external, timeoutSignal]) : timeoutSignal
}

/**
 * GET `${API_BASE_URL}${path}` and return the unwrapped `data` payload.
 *
 * Throws `ApiError` for any failure — the caller decides how to present it
 * (this module never touches UI state). `signal` is forwarded so callers
 * can cancel in-flight requests (e.g. on unmount / retry).
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: combineSignals(signal, DEFAULT_TIMEOUT_MS),
    })
  } catch (err) {
    if (signal?.aborted) {
      // Caller (e.g. unmount) cancelled the request — not a real failure.
      throw err
    }
    if (err instanceof DOMException && err.name === 'TimeoutError') {
      throw new ApiError('The request to the LevelUp API timed out. Please try again.')
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The request to the LevelUp API timed out. Please try again.')
    }
    throw new ApiError(
      'Unable to reach the LevelUp API. Check your connection and try again.',
    )
  }

  if (!response.ok) {
    let message = `LevelUp API request failed (${response.status})`
    try {
      const body = (await response.json()) as Partial<ApiErrorEnvelope>
      if (body?.error) message = body.error
    } catch {
      // Response wasn't JSON — fall back to the generic status message.
    }
    throw new ApiError(message, response.status)
  }

  try {
    const body = (await response.json()) as ApiEnvelope<T>
    return body.data
  } catch {
    throw new ApiError('Received an unexpected response from the LevelUp API.')
  }
}
