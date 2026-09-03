import { useEffect, useRef, useState } from 'react'
import { ApiNotice, Button, Card, CardHead, Icon, PageHead, ProgressBar } from '../components/ui'
import { studyChecklists as checklistsFallback } from '../data/mock'
import { getLearningPlan } from '../api/learningPlan'
import { useCertifications } from '../context/CertificationsContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { StudyChecklist } from '../types'

type ResourceStatus = 'loading' | 'success' | 'error'

export default function LearningPlan() {
  const { t } = useLanguage()
  const { certifications } = useCertifications()
  // Seeded from GET /api/learning-plan; falls back to local mock data while loading or on
  // error. There are no backend write endpoints yet, so every mutation below stays local —
  // `editedRef` also protects against a slow/late API response overwriting local edits.
  const [checklists, setChecklists] = useState<StudyChecklist[]>(checklistsFallback)
  const [status, setStatus] = useState<ResourceStatus>('loading')
  const [reloadKey, setReloadKey] = useState(0)
  const editedRef = useRef(false)

  const [newItemText, setNewItemText] = useState<Record<string, string>>({})
  const [showAddPlan, setShowAddPlan] = useState(false)
  const [newPlanCertId, setNewPlanCertId] = useState('')
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    getLearningPlan(controller.signal)
      .then((data) => {
        if (!editedRef.current) setChecklists(data)
        setStatus('success')
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error('Failed to load the learning plan from the API; showing fallback data.', err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [reloadKey])

  const availableCerts = certifications.filter(
    (c) => !checklists.some((p) => p.certificationId === c.id),
  )

  function toggleItem(planId: string, itemId: string) {
    editedRef.current = true
    setChecklists((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
          : p,
      ),
    )
  }

  function deleteItem(planId: string, itemId: string) {
    editedRef.current = true
    setChecklists((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p)),
    )
  }

  function addItem(planId: string) {
    const text = (newItemText[planId] ?? '').trim()
    if (!text) return
    editedRef.current = true
    setChecklists((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, items: [...p.items, { id: `item-${Date.now()}`, label: text, done: false }] }
          : p,
      ),
    )
    setNewItemText((prev) => ({ ...prev, [planId]: '' }))
  }

  function addPlan() {
    const cert = certifications.find((c) => c.id === newPlanCertId)
    if (!cert) return
    const plan: StudyChecklist = {
      id: `plan-${cert.id}-${Date.now()}`,
      certificationId: cert.id,
      certificationName: cert.name,
      items: [],
    }
    editedRef.current = true
    setChecklists((prev) => [plan, ...prev])
    setNewPlanCertId('')
    setShowAddPlan(false)
  }

  function deletePlan(id: string) {
    editedRef.current = true
    setChecklists((prev) => prev.filter((p) => p.id !== id))
    setDeletePlanId(null)
  }

  const deleteTarget = checklists.find((p) => p.id === deletePlanId) ?? null

  return (
    <div>
      <PageHead
        title={t('title.learning')}
        subtitle={t('learning.subtitle')}
        actions={
          <Button onClick={() => setShowAddPlan(true)}>
            <Icon name="plus" size={16} />
            {t('learning.newPlan')}
          </Button>
        }
      />

      {(status === 'loading' || status === 'error') && (
        <ApiNotice
          status={status}
          loadingText={t('common.loadingLearningPlan')}
          errorText={t('common.errorLearningPlan')}
          onRetry={status === 'error' ? () => setReloadKey((k) => k + 1) : undefined}
          retryLabel={t('common.retry')}
        />
      )}

      {checklists.length === 0 ? (
        <div className="card card-pad center" style={{ paddingBlock: 48 }}>
          <p style={{ color: 'var(--text-secondary)' }}>{t('learning.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          {checklists.map((plan) => {
            const done = plan.items.filter((i) => i.done).length
            const pct = plan.items.length ? Math.round((done / plan.items.length) * 100) : 0

            return (
              <Card key={plan.id}>
                <CardHead
                  title={plan.certificationName}
                  icon="grad"
                  action={
                    <button
                      type="button"
                      className="icon-btn icon-btn-danger"
                      onClick={() => setDeletePlanId(plan.id)}
                      aria-label={t('learning.deletePlan')}
                      title={t('learning.deletePlan')}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  }
                />
                <div style={{ padding: '4px 20px 8px' }}>
                  <div className="progress-label">
                    <span>{t('learning.plan.progress')}</span>
                    <span className="val">
                      {done}/{plan.items.length} · {pct}%
                    </span>
                  </div>
                  <ProgressBar value={pct} />
                </div>

                <div>
                  {plan.items.map((item) => (
                    <div className="study-item" key={item.id}>
                      <button
                        type="button"
                        className={`study-check ${item.done ? 'done' : ''}`}
                        onClick={() => toggleItem(plan.id, item.id)}
                        aria-label={item.done ? t('learning.markIncomplete') : t('learning.markComplete')}
                      >
                        {item.done && <Icon name="check" size={14} />}
                      </button>
                      <div
                        className="study-info"
                        style={{ flex: 1 }}
                      >
                        <div
                          className="t"
                          style={{
                            textDecoration: item.done ? 'line-through' : 'none',
                            color: item.done ? 'var(--text-secondary)' : undefined,
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => deleteItem(plan.id, item.id)}
                        aria-label={t('learning.deleteItem')}
                        title={t('learning.deleteItem')}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  ))}
                  {plan.items.length === 0 && (
                    <p style={{ padding: '0 20px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>
                      {t('learning.noItems')}
                    </p>
                  )}
                </div>

                <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder={t('learning.addItemPlaceholder')}
                    value={newItemText[plan.id] ?? ''}
                    onChange={(e) => setNewItemText((prev) => ({ ...prev, [plan.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addItem(plan.id)
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 8,
                      fontSize: 13.5,
                      color: 'var(--text-strong)',
                      background: 'var(--surface)',
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={() => addItem(plan.id)}>
                    <Icon name="plus" size={14} />
                    {t('common.add')}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showAddPlan && (
        <div className="modal-overlay" onClick={() => setShowAddPlan(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('learning.newPlan')}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddPlan(false)}
                aria-label={t('common.close')}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <label className="modal-field">
                <span>{t('learning.selectCertification')}</span>
                <select value={newPlanCertId} onChange={(e) => setNewPlanCertId(e.target.value)}>
                  <option value="">{t('learning.selectCertificationPlaceholder')}</option>
                  {availableCerts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {availableCerts.length === 0 && (
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                  {t('learning.allCertsHavePlans')}
                </p>
              )}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowAddPlan(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={addPlan}>{t('learning.createPlan')}</Button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeletePlanId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{t('learning.confirmDelete.title')}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setDeletePlanId(null)}
                aria-label={t('common.close')}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                {t('learning.confirmDelete.body', { name: deleteTarget.certificationName })}
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setDeletePlanId(null)}>
                {t('common.cancel')}
              </Button>
              <Button variant="danger" onClick={() => deletePlan(deleteTarget.id)}>
                {t('common.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
