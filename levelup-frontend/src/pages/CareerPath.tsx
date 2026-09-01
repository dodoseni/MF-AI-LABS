import { Link } from 'react-router-dom'
import { Badge, Card, CardHead, Icon, PageHead, ProgressBar } from '../components/ui'
import { careerPath } from '../data/mock'
import type { CareerLevel } from '../types'

const statTone: Record<string, string> = {
  completed: 'success',
  current: 'info',
  upcoming: 'gray',
}

function LevelCard({ level }: { level: CareerLevel }) {
  const isCurrent = level.status === 'current'
  const locked = level.status === 'upcoming'
  const met = level.requirements.filter((r) => r.met).length

  return (
    <div className={`level-card ${isCurrent ? 'current' : ''} ${locked ? 'level-card-locked' : ''}`}>
      <div className="level-card-top">
        <div className="level-badge" style={{ background: level.color }}>
          <Icon name="level" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="level-name">{level.name}</span>
            <Badge tone={statTone[level.status]} dot>
              {level.status}
            </Badge>
          </div>
          <div className="level-years">
            {level.yearsExperience} · {level.role}
          </div>
        </div>
        {!locked && (
          <div style={{ textAlign: 'right', minWidth: 56 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-strong)' }}>
              {level.progress}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>met</div>
          </div>
        )}
      </div>

      <p className="level-desc">{level.description}</p>

      {isCurrent && (
        <div style={{ padding: '0 20px 14px' }}>
          <ProgressBar value={level.progress} />
        </div>
      )}

      <div className="level-req-head">
        <span>
          Requirements · {met} of {level.requirements.length}
        </span>
        {isCurrent && (
          <span style={{ color: 'var(--brand-600)' }}>
            {level.requirements.length - met} to go
          </span>
        )}
      </div>
      <div>
        {level.requirements.map((req) => (
          <div className="req-item" key={req.label}>
            <span className="req-check" style={{ color: req.met ? 'var(--success)' : 'var(--gray-300)' }}>
              <Icon name={req.met ? 'checkCircle' : 'circle'} size={18} />
            </span>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text-strong)' }}>
                {req.label}
              </div>
              <div className="req-detail">{req.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CareerPathPage() {
  const current = careerPath.find((l) => l.status === 'current')!
  const completedCount = careerPath.filter((l) => l.status === 'completed').length
  const currentMet = current.requirements.filter((r) => r.met).length

  return (
    <div>
      <PageHead
        title="Career Progression"
        subtitle="See where you are today, what you need to reach the next level, and your full career roadmap at Sopra Steria."
      />

      {/* Roadmap tracker */}
      <Card>
        <div style={{ padding: '18px 20px 20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: 14 }}>
              Your career roadmap
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>
              {completedCount} of {careerPath.length} levels completed
            </span>
          </div>
          <div className="career-track">
            {careerPath.map((l) => (
              <div
                key={l.id}
                className={`track-seg ${l.progress > 0 ? 'filled' : ''} ${
                  l.status === 'current' ? 'current' : ''
                }`}
              />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {careerPath.map((l) => (
              <span key={l.id} style={{ color: l.status === 'upcoming' ? 'var(--text-muted)' : undefined }}>
                {l.name}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-main-2 mt-24">
        {/* Level cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {careerPath.map((l) => (
            <LevelCard key={l.id} level={l} />
          ))}
        </div>

        {/* Prediction / summary sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="next-level-card">
            <div className="next-label">Next level readiness</div>
            <div className="next-title">{current.name} → {careerPath.find((l) => l.status === 'upcoming')?.name}</div>
            <ProgressBar value={current.progress} />
            <div className="next-meta">
              <span>{current.progress}% complete</span>
              <span>Est. readiness: Mar 2027</span>
            </div>
          </div>

          <Card>
            <CardHead title="Missing requirements" icon="alert" />
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
            </div>
          </Card>

          <Card>
            <CardHead title="Fast summary" icon="checkCircle" />
            <div style={{ padding: '4px 20px 18px' }}>
              <div className="progress-label">
                <span>Requirements met</span>
                <span className="val">{currentMet}/{current.requirements.length}</span>
              </div>
              <ProgressBar value={current.progress} tone="violet" />
              <p
                className="mt-16"
                style={{ fontSize: 13, color: 'var(--text-secondary)' }}
              >
                Completing AZ-305 and SC-300 will push you to 90% readiness.
                Review these in the <Link to="/certifications">Certifications</Link>{' '}
                page.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
