import { Link } from 'react-router-dom'
import { Badge, Card, CardHead, Icon, LevelDots, PageHead, ProgressBar } from '../components/ui'
import {
  careerPath,
  certifications,
  competencyAreas,
  currentUser,
  developmentGoals,
} from '../data/mock'
import { useLanguage } from '../i18n/LanguageContext'
import { languageNames, type Lang } from '../i18n/translations'

export default function Profile() {
  const { t, lang, setLang } = useLanguage()

  const currentLevel = careerPath.find((l) => l.status === 'current')
  const completedCerts = certifications.filter((c) => c.status === 'completed')
  const activeGoals = developmentGoals.filter((g) => g.status !== 'completed')
  const avgCompetency =
    Math.round((competencyAreas.reduce((s, c) => s + c.current, 0) / competencyAreas.length) * 10) / 10

  return (
    <div>
      <PageHead title={t('title.profile')} subtitle={t('profile.subtitle')} />

      <div className="grid grid-main-2">
        {/* Left: identity + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg,#2f6df0,#7c3aed)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {currentUser.avatarInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-strong)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  {currentUser.role} · {currentUser.office}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>
                  {t('profile.memberSince', { year: currentUser.memberSince })}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-icon tone-brand"><Icon name="level" size={20} /></div>
              <div><div className="stat-value">{currentUser.level}</div><div className="stat-label">{t('profile.currentLevel')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon tone-success"><Icon name="cert" size={20} /></div>
              <div><div className="stat-value">{completedCerts.length}</div><div className="stat-label">{t('profile.stats.certifications')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon tone-violet"><Icon name="goal" size={20} /></div>
              <div><div className="stat-value">{activeGoals.length}</div><div className="stat-label">{t('profile.stats.activePlans')}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon tone-info"><Icon name="comp" size={20} /></div>
              <div><div className="stat-value">{avgCompetency} / 5</div><div className="stat-label">{t('profile.stats.avgCompetency')}</div></div>
            </div>
          </div>

          {currentLevel && (
            <Card>
              <CardHead title={t('profile.stats.careerProgress')} icon="level" link="/career" linkLabel={t('common.viewAll')} />
              <div style={{ padding: '4px 20px 20px' }}>
                <div style={{ fontWeight: 650, color: 'var(--text-strong)', marginBottom: 8 }}>
                  {currentUser.level} → {currentUser.nextLevel}
                </div>
                <ProgressBar value={currentLevel.progress} tone="violet" />
                <div className="progress-label" style={{ marginTop: 8 }}>
                  <span>{t('career.percentComplete', { value: currentLevel.progress })}</span>
                  <span className="val">
                    {currentLevel.requirements.filter((r) => r.met).length} / {currentLevel.requirements.length}
                  </span>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <CardHead title={t('profile.completedCertifications')} icon="cert" link="/certifications" linkLabel={t('common.viewAll')} />
            <div style={{ padding: completedCerts.length ? '4px 0 8px' : '4px 20px 20px' }}>
              {completedCerts.length === 0 ? (
                <p style={{ padding: '0 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {t('profile.noCompletedCerts')}
                </p>
              ) : (
                completedCerts.map((c) => (
                  <div className="study-item" key={c.id}>
                    <span className="study-check done">
                      <Icon name="check" size={14} />
                    </span>
                    <div className="study-info">
                      <div className="t">{c.name}</div>
                      <div className="s">{c.issuer} · {c.level}</div>
                    </div>
                    <Badge tone="green">{t('common.status.completed')}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right: preferences + active plans + competency */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <CardHead title={t('profile.language')} icon="globe" />
            <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(Object.keys(languageNames) as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`btn ${lang === code ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Icon name="globe" size={16} />
                  {languageNames[code]}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title={t('profile.activeLearningPlans')} icon="goal" link="/learning" linkLabel={t('common.viewAll')} />
            <div style={{ padding: activeGoals.length ? '4px 20px 8px' : '4px 20px 20px' }}>
              {activeGoals.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('profile.noActiveGoals')}</p>
              ) : (
                activeGoals.map((g) => (
                  <div key={g.id} style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-strong)' }}>
                        {g.title}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>
                        {g.progress}%
                      </span>
                    </div>
                    <ProgressBar value={g.progress} height={6} tone="violet" />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHead title={t('profile.competencyOverview')} icon="comp" link="/competencies" linkLabel={t('common.viewAll')} />
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
                    <LevelDots current={c.current} target={c.target} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="ai-reco">
            <div className="ai-reco-head">
              <Icon name="sparkle" size={18} />
              {t('dashboard.aiRecommendation')}
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text)' }}>
              You're {currentLevel?.progress ?? 0}% of the way to {currentUser.nextLevel}. Keep going —
              your assistant can build a personalised plan to close the gap.
            </p>
            <div className="mt-16">
              <Link to="/assistant" className="btn btn-primary btn-sm">
                <Icon name="brain" size={15} />
                {t('dashboard.openAssistant')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
