import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Shared loading / error presentation for API-backed pages and cards.
 *
 * Every page that fetches from `src/api/*` wraps its content in this so the
 * app never crashes or shows a blank/broken screen when the backend is slow
 * or unreachable: while `loading` is true it renders a skeleton-ish
 * placeholder, on `error` it renders a retry banner, and otherwise it
 * renders `children` (the real content, once data has loaded at least
 * once).
 */
export function ApiState({
  loading,
  error,
  onRetry,
  children,
  label,
  compact = false,
}: {
  loading: boolean
  error: string | null
  onRetry: () => void
  children: ReactNode
  /** Optional short description of what's loading, e.g. "certifications". */
  label?: string
  /** Use a smaller inline placeholder instead of a full card-height one. */
  compact?: boolean
}) {
  const { t } = useLanguage()

  if (error) {
    return (
      <div className={`api-state api-state-error ${compact ? 'compact' : ''}`} role="alert">
        <span className="api-state-icon">
          <Icon name="alert" size={compact ? 20 : 28} />
        </span>
        <p className="api-state-message">{error}</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          {t('common.retry')}
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`api-state api-state-loading ${compact ? 'compact' : ''}`}>
        <span className="api-spinner" aria-hidden="true" />
        <p className="api-state-message">
          {label ? t('common.loadingResource', { resource: label }) : t('common.loading')}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
