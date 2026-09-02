import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import type { CareerLevel } from '../types'

/* ---------- Card ---------- */
export function Card({
  children,
  className = '',
  pad = false,
}: {
  children: ReactNode
  className?: string
  pad?: boolean
}) {
  return (
    <div className={`card ${pad ? 'card-pad' : ''} ${className}`}>{children}</div>
  )
}

export function CardHead({
  title,
  icon,
  action,
  link,
  linkLabel,
}: {
  title: string
  icon?: string
  action?: ReactNode
  link?: string
  linkLabel?: string
}) {
  return (
    <div className="card-head">
      <div className="card-title-wrap">
        {icon && (
          <span
            style={{
              color: 'var(--brand-600)',
              display: 'inline-flex',
              marginTop: '1px',
            }}
          >
            <Icon name={icon} size={18} />
          </span>
        )}
        <h3 className="card-title">{title}</h3>
      </div>
      {action ??
        (link && (
          <Link to={link} className="card-link">
            {linkLabel ?? 'View all'}
            <Icon name="arrowRight" size={14} />
          </Link>
        ))}
    </div>
  )
}

/* ---------- Badge ---------- */
const badgeTone: Record<string, string> = {
  success: 'green',
  completed: 'green',
  info: 'blue',
  'in-progress': 'blue',
  warning: 'amber',
  missing: 'red',
  recommended: 'violet',
  neutral: 'gray',
  active: 'blue',
  'in_progress': 'amber',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: ReactNode
  tone?: string
  dot?: boolean
}) {
  const cls = badgeTone[tone] ?? 'gray'
  return (
    <span className={`badge ${cls}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  )
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({
  value,
  tone,
  height = 8,
}: {
  value: number
  tone?: 'success' | 'warning' | 'violet' | 'teal'
  height?: number
}) {
  return (
    <div className="progress-track" style={{ height }}>
      <div
        className={`progress-bar ${tone ? `tone-${tone}` : ''}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function ProgressLabel({
  label,
  value,
  suffix = '%',
}: {
  label: string
  value: number
  suffix?: string
}) {
  return (
    <div className="progress-label">
      <span>{label}</span>
      <span className="val">
        {value}
        {suffix}
      </span>
    </div>
  )
}

/* ---------- StatCard ---------- */
export function StatCard({
  icon,
  label,
  value,
  detail,
  tone = 'brand',
}: {
  icon: string
  label: string
  value: ReactNode
  detail?: string
  tone?: 'brand' | 'success' | 'warning' | 'info' | 'violet'
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon tone-${tone}`}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
      {detail && <div className="stat-detail">{detail}</div>}
    </div>
  )
}

/* ---------- Buttons ---------- */
export function Button({
  children,
  variant = 'primary',
  size,
  onClick,
  type = 'button',
  className = '',
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

/* ---------- Level dots ---------- */
export function LevelDots({
  current,
  target,
}: {
  current: number
  target: number
}) {
  return (
    <div className="level-dots" title={`Level ${current} of 5 (target ${target})`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`level-dot ${
            i <= current ? 'filled' : i === target ? 'target' : ''
          }`}
        />
      ))}
    </div>
  )
}

/* ---------- Level roadmap ---------- */
const levelStatusIcon: Record<CareerLevel['status'], string> = {
  completed: 'checkCircle',
  current: 'clock',
  upcoming: 'circle',
}

export function LevelRoadmap({
  levels,
  selectedId,
  onSelect,
}: {
  levels: CareerLevel[]
  selectedId?: string
  onSelect?: (id: string) => void
}) {
  return (
    <div className="level-roadmap" role={onSelect ? 'tablist' : undefined}>
      {levels.map((l, i) => (
        <div className="level-roadmap-item" key={l.id}>
          <button
            type="button"
            role={onSelect ? 'tab' : undefined}
            aria-selected={onSelect ? selectedId === l.id : undefined}
            className={`level-chip status-${l.status} ${
              selectedId === l.id ? 'selected' : ''
            } ${onSelect ? '' : 'static'}`}
            onClick={() => onSelect?.(l.id)}
          >
            <span className={`level-chip-icon icon-${l.status}`}>
              <Icon name={levelStatusIcon[l.status]} size={15} />
            </span>
            {l.name}
          </button>
          {i < levels.length - 1 && (
            <span className="level-roadmap-arrow">
              <Icon name="arrowRight" size={14} />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------- Empty note (page head) ---------- */
export function PageHead({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="page-head">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h1>{title}</h1>
          {subtitle && <p className="sub">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  )
}

export { Link, Icon }
