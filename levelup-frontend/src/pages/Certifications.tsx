import { useState } from 'react'
import {
  Badge,
  Button,
  Icon,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import { certifications } from '../data/mock'
import type { CertificationStatus } from '../types'

const statusTone: Record<CertificationStatus, string> = {
  completed: 'success',
  'in-progress': 'info',
  missing: 'red',
  recommended: 'violet',
}

const filterOptions: { key: CertificationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'missing', label: 'Missing' },
  { key: 'recommended', label: 'Recommended' },
]

export default function Certifications() {
  const [filter, setFilter] = useState<CertificationStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const completed = certifications.filter((c) => c.status === 'completed').length
  const inProgress = certifications.filter(
    (c) => c.status === 'in-progress',
  ).length
  const missing = certifications.filter((c) => c.status === 'missing').length

  const filtered = certifications.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  return (
    <div>
      <PageHead
        title="Certifications"
        subtitle="Track your certification progress, discover required and recommended certifications, and add new ones."
        actions={
          <Button>
            <Icon name="plus" size={16} />
            Add certification
          </Button>
        }
      />

      <div className="grid grid-4 mb-16">
        <StatCard icon="cert" label="Completed" value={completed} detail={`of ${certifications.length} tracked`} tone="success" />
        <StatCard icon="clock" label="In progress" value={inProgress} detail="actively studying" tone="info" />
        <StatCard icon="alert" label="Missing" value={missing} detail="required for next level" tone="warning" />
        <StatCard icon="sparkle" label="Recommended" value={recommendedCount} detail="based on your goals" tone="violet" />
      </div>

      <div className="toolbar mb-16">
        <div className="field">
          <Icon name="search" size={17} />
          <input
            type="text"
            placeholder="Search certifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="segmented">
          {filterOptions.map((o) => (
            <button
              key={o.key}
              className={`seg-btn ${filter === o.key ? 'active' : ''}`}
              onClick={() => setFilter(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <div className="field">
          <Icon name="filter" size={17} />
          <select defaultValue="all">
            <option value="all">All categories</option>
            <option value="cloud">Cloud Platform</option>
            <option value="dev">Development</option>
            <option value="sec">Security</option>
            <option value="ai">Data & AI</option>
          </select>
        </div>
      </div>

      <div className="cert-grid">
        {filtered.map((c) => (
          <div className="cert-card" key={c.id}>
            <div className="cert-top">
              <div>
                <div className="cert-issuer">{c.issuer} · {c.level}</div>
                <div className="cert-name">{c.name}</div>
              </div>
              <Badge tone={statusTone[c.status]} dot>
                {c.status}
              </Badge>
            </div>
            <p className="cert-desc">{c.description}</p>

            {c.status === 'in-progress' && (
              <div>
                <div className="progress-label">
                  <span>Progress</span>
                  <span className="val">{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress ?? 0} tone="violet" />
              </div>
            )}

            <div className="cert-tags">
              <Badge tone="gray">{c.category}</Badge>
              {c.requiredFor.length > 0 && (
                <Badge tone="blue">Required: {c.requiredFor.join(', ')}</Badge>
              )}
              {c.earnedDate && (
                <Badge tone="neutral">Earned {formatDate(c.earnedDate)}</Badge>
              )}
            </div>

            <div className="cert-footer">
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {c.status === 'completed' ? 'Certification valid' : 'Track'}
              </span>
              <Button size="sm" variant={c.status === 'completed' ? 'secondary' : 'primary'}>
                {c.status === 'completed' ? 'View details' : 'Start tracking'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card card-pad center" style={{ paddingBlock: 48 }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            No certifications match your current filters.
          </p>
        </div>
      )}
    </div>
  )
}

const recommendedCount =
  certifications.filter((c) => c.status === 'recommended').length

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
