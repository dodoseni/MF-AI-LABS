import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, CardHead, Icon, LevelRoadmap, PageHead, ProgressBar } from '../components/ui'
import { careerPath } from '../data/mock'
import type { CareerLevel } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

const statTone: Record<string, string> = {
  completed: 'success',
  current: 'info',
  upcoming: 'gray',
}

const statusKey = {
  completed: 'common.status.completed',
  current: 'common.status.current',
  upcoming: 'common.status.upcoming',
} as const

function LevelDetail({ level }: { level: CareerLevel }) {
  const { t } = useLanguage()
  const locked = level.status === 'upcoming'
  const met = level.requirements.filter((r) => r.met).length
  const requirementSatisfied =
    level.requirementMode === 'choose' && level.chooseAtLeast
      ? met >= level.chooseAtLeast
      : level.requirementMode === 'all'
        ? met === level.requirements.length
        : false

  return (
    <div className={`level-card level-detail ${level.status === 'current' ? 'current' : ''} ${locked ? 'level-card-locked' : ''}`}>
      <div className="level-card-top">
        <div className="level-badge" style={{ background: level.color }}>
          <Icon name="level" size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="level-name">{level.name}</span>
            <Badge tone={statTone[level.status]} dot>
              {t(statusKey[level.status])}
            </Badge>
          </div>
          <div className="level-years">{level.tagline}</div>
        </div>
        {!locked && (
          <div style={{ textAlign: 'right', minWidth: 56 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-strong)' }}>
              {level.progress}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('career.met')}</div>
          </div>
        )}
      </div>

      <p className="level-desc">{level.description}</p>

      {!locked && (
        <div style={{ padding: '0 20px 14px' }}>
          <ProgressBar value={level.progress} />
        </div>
      )}

      {level.requirementMode === 'holistic' ? (
        <>
          <div className="level-req-head">
            <span>{level.requirementNote}</span>
          </div>
          <div style={{ padding: '14px 20px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {level.focusAreas?.map((f) => (
                <div className="req-item" key={f}>
                  <span className="req-check" style={{ color: 'var(--brand-600)' }}>
                    <Icon name="target" size={18} />
                  </span>
                  <div style={{ fontWeight: 500, color: 'var(--text-strong)' }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="level-req-head">
            <span>{level.requirementNote}</span>
            <span style={{ color: requirementSatisfied ? 'var(--success)' : 'var(--brand-600)' }}>
              {level.requirementMode === 'choose'
                ? t('career.chosenOf', { count: met, needed: level.chooseAtLeast ?? 0 })
                : t('career.requirements', { met, total: level.requirements.length })}
            </span>
          </div>
          <div>
            {level.requirements.map((req) => (
              <div className="req-item" key={req.label}>
                <span className="req-check" style={{ color: req.met ? 'var(--success)' : 'var(--gray-300)' }}>
                  <Icon name={req.met ? 'checkCircle' : 'circle'} size={18} />
                </span>
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-strong)' }}>{req.label}</div>
                  <div className="req-detail">{req.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function CareerPathPage() {
  const { t } = useLanguage()
  const current = careerPath.find((l) => l.status === 'current')!
  const currentIndex = careerPath.findIndex((l) => l.id === current.id)
  const next = careerPath[currentIndex + 1]
  const completedCount = careerPath.filter((l) => l.status === 'completed').length
  const currentMet = current.requirements.filter((r) => r.met).length

  const [selectedId, setSelectedId] = useState(current.id)
  const selected = careerPath.find((l) => l.id === selectedId) ?? current

  return (
    <div>
      <PageHead
        title={t('title.career')}
        subtitle={t('career.subtitle')}
      />

      {/* Roadmap tracker */}
      <Card>
        <div style={{ padding: '18px 20px 20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: 14 }}>
              {t('career.roadmap')}
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
              {t('career.levelsCompleted', { done: completedCount, total: careerPath.length })}
            </span>
          </div>
          <LevelRoadmap levels={careerPath} selectedId={selectedId} onSelect={setSelectedId} />
          <p className="mt-16" style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            {t('career.selectHint')}
          </p>
        </div>
      </Card>

      <div className="grid grid-main-2 mt-24">
        {/* Selected level detail */}
        <div>
          <LevelDetail level={selected} />
        </div>

        {/* Prediction / summary sidebar — always reflects the user's real current level */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="next-level-card">
            <div className="next-label">{t('career.nextReadiness')}</div>
            <div className="next-title">
              {current.name} → {next?.name ?? '—'}
            </div>
            <ProgressBar value={current.progress} />
            <div className="next-meta">
              <span>{t('career.percentComplete', { value: current.progress })}</span>
              <span>{t('career.estReadiness', { date: 'Mar 2027' })}</span>
            </div>
          </div>

          <Card>
            <CardHead title={t('career.missingRequirements')} icon="alert" />
            <div>
              {current.requirements
                .filter((r) => !r.met)
                .map((r) => (
                  <div className="req-summary-item" key={r.label}>
                    <span style={{ color: 'var(--danger)' }}>
                      <Icon name="alert" size={18} />
                    </span>
                    <div className="req-summary-info">
                      <div className="t">{r.label}</div>
                      <div className="d">{r.detail}</div>
                    </div>
                  </div>
                ))}
              {current.requirements.every((r) => r.met) && (
                <div style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {t('career.allMet')}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardHead title={t('career.fastSummary')} icon="checkCircle" />
            <div style={{ padding: '4px 20px 18px' }}>
              <div className="progress-label">
                <span>{t('career.requirementsMet')}</span>
                <span className="val">{currentMet}/{current.requirements.length}</span>
              </div>
              <ProgressBar value={current.progress} tone="violet" />
              <p
                className="mt-16"
                style={{ fontSize: 13, color: 'var(--text-secondary)' }}
              >
                {t('career.tip')} <Link to="/certifications">{t('nav.certifications')}</Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
