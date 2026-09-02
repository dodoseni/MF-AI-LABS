import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  CardHead,
  Icon,
  LevelDots,
  PageHead,
  ProgressBar,
  StatCard,
} from '../components/ui'
import {
  careerPath,
  competencyAreas,
  currentUser,
  dashboardStats,
  recommendedActions,
} from '../data/mock'
import { useLanguage } from '../i18n/LanguageContext'

const impactIcon: Record<string, string> = {
  high: 'alert',
  medium: 'clock',
  low: 'check',
}

export default function Dashboard() {
  const { t } = useLanguage()
  const stats = [...dashboardStats]
  const principal = careerPath.find((l) => l.id === 'principal')!

  return (
    <div>
      <PageHead
        title={t('dashboard.greeting', { name: currentUser.name.split(' ')[0] })}
        subtitle={t('dashboard.subtitle')}
        actions={
          <Button variant="secondary">
            <Icon name="plus" size={16} />
            {t('common.logActivity')}
          </Button>
        }
      />

      {/* Hero / current level */}
      <div className="mb-16">
        <div className="next-level-card">
          <div className="next-label">{t('dashboard.progressToNext')}</div>
          <div className="next-title">
            {currentUser.level} → Principal Consultant
          </div>
          <ProgressBar value={principal.progress} />
          <div className="next-meta">
            <span>{t('career.percentComplete', { value: principal.progress })}</span>
            <span>
              {t('dashboard.requirementsMet', {
                met: principal.requirements.filter((r) => r.met).length,
                total: principal.requirements.length,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-4 mb-16">
        <StatCard icon={stats[0].icon} label={stats[0].label} value={stats[0].value} detail={stats[0].detail} tone={stats[0].tone} />
        <StatCard icon={stats[1].icon} label={stats[1].label} value={stats[1].value} detail={stats[1].detail} tone={stats[1].tone} />
        <StatCard icon={stats[2].icon} label={stats[2].label} value={stats[2].value} detail={stats[2].detail} tone={stats[2].tone} />
        <StatCard icon={stats[3].icon} label={stats[3].label} value={stats[3].value} detail={stats[3].detail} tone={stats[3].tone} />
      </div>

      <div className="grid grid-main-2">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <CardHead
              title={t('dashboard.recommendedActions')}
              icon="rocket"
              link="/career"
              linkLabel={t('dashboard.careerPathLink')}
            />
            <div style={{ marginTop: 8 }}>
              {recommendedActions.slice(0, 4).map((a) => (
                <div className="action-item" key={a.id}>
                  <span className={`action-tag icon-${a.impact}`}>
                    <Icon
                      name={impactIcon[a.impact]}
                      size={18}
                      className={`impact-${a.impact}`}
                    />
                  </span>
                  <div className="action-body">
                    <h4>{a.title}</h4>
                    <p>{a.description}</p>
                    <div className="action-meta">
                      <Badge tone={a.impact === 'high' ? 'red' : 'amber'} dot>
                        {a.impact} impact
                      </Badge>
                      <Link to={a.href} className="action-cta">
                        {a.cta}
                        <Icon name="arrowRight" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title={t('dashboard.competencyDevelopment')} icon="comp" link="/competencies" linkLabel={t('dashboard.allAreasLink')} />
            <div>
              {competencyAreas.map((c) => (
                <div className="comp-row" key={c.area}>
                  <div className="comp-icon">
                    <Icon name="target" size={17} />
                  </div>
                  <div>
                    <div className="comp-name">{c.label}</div>
                    <div className="comp-level">
                      Level {c.current} · target {c.target}
                    </div>
                  </div>
                  <div className="comp-right">
                    {c.current < c.target && (
                      <span className="growth-badge">
                        <Icon name="trendUp" size={13} />
                        +{c.current - c.previous} since last review
                      </span>
                    )}
                    <LevelDots current={c.current} target={c.target} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="ai-reco">
            <div className="ai-reco-head">
              <Icon name="sparkle" size={18} />
              {t('dashboard.aiRecommendation')}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text)' }}>
              Based on your profile, the highest-impact move is to complete{' '}
              <strong>AZ-305</strong> and book the <strong>SC-300</strong>{' '}
              security certification to unlock Principal Consultant.
            </p>
            <div className="mt-16">
              <Link to="/assistant" className="btn btn-primary btn-sm">
                <Icon name="brain" size={15} />
                {t('dashboard.openAssistant')}
              </Link>
            </div>
          </div>

          <Card>
            <CardHead title={t('dashboard.certificationProgress')} icon="cert" link="/certifications" linkLabel={t('dashboard.allLink')} />
            <div style={{ padding: '8px 20px 20px' }}>
              <ProgressBar value={66} />
              <div className="progress-label" style={{ marginTop: 8 }}>
                <span>{t('dashboard.completed', { done: 8, total: 12 })}</span>
                <span className="val">66%</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title={t('dashboard.upcomingMilestones')} icon="calendar" link="/learning" linkLabel={t('dashboard.learningPlanLink')} />
            <div style={{ padding: '4px 20px 16px' }}>
              {[
                { date: 'Sep 15', label: 'Complete AZ-305 Design module', done: true },
                { date: 'Oct 15', label: 'AZ-305 practice exam ≥ 70%', done: false },
                { date: 'Nov 30', label: 'Take AZ-305 exam', done: false },
              ].map((m) => (
                <div className="milestone" key={m.label}>
                  <div className={`milestone-check ${m.done ? 'done' : ''}`}>
                    {m.done && <Icon name="check" size={14} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>
                      {m.label}
                    </div>
                    <div className="milestone-date">{m.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
