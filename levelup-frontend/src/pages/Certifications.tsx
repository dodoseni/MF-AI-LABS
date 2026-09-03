import { useState } from 'react'
import {
  ApiNotice,
  Badge,
  Button,
  Icon,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import { useCertifications } from '../context/CertificationsContext'
import type { CertificationStatus } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

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
  const {
    certifications,
    certificationsStatus,
    refetchCertifications,
    addCertification,
    deleteCertification,
    updateCertificationStatus,
  } = useCertifications()
  const [filter, setFilter] = useState<CertificationStatus | 'all'>('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', issuer: '', category: categories[0] })
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filterOptions: { key: CertificationStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('certifications.filter.all') },
    { key: 'completed', label: t('certifications.filter.completed') },
    { key: 'in-progress', label: t('certifications.filter.inProgress') },
    { key: 'missing', label: t('certifications.filter.missing') },
    { key: 'recommended', label: t('certifications.filter.recommended') },
  ]

  const completed = certifications.filter((c) => c.status === 'completed').length
  const inProgress = certifications.filter((c) => c.status === 'in-progress').length
  const missing = certifications.filter((c) => c.status === 'missing').length
  const recommendedCount = certifications.filter((c) => c.status === 'recommended').length

  const filtered = certifications.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter
    const matchesCategory = category === 'all' || c.category === category
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    return matchesFilter && matchesCategory && matchesSearch
  })

  function updateStatus(id: string, status: CertificationStatus) {
    updateCertificationStatus(id, status)
  }

  function submitAddCertification() {
    if (!form.name.trim()) return
    addCertification(form)
    setForm({ name: '', issuer: '', category: categories[0] })
    setShowModal(false)
  }

  const deleteTarget = certifications.find((c) => c.id === deleteTargetId) ?? null

  function confirmDelete() {
    if (!deleteTargetId) return
    deleteCertification(deleteTargetId)
    setDeleteTargetId(null)
  }

  return (
    <div>
      <PageHead
        title={t('title.certifications')}
        subtitle={t('certifications.subtitle')}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Icon name="plus" size={16} />
            {t('common.addCertification')}
          </Button>
        }
      />

      {(certificationsStatus === 'loading' || certificationsStatus === 'error') && (
        <ApiNotice
          status={certificationsStatus}
          loadingText={t('common.loadingCertifications')}
          errorText={t('common.errorCertifications')}
          onRetry={certificationsStatus === 'error' ? refetchCertifications : undefined}
          retryLabel={t('common.retry')}
        />
      )}

      <div className="grid grid-4 mb-16">
        <StatCard icon="cert" label={t('certifications.stat.completed')} value={completed} detail={t('certifications.stat.completedDetail', { total: certifications.length })} tone="success" />
        <StatCard icon="clock" label={t('certifications.stat.inProgress')} value={inProgress} detail={t('certifications.stat.inProgressDetail')} tone="info" />
        <StatCard icon="alert" label={t('certifications.stat.missing')} value={missing} detail={t('certifications.stat.missingDetail')} tone="warning" />
        <StatCard icon="sparkle" label={t('certifications.stat.recommended')} value={recommendedCount} detail={t('certifications.stat.recommendedDetail')} tone="violet" />
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone={statusTone[c.status]} dot>
                  {t(`common.status.${c.status}` as const)}
                </Badge>
                <button
                  type="button"
                  className="icon-btn icon-btn-danger"
                  onClick={() => setDeleteTargetId(c.id)}
                  aria-label={t('certifications.delete')}
                  title={t('certifications.delete')}
                >
                  <Icon name="trash" size={16} />
                </button>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('certifications.modal.title')}</h3>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)} aria-label={t('common.close')}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-field">
                <span>{t('certifications.modal.name')}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. AZ-500"
                  autoFocus
                />
              </label>
              <label className="modal-field">
                <span>{t('certifications.modal.issuer')}</span>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))}
                  placeholder="Microsoft"
                />
              </label>
              <label className="modal-field">
                <span>{t('certifications.modal.category')}</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={submitAddCertification}>{t('certifications.modal.add')}</Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('certifications.confirmDelete.title')}</h3>
              <button type="button" className="modal-close" onClick={() => setDeleteTargetId(null)} aria-label={t('common.close')}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                {t('certifications.confirmDelete.body', { name: deleteTarget.name })}
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
