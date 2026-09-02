import { useEffect, useState } from 'react'
import {
  Badge,
  Button,
  Icon,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import { certifications as initialCertifications } from '../data/mock'
import type { Certification, CertificationStatus } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

const FAVOURITES_STORAGE_KEY = 'levelup.favouriteCertifications'

type CertificationFilter = CertificationStatus | 'all' | 'favourites'

function getInitialFavourites(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const stored = window.localStorage.getItem(FAVOURITES_STORAGE_KEY)
    const ids = stored ? (JSON.parse(stored) as string[]) : []
    return new Set(ids)
  } catch {
    return new Set()
  }
}

const statusTone: Record<CertificationStatus, string> = {
  completed: 'success',
  'in-progress': 'info',
  missing: 'red',
  recommended: 'violet',
}

const categories = [
  'Cloud Platform',
  'Development',
  'Security',
  'Data & AI',
  'DevOps',
  'Architecture',
  'Infrastructure',
  'Collaboration',
  'Internal',
]

export default function Certifications() {
  const { t } = useLanguage()
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications)
  const [filter, setFilter] = useState<CertificationFilter>('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [favourites, setFavourites] = useState<Set<string>>(getInitialFavourites)

  useEffect(() => {
    window.localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(Array.from(favourites)))
  }, [favourites])

  const filterOptions: { key: CertificationFilter; label: string }[] = [
    { key: 'all', label: t('certifications.filter.all') },
    { key: 'completed', label: t('certifications.filter.completed') },
    { key: 'in-progress', label: t('certifications.filter.inProgress') },
    { key: 'missing', label: t('certifications.filter.missing') },
    { key: 'recommended', label: t('certifications.filter.recommended') },
    { key: 'favourites', label: t('certifications.filter.favourites') },
  ]

  const completed = certifications.filter((c) => c.status === 'completed').length
  const inProgress = certifications.filter((c) => c.status === 'in-progress').length
  const missing = certifications.filter((c) => c.status === 'missing').length

  const filtered = certifications.filter((c) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'favourites' ? favourites.has(c.id) : c.status === filter
    const matchesCategory = category === 'all' || c.category === category
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    return matchesFilter && matchesCategory && matchesSearch
  })

  function toggleFavourite(id: string) {
    setFavourites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function updateStatus(id: string, status: CertificationStatus) {
    setCertifications((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              progress: status === 'in-progress' ? c.progress ?? 10 : c.progress,
              earnedDate:
                status === 'completed'
                  ? c.earnedDate ?? new Date().toISOString().slice(0, 10)
                  : c.earnedDate,
            }
          : c,
      ),
    )
  }

  return (
    <div>
      <PageHead
        title={t('title.certifications')}
        subtitle={t('certifications.subtitle')}
      />

      <div className="grid grid-3 mb-16">
        <StatCard icon="cert" label={t('certifications.stat.completed')} value={completed} detail={t('certifications.stat.completedDetail', { total: certifications.length })} tone="success" />
        <StatCard icon="clock" label={t('certifications.stat.inProgress')} value={inProgress} detail={t('certifications.stat.inProgressDetail')} tone="info" />
        <StatCard icon="alert" label={t('certifications.stat.missing')} value={missing} detail={t('certifications.stat.missingDetail')} tone="warning" />
      </div>

      <div className="toolbar mb-16">
        <div className="field">
          <Icon name="search" size={17} />
          <input
            type="text"
            placeholder={t('certifications.searchPlaceholder')}
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
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">{t('certifications.category.all')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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
              <div className="cert-top-actions">
                <button
                  type="button"
                  className={`cert-fav-btn ${favourites.has(c.id) ? 'active' : ''}`}
                  onClick={() => toggleFavourite(c.id)}
                  aria-pressed={favourites.has(c.id)}
                  aria-label={
                    favourites.has(c.id)
                      ? t('certifications.favourite.remove')
                      : t('certifications.favourite.add')
                  }
                  title={
                    favourites.has(c.id)
                      ? t('certifications.favourite.remove')
                      : t('certifications.favourite.add')
                  }
                >
                  <Icon
                    name="star"
                    size={18}
                    style={{ fill: favourites.has(c.id) ? 'currentColor' : 'none' }}
                  />
                </button>
                <Badge tone={statusTone[c.status]} dot>
                  {t(`common.status.${c.status}` as const)}
                </Badge>
              </div>
            </div>
            <p className="cert-desc">{c.description}</p>

            {c.status === 'in-progress' && (
              <div>
                <div className="progress-label">
                  <span>{t('certifications.progress')}</span>
                  <span className="val">{c.progress}%</span>
                </div>
                <ProgressBar value={c.progress ?? 0} tone="violet" />
              </div>
            )}

            <div className="cert-tags">
              <Badge tone="gray">{c.category}</Badge>
              {c.requiredFor.length > 0 && (
                <Badge tone="blue">{t('certifications.required', { levels: c.requiredFor.join(', ') })}</Badge>
              )}
              {c.earnedDate && (
                <Badge tone="neutral">{t('certifications.earned', { date: formatDate(c.earnedDate) })}</Badge>
              )}
            </div>

            <div className="cert-footer">
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {c.status === 'completed' ? t('certifications.valid') : t('certifications.track')}
              </span>
              {c.status === 'completed' ? (
                <Button size="sm" variant="secondary">
                  {t('certifications.viewDetails')}
                </Button>
              ) : c.status === 'in-progress' ? (
                <Button size="sm" onClick={() => updateStatus(c.id, 'completed')}>
                  {t('certifications.markCompleted')}
                </Button>
              ) : (
                <Button size="sm" onClick={() => updateStatus(c.id, 'in-progress')}>
                  {t('certifications.startTracking')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card card-pad center" style={{ paddingBlock: 48 }}>
          <p style={{ color: 'var(--text-secondary)' }}>{t('certifications.empty')}</p>
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
